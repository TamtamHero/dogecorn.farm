import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { infuraId, network, chain_id } from "../Configs.js";
import { toast } from "react-toastify";

let web3Instance = null;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: infuraId[network],
    },
  },
};

async function getWeb3(silent = true) {
  if (!web3Instance) {
    const web3Modal = new Web3Modal({
      // network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions, // required
    });

    let web3Provider;
    try {
      web3Provider = await web3Modal.connect();
    } catch (error) {
      !silent &&
        toast.error(
          "Failed connecting, please retry with a different wallet provider"
        );
      return web3Instance;
    }
    const web3 = new Web3(web3Provider);
    const networkId = await web3.eth.net.getId();
    if (networkId === chain_id) {
      web3Instance = web3;
      web3Instance.eth
        .getAccounts()
        .then((accounts) => console.log(`connected: ${accounts[0]}`));
    } else {
      !silent &&
        toast.error(`Wrong network: Please select Matic/Polygon network first`);
    }
  }
  return web3Instance;
}

export default getWeb3;
