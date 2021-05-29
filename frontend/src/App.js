import logo from "./logo.svg";
import dogecorn_logo from "./dogecorn-field.png";
// import dogecorn_logo from "./dogecorn-heap.png";
import "./App.css";
import packageJson from "../package.json";
import Launchpad from "./LaunchPad";
import StatusBar from "./StatusBar";
import AppExplanations from "./AppExplanations";
import AccountManager from "./controller/accountManager";
import React, { useState, useCallback } from "react";
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
  const [pools, setPools] = useState(accountManager.pools);

  const updatePools = useCallback(() => {
    return new Promise(async (resolve) => {
      let data = await accountManager.refreshPools();
      setPools(data);
      resolve();
    });
  }, []);

  return (
    <div className="App">
      <ToastContainer hideProgressBar={true} position="top-left" />
      {/* <div className="wave">
        <AnimatedWave height={300} color="#8288D4" />
      </div> */}
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
                  .getTokenBalance(dogecorn_addr, String(account))
                  .then((balance) => {
                    setDogeBalance(balance);
                  });
              }
              updatePools();
            })
          }
        />
      </div>
      <div className="App-banner">
        <img src={dogecorn_logo} className="App-logo" alt="logo" />
        <p className="App-title">DogeCorn</p>
      </div>
      <header className="App-header">
        <Launchpad
          accountManager={accountManager}
          pools={pools}
          onUpdate={updatePools}
        ></Launchpad>
        <AppExplanations></AppExplanations>
        <div className="App-footer">
          <i>
            A simple Polygon Farm by{" "}
            <a
              href="https://github.com/TamtamHero"
              target="_blank"
              rel="noopener noreferrer"
            >
              TamtamHero
            </a>
          </i>
        </div>
      </header>
    </div>
  );
}

export default App;
