import Dogecorn from "./contracts/Dogecorn.json";
import Elon from "./contracts/Elon.json";

export const pools = [
  {
    type: "doge",
    title: "STAKING",
    description: "🌽 STAKE DOGECORN 🌽",
    token: "DOGECORN",
    quoteToken: "MATIC",
    singleTokenPool: true,
    tokenAddress: {
      testnet: "0x7bC80c08D45F0C88e42912C55D5377D4968F8EFA",
      local: "0xAc4fa9Dfa287226338c43C5dE70B1C747d12da0B",
    },
    quoteTokenAddress: {
      testnet: "0x7bC80c08D45F0C88e42912C55D5377D4968F8EFA",
      local: "0xAc4fa9Dfa287226338c43C5dE70B1C747d12da0B",
    },
    lpTokenAddress: {
      testnet: "0x7bC80c08D45F0C88e42912C55D5377D4968F8EFA",
      local: "0xAc4fa9Dfa287226338c43C5dE70B1C747d12da0B",
    },
    decimals: 18,
    pid: 0,
  },
  {
    type: "doge",
    title: "LIQUIDITY MINING",
    description: "🍣 DOGECORN-MATIC LP 🍣",
    token: "DOGECORN",
    quoteToken: "WMATIC",
    singleTokenPool: false,
    tokenAddress: {
      testnet: "0x7bC80c08D45F0C88e42912C55D5377D4968F8EFA",
      local: "0x1765dE620C8F331fCF08d731e5A552DC8F829b5A",
    },
    quoteTokenAddress: {
      testnet: "0x7bC80c08D45F0C88e42912C55D5377D4968F8EFA",
      local: "0xAc4fa9Dfa287226338c43C5dE70B1C747d12da0B",
    },
    lpTokenAddress: {
      testnet: "0x7bC80c08D45F0C88e42912C55D5377D4968F8EFA",
      local: "0xAc4fa9Dfa287226338c43C5dE70B1C747d12da0B",
    },
    incentive: "true",
    decimals: 18,
    pid: 0,
  },
];

export const infuraId = {
  testnet:
    "https://polygon-mumbai.infura.io/v3/fa6996670db3490880cd7210fbe474c2",
  mainnet:
    "https://polygon-mumbai.infura.io/v3/fa6996670db3490880cd7210fbe474c2",
  local: "http://127.0.0.1:7545",
};

export const network = "local";

const CHAIN_IDS = {
  mainnet: 137,
  testnet: 80001,
  local: 80001,
};

export const chain_id = CHAIN_IDS[network];

export const dogecorn_addr = Dogecorn.networks[chain_id].address;
export const elon_addr = Elon.networks[chain_id].address;

const multicall_instances = {
  mainnet: "0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507",
  testnet: "0x08411ADd0b5AA8ee47563b146743C13b3556c9Cc",
  local: "0xBDa34655B2Af92847872272947725A19F79fF652",
};

export const multicall_addr = multicall_instances[network];
