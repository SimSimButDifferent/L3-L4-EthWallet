const hre = require("hardhat");
const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

async function main() {
  if (developmentChains.includes(network.name)) {
    const EthWallet = await hre.ethers.getContractFactory("EthWallet");

    console.log("Deploying...");

    const ethWallet = await EthWallet.deploy();
    console.log(`EthWallet deployed to: ${ethWallet.target}`);
  }

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    const EthWallet = await hre.ethers.getContractFactory("EthWallet");

    console.log("Deploying...");

    const ethWallet = await EthWallet.deploy();
    console.log(`EthWallet deployed to: ${ethWallet.target}`);

    const desiredConfirmations = 2;
    const receipt =
      await EthWallet.deploymentTransaction().wait(desiredConfirmations);

    console.log(`Transaction confirmed. Block number: ${receipt.blockNumber}`);
    await hre.run("verify:etherscan", { address: EthWallet.target });
    console.log("EthWallet verified!");
    console.log("--------------------------------------------------");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
