var Dogecorn = artifacts.require("Dogecorn");
var Elon = artifacts.require("Elon");

module.exports = async function (deployer) {
  await deployer.deploy(
    Elon,
    Dogecorn.address,
    "0xD87A3958f35A41F4b8Df0Ec9c3a7AcFE140d2c42", // dev addr
    "0x5BFD72Fac3Ce05B49F2CB864e904da2A7A707010", // fee addr
    10, // _dogecornPerBlock
    0 // startBlock
  );
};
