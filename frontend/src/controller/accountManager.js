import Dogecorn from "../contracts/Dogecorn.json";
import Elon from "../contracts/Elon.json";
import IERC20 from "../contracts/IERC20.json";
import { network, pools, dogecorn_addr, elon_addr } from "../Configs";
import BN from "bn.js";
import getWeb3 from "./getWeb3";
import refreshPools from "./poolStates";
class AccountManager {
  constructor() {
    this.connected = false;
    this.busy = false;
    this.web3Provider = null;
    this.web3 = null;
    this.balance = 0;
    this.network = network;
    this.networkId = 0;
    this.account = null;
    this.dogecorn = null;
    this.elon = null;
    this.pools = pools;
  }

  async connect(onConnect) {
    if (!this.connected) {
      this.web3 = await getWeb3(false);
      if (!this.web3) {
        return null;
      }
      console.log(this.web3);
      const accounts = await this.web3.eth.getAccounts();
      this.account = accounts[0];
      this.connected = true;

      // Get the contract instance.
      this.dogecorn = new this.web3.eth.Contract(Dogecorn.abi, dogecorn_addr);
      this.elon = new this.web3.eth.Contract(Elon.abi, elon_addr);

      onConnect();
    }
  }

  async setTokenAllowance(tokenAddress) {
    const max256 = new BN(
      "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
      "hex"
    );
    const contract = new this.web3.eth.Contract(IERC20.abi, tokenAddress);
    await contract.methods
      .approve(this.elon.options.address, max256)
      .send({ from: this.account });
    return true;
  }

  async getTokenAllowance(tokenAddress, spender) {
    const contract = new this.web3.eth.Contract(IERC20.abi, tokenAddress);
    const allowance = await contract.methods
      .allowance(this.account, spender)
      .call();
    return allowance;
  }

  async getMaticBalance() {
    this.balance = await this.web3.eth.getBalance(this.account);
    return this.balance;
  }

  async getTokenBalance(address, account) {
    const contract = new this.web3.eth.Contract(IERC20.abi, address);
    const balance = await contract.methods.balanceOf(account).call();
    return balance;
  }

  async getDepositedTokenBalance(pid) {
    const balance = await this.elon.methods
      .getDepositedBalance(pid, this.account)
      .call();
    console.log(balance);
    return balance;
  }

  async getHarvestableBalance(pid) {
    const harverstableBalance = await this.elon.methods
      .pendingDogecorn(pid, this.account)
      .call();
    return harverstableBalance;
  }

  async deposit(pid, amount) {
    return await this.elon.methods
      .deposit(pid, amount)
      .send({ from: String(this.account) })
      .then(async () => await refreshPools());
  }

  async harvest(pid) {
    return await this.deposit(pid, 0);
  }

  async withdraw(pid, amount) {
    return await this.elon.methods
      .withdraw(pid, amount)
      .send({ from: String(this.account) })
      .then(async () => await refreshPools());
  }
}

export default AccountManager;
