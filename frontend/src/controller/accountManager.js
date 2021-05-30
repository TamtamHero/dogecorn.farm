import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Dogecorn from "../contracts/Dogecorn.json";
import Elon from "../contracts/Elon.json";
import Multicall from "../contracts/Multicall.json";
import IERC20 from "../contracts/IERC20.json";
import ERC20 from "../contracts/ERC20.json";
import { network, pools, infuraId } from "../Configs";
import BN from "bn.js";
import BigNumber from "bignumber.js";

BigNumber.config({ EXPONENTIAL_AT: 100 });

const MATIC_NETWORK = 80001;

class AccountManager {
  constructor() {
    this.connected = false;
    this.busy = false;
    this.web3Provider = null;
    this.web3 = null;
    this.balance = 0;
    this.network = network;
    this.networkId = 0;
    this.accounts = null;
    this.dogecorn = null;
    this.elon = null;
    this.multicall = null;
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
      this.networkId = await this.web3.eth.net.getId();
      if (this.networkId === MATIC_NETWORK) {
        this.connected = true;
        console.log(`connected: ${this.accounts} ${typeof this.accounts}`);

        // Get the contract instance.
        const deployedNetwork = Dogecorn.networks[this.networkId];
        this.dogecorn = new this.web3.eth.Contract(
          Dogecorn.abi,
          deployedNetwork && deployedNetwork.address
        );
        this.elon = new this.web3.eth.Contract(
          Elon.abi,
          deployedNetwork && Elon.networks[this.networkId].address
        );
        this.multicall = new this.web3.eth.Contract(
          Multicall.abi,
          deployedNetwork && Multicall.networks[this.networkId].address
        );
        return this.accounts;
      }
    }
  }

  async do_multicall(calls) {
    const multi = new this.web3.eth.Contract(
      Multicall.abi,
      this.multicall.options.address
    );

    const result = await multi.methods.aggregate(calls).call();
    return result;
  }

  async refreshPools() {
    const requests = [
      {
        name: "allowance",
        methodName: "allowance",
        params: [String(this.accounts), this.elon.options.address],
        target: ["tokenAddress", "lpTokenAddress"],
        abi: ERC20.abi,
      },
      {
        name: "balance",
        methodName: "balanceOf",
        params: [String(this.accounts)],
        target: ["tokenAddress", "lpTokenAddress"],
        abi: ERC20.abi,
      },
      {
        name: "deposited",
        methodName: "userInfo",
        params: ["pool.pid", String(this.accounts)],
        target: this.elon.options.address,
        abi: Elon.abi,
        extract: [2, 66],
      },
      {
        name: "harvest",
        methodName: "pendingDogecorn",
        params: ["pool.pid", String(this.accounts)],
        target: this.elon.options.address,
        abi: Elon.abi,
      },
      {
        name: "tvl",
        methodName: "balanceOf",
        params: [this.elon.options.address],
        target: ["tokenAddress", "lpTokenAddress"],
        abi: ERC20.abi,
      },
      {
        name: "tokenBalanceOfLp",
        methodName: "balanceOf",
        params: [String(this.accounts)],
        target: ["tokenAddress"],
        abi: ERC20.abi,
      },
      {
        name: "quoteTokenBalanceOfLp",
        methodName: "balanceOf",
        params: [String(this.accounts)],
        target: ["quoteTokenAddress"],
        abi: ERC20.abi,
      },
    ];
    let calls = [];

    calls = requests.reduce(
      (acc, request) => [
        ...acc,
        ...this.pools.map((pool) => {
          let target;
          // ugly AF but :goodenough:
          if (Array.isArray(request.target)) {
            if (request.target.length === 2 && !pool.singleTokenPool) {
              target = pool[request.target[1]][this.network];
            } else {
              target = pool[request.target[0]][this.network];
            }
          } else {
            target = request.target;
          }
          const methodInterface = request.abi.find(
            (f) => f.name === request.methodName
          );
          request.params = request.params.map((param) => {
            if (typeof param === "string") {
              if (param.startsWith("pool.")) {
                param = param.replace("pool.", "");
                param = pool[param];
              }
            }
            return param;
          });
          return [
            target.toLowerCase(),
            this.web3.eth.abi.encodeFunctionCall(
              methodInterface,
              request.params
            ),
          ];
        }),
      ],
      []
    );

    const { blockNumber, returnData } = await this.do_multicall(calls);

    console.log(`BLOCK: ${blockNumber}`);

    for (let i = 0; i < returnData.length; i++) {
      let data = returnData[i];
      const poolIndex = i % this.pools.length;
      const requestIndex = Math.floor(i / this.pools.length);
      const field = requests[requestIndex].name;
      const extract = requests[requestIndex]["extract"];
      if (extract) {
        data = "0x" + data.slice(extract[0], extract[1]);
      }
      const bn = new BigNumber(data);
      this.pools[poolIndex][field] = bn.toString();
    }
    console.log(this.pools);
    return [...this.pools];
  }

  async setTokenAllowance(tokenAddress) {
    const max256 = new BN(
      "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
      "hex"
    );
    const contract = new this.web3.eth.Contract(IERC20.abi, tokenAddress);
    await contract.methods
      .approve(this.elon.options.address, max256)
      .send({ from: this.accounts[0] });
    return true;
  }

  async getTokenAllowance(tokenAddress, spender) {
    const contract = new this.web3.eth.Contract(IERC20.abi, tokenAddress);
    const allowance = await contract.methods
      .allowance(String(this.accounts), spender)
      .call();
    return allowance;
  }

  async getMaticBalance() {
    this.balance = await this.web3.eth.getBalance(String(this.accounts));
    return this.balance;
  }

  async getTokenBalance(address, account) {
    const contract = new this.web3.eth.Contract(IERC20.abi, address);
    const balance = await contract.methods.balanceOf(account).call();
    return balance;
  }

  async getDepositedTokenBalance(pid) {
    const balance = await this.elon.methods
      .getDepositedBalance(pid, String(this.accounts))
      .call();
    console.log(balance);
    return balance;
  }

  async getHarvestableBalance(pid) {
    const harverstableBalance = await this.elon.methods
      .pendingDogecorn(pid, String(this.accounts))
      .call();
    return harverstableBalance;
  }

  async deposit(pid, amount) {
    return await this.elon.methods
      .deposit(pid, amount)
      .send({ from: String(this.accounts[0]) })
      .then(async () => await this.refreshPools());
  }

  async harvest(pid) {
    return await this.deposit(pid, 0);
  }

  async withdraw(pid, amount) {
    return await this.elon.methods
      .withdraw(pid, amount)
      .send({ from: String(this.accounts[0]) });
  }
}

export default AccountManager;
