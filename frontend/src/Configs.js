export const pools = {
  earn: [
    {
      title: "LIQUIDITY MINING",
      description: "DOGECORN-MATIC LP",
      token: "DOGECORN-MATIC",
      tokenAddress: "0x7bC80c08D45F0C88e42912C55D5377D4968F8EFA",
      incentive: "true",
      decimals: 18,
    },
    {
      title: "STAKING",
      description: "STAKE DOGECORN",
      token: "DOGECORN",
      tokenAddress: "0x7bC80c08D45F0C88e42912C55D5377D4968F8EFA",
      decimals: 18,
    },
  ],
  farm: [],
};

export const infuraId = {
  testnet:
    "https://polygon-mumbai.infura.io/v3/fa6996670db3490880cd7210fbe474c2",
  mainnet:
    "https://polygon-mumbai.infura.io/v3/fa6996670db3490880cd7210fbe474c2",
};

export const dogecorn_addr = pools.earn[1].tokenAddress;

export const network = "mainnet";
