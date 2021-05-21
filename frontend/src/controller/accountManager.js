import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Dogecorn from "../contracts/Dogecorn.json";

const MATIC_NETWORK = 5777;

class AccountManager {
  constructor() {
    this.connected = false;
    this.busy = false;
    this.web3Provider = null;
    this.web3 = null;
    this.balance = 0;
    this.network = 0;
    this.accounts = null;
    this.contract = null;
  }

  async connect() {
    if (!this.connected) {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            infuraId: "INFURA_ID" // required
          }
        }
      };

      const web3Modal = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions // required
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
      console.log(`+++ file: accountManager.js - Line #32 ${this.network} \n`);
      if(this.network === MATIC_NETWORK){
        this.connected = true;
        console.log(`connected: ${this.accounts} ${typeof this.accounts}`);

        // Get the contract instance.
        const deployedNetwork = Dogecorn.networks[this.network];
        this.contract = new this.web3.eth.Contract(
          Dogecorn.abi,
          deployedNetwork && deployedNetwork.address,
        );
        return this.accounts;
      }
    }
  }

  async useContract(value){
    await this.contract.methods.set(value).send({ from: this.accounts[0] });
    return true;
  }

  async getContract(value){
    return await this.contract.methods.get().call();
  }

  getFormattedBalance(balance, decimals){
    let balance_BN = this.web3.utils.toBN(balance);
    let decimals_BN = this.web3.utils.toBN(10**decimals);
    let before_comma = balance_BN.div(decimals_BN).toString();
    let after_comma = balance_BN.mod(decimals_BN).toString();
    after_comma = after_comma.padStart(decimals, "0");
    return before_comma + "." + after_comma + " MATIC";
  }

  async getBalance(formatted = true) {
    const decimals = 18;
    this.balance = await this.web3.eth.getBalance(String(this.accounts));
    this.formatted_balance = this.getFormattedBalance(this.balance, decimals);
    return formatted ? this.formatted_balance : this.balance;
  }

}

export default AccountManager;
