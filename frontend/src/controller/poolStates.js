import Elon from "../contracts/Elon.json";
import Multicall from "../contracts/Multicall.json";
import ERC20 from "../contracts/ERC20.json";
import { elon_addr, multicall_addr, pools, network } from "../Configs.js";
import BigNumber from "bignumber.js";
import getWeb3 from "./getWeb3";

BigNumber.config({ EXPONENTIAL_AT: 100 });

async function do_multicall(calls) {
  const web3 = await getWeb3();
  const multi = new web3.eth.Contract(Multicall.abi, multicall_addr);

  const result = await multi.methods.aggregate(calls).call();
  return result;
}

async function refreshPools() {
  const web3 = await getWeb3();
  if (!web3) {
    return pools;
  }
  const accounts = await web3.eth.getAccounts();
  const user_addr = accounts[0];

  const requests = [
    {
      name: "allowance",
      methodName: "allowance",
      abi: ERC20.abi,
      target: ["tokenAddress", "lpTokenAddress"],
      params: [user_addr, elon_addr],
    },
    {
      name: "balance",
      methodName: "balanceOf",
      abi: ERC20.abi,
      target: ["tokenAddress", "lpTokenAddress"],
      params: [user_addr],
    },
    {
      name: "deposited",
      methodName: "userInfo",
      abi: Elon.abi,
      extract: [2, 66],
      target: elon_addr,
      params: ["pool.pid", user_addr],
    },
    {
      name: "harvest",
      methodName: "pendingDogecorn",
      abi: Elon.abi,
      target: elon_addr,
      params: ["pool.pid", user_addr],
    },
    {
      name: "tvl",
      methodName: "balanceOf",
      abi: ERC20.abi,
      target: ["tokenAddress", "lpTokenAddress"],
      params: [elon_addr],
    },
    {
      name: "tokenBalanceOfLp",
      methodName: "balanceOf",
      abi: ERC20.abi,
      target: ["tokenAddress"],
      params: [user_addr],
    },
    {
      name: "quoteTokenBalanceOfLp",
      methodName: "balanceOf",
      abi: ERC20.abi,
      target: ["quoteTokenAddress"],
      params: [user_addr],
    },
  ];
  let calls = [];

  calls = requests.reduce(
    (acc, request) => [
      ...acc,
      ...pools.map((pool) => {
        let target;
        // ugly AF but :goodenough:
        if (Array.isArray(request.target)) {
          if (request.target.length === 2 && !pool.singleTokenPool) {
            target = pool[request.target[1]][network];
          } else {
            target = pool[request.target[0]][network];
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
          web3.eth.abi.encodeFunctionCall(methodInterface, request.params),
        ];
      }),
    ],
    []
  );

  const { blockNumber, returnData } = await do_multicall(calls);

  console.log(`BLOCK: ${blockNumber}`);

  for (let i = 0; i < returnData.length; i++) {
    let data = returnData[i];
    const poolIndex = i % pools.length;
    const requestIndex = Math.floor(i / pools.length);
    const field = requests[requestIndex].name;
    const extract = requests[requestIndex]["extract"];
    if (extract) {
      data = "0x" + data.slice(extract[0], extract[1]);
    }
    const bn = new BigNumber(data);
    pools[poolIndex][field] = bn.toString();
  }
  console.log(pools);
  return [...pools];
}

export default refreshPools;
