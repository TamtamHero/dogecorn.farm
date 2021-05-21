const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const web3 = new Web3();

const path = require("path");

const getEnv = env => {
  const value = process.env[env];
  if (typeof value === 'undefined') {
    throw new Error(`${env} has not been set.`);
  }
  return value;
};

const mnemonic = getEnv('ETH_WALLET_MNEMONIC');
const liveNetwork = "https://polygon-mainnet.infura.io/v3/fa6996670db3490880cd7210fbe474c2";
const liveNetworkId = 137;

const testNetwork = "https://polygon-mumbai.infura.io/v3/fa6996670db3490880cd7210fbe474c2"
const testNetworkId = 80001;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "frontend/src/contracts"),
  networks: {
    live: {
      provider: () => new HDWalletProvider(mnemonic, liveNetwork),
      network_id: liveNetworkId,
      chainId: liveNetworkId,
      gasPrice: web3.utils.toWei('1', 'gwei'),
      confirmations: 2,
      timeoutBlocks: 200
    },
    testnet: {
      provider: () => new HDWalletProvider(mnemonic, testNetwork),
      network_id: testNetworkId,
      chainId: testNetworkId,
      gasPrice: web3.utils.toWei('1', 'gwei'),
      confirmations: 2,
      timeoutBlocks: 200
    }
  },
  compilers: {
    solc: {
      version: "0.7.6",
    },
  }
};
