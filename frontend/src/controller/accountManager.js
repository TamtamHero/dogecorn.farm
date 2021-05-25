import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Dogecorn from "../contracts/Dogecorn.json";
import Elon from "../contracts/Elon.json";
import IERC20 from "../contracts/IERC20.json";
import { network, pools, infuraId } from "../Configs";
import BN from "bn.js";

const MATIC_NETWORK = 80001;

class AccountManager {
  constructor() {
    this.connected = false;
    this.busy = false;
    this.web3Provider = null;
    this.web3 = null;
    this.balance = 0;
    this.network = 0;
    this.accounts = null;
    this.dogecorn = null;
    this.elon = null;
    this.pools = pools;
  }

  async connect() {
    if (!this.connected) {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            infuraId: infuraId[network],
          },
        },
      };

      const web3Modal = new Web3Modal({
        // network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions, // required
      });

      this.web3Provider = await web3Modal.connect();
      try {
        // Request account access
        this.accounts = await this.web3Provider.request({
          method: "eth_requestAccounts",
          params: [],
        });
      } catch (error) {
        // User denied account access...
        console.error(`User denied account access: ${error}`);
      }
      this.web3 = new Web3(this.web3Provider);
      this.network = await this.web3.eth.net.getId();
      if (this.network === MATIC_NETWORK) {
        this.connected = true;
        console.log(`connected: ${this.accounts} ${typeof this.accounts}`);

        // Get the contract instance.
        const deployedNetwork = Dogecorn.networks[this.network];
        this.dogecorn = new this.web3.eth.Contract(
          Dogecorn.abi,
          deployedNetwork && deployedNetwork.address
        );
        this.elon = new this.web3.eth.Contract(
          Elon.abi,
          deployedNetwork && Elon.networks[this.network].address
        );
        await this.refreshPools();
        console.log(this.pools);
        return this.accounts;
      }
    }
  }

  async refreshPools() {
    await this.getBalances();
    await this.getTokenAllowances();
  }

  async setTokenAllowance(tokenAddress) {
    const max256 = new BN(
      "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
      "hex"
    );
    let contract = new this.web3.eth.Contract(IERC20.abi, tokenAddress);
    await contract.methods
      .approve(this.elon.options.address, max256)
      .send({ from: this.accounts[0] });
    return true;
  }

  async getTokenAllowances() {
    this.pools.earn = await Promise.all(
      this.pools.earn.map(async (pool) => ({
        ...pool,
        allowance: await this.getTokenAllowance(
          pool.tokenAddress,
          this.elon.options.address
        ),
      }))
    );
  }

  async getTokenAllowance(tokenAddress, spender) {
    let contract = new this.web3.eth.Contract(IERC20.abi, tokenAddress);
    let allowance = await contract.methods
      .allowance(String(this.accounts), spender)
      .call();
    return allowance;
  }

  async getBalances() {
    this.pools.earn = await Promise.all(
      this.pools.earn.map(async (pool) => ({
        ...pool,
        balance: await this.getTokenBalance(
          pool.tokenAddress,
          String(this.accounts)
        ),
        deposited: await this.getTokenBalance(
          pool.tokenAddress,
          this.elon.options.address
        ),
      }))
    );
  }

  async getMaticBalance() {
    this.balance = await this.web3.eth.getBalance(String(this.accounts));
    return this.balance;
  }

  async getTokenBalance(address, account) {
    let contract = new this.web3.eth.Contract(IERC20.abi, address);
    let balance = await contract.methods.balanceOf(account).call();
    return balance;
  }
}

export default AccountManager;
