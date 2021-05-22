import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Dogecorn from "../contracts/Dogecorn.json";
import IERC20 from "../contracts/IERC20.json";

const MATIC_NETWORK = 80001;

class AccountManager {
  constructor(pools) {
    this.connected = false;
    this.busy = false;
    this.web3Provider = null;
    this.web3 = null;
    this.balance = 0;
    this.network = 0;
    this.accounts = null;
    this.dogecorn = null;
    this.pools = pools;
  }

  async connect() {
    if (!this.connected) {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            infuraId: "INFURA_ID", // required
          },
        },
      };

      const web3Modal = new Web3Modal({
        network: "mainnet", // optional
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
        await this.getBalances();
        console.log(this.pools);
        return this.accounts;
      }
    }
  }

  async useContract(value) {
    await this.contract.methods.set(value).send({ from: this.accounts[0] });
    return true;
  }

  async getBalances() {
    this.pools.earn = await Promise.all(
      this.pools.earn.map(async (pool) => ({
        ...pool,
        balance: await this.getTokenBalance(pool.tokenAddress),
      }))
    );
  }

  async getMaticBalance(formatted = true) {
    this.balance = await this.web3.eth.getBalance(String(this.accounts));
    this.formatted_balance = this.getFormattedBalance(this.balance, "MATIC");
    return formatted ? this.formatted_balance : this.balance;
  }

  async getTokenBalance(address, formatted = true) {
    let contract = new this.web3.eth.Contract(IERC20.abi, address);
    let balance = await contract.methods
      .balanceOf(String(this.accounts))
      .call();
    return formatted ? this.getFormattedBalance(balance, "") : balance;
  }

  getFormattedBalance(balance, ticker, decimals = 18) {
    let balance_BN = this.web3.utils.toBN(balance);
    let decimals_BN = this.web3.utils.toBN(10 ** decimals);
    let before_comma = balance_BN.div(decimals_BN).toString();
    let after_comma = balance_BN.mod(decimals_BN).toString();
    after_comma = after_comma.padStart(decimals, "0");

    return (
      before_comma + "." + after_comma + (ticker.length ? " " + ticker : "")
    );
  }
}

export default AccountManager;
