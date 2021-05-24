import logo from "./logo.svg";
import "./App.css";
import packageJson from "../package.json";
import Launchpad from "./LaunchPad";
import StatusBar from "./StatusBar";
import AppExplanations from "./AppExplanations";
import AccountManager from "./controller/accountManager";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "react-global-configuration";
import configuration from "./config.json";
import AnimatedWave from "./AnimatedWave.js";
import { dogecorn_addr } from "./Configs.js";
import { getFormattedBalance } from "./helpers.js";

config.set(configuration);

const accountManager = new AccountManager();

function App() {
  const [account, setAccount] = useState("Not connected");
  const [maticBalance, setMaticBalance] = useState(0);
  const [dogeBalance, setDogeBalance] = useState(0);

  return (
    <div className="App">
      <ToastContainer hideProgressBar={true} position="top-left" />
      <div className="wave">
        <AnimatedWave height={1000} color="#824834" />
      </div>
      <div className="Connect-button">
        <StatusBar
          account={account}
          maticBalance={maticBalance}
          dogeBalance={dogeBalance}
          onClick={() =>
            accountManager.connect().then((account) => {
              if (!account) {
                toast.error(
                  `Wrong network: Please select Matic/Polygon network first`
                );
              } else {
                setAccount(account);
                accountManager.getMaticBalance().then((balance) => {
                  setMaticBalance(balance);
                });
                accountManager
                  .getTokenBalance(dogecorn_addr)
                  .then((balance) => {
                    setDogeBalance(balance);
                  });
              }
            })
          }
        />
      </div>
      <div className="App-banner">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="App-title">DogeCorn Farm</p>
      </div>
      <header className="App-header">
        <Launchpad pools={accountManager.pools}></Launchpad>
        <AppExplanations></AppExplanations>
        <div className="App-footer">
          <p>
            A modest Web App built by{" "}
            <a
              href="https://github.com/TamtamHero"
              target="_blank"
              rel="noopener noreferrer"
            >
              TamtamHero
            </a>{" "}
            with React, hosted on Github. v{`${packageJson.version}`}.{" "}
            <a href="https://github.com/TamtamHero/dogecorn.farm/">
              PRs welcomed and appreciated ✨
            </a>
          </p>
          <p>
            Ethereum/Polygon donation:{" "}
            <a
              h
              href="https://explorer-mainnet.maticvigil.com/address/0x97d5CeBb87cBeB641c0C17C2d4d29339CDCF91D2/transactions"
              target="_blanc"
              rel="noopener noreferrer"
            >
              0x97d5CeBb87cBeB641c0C17C2d4d29339CDCF91D2
            </a>
          </p>
        </div>
      </header>
    </div>
  );
}

export default App;
