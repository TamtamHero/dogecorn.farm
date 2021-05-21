var Dogecorn = artifacts.require("Dogecorn");

module.exports = async function(deployer) {

  await deployer.deploy(Dogecorn);
};
