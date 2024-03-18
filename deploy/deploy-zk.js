const { utils, Wallet } = require("zksync-ethers")
const ethers = require("ethers")
const { HardhatRuntimeEnvironment } = require("hardhat/types")
const { Deployer } = require("@matterlabs/hardhat-zksync-deploy")
const dotenv = require("dotenv")

// An example of a deploy script that will deploy and call a simple contract.
module.exports = async function (hre) {
    dotenv.config()

    const privateKey = process.env.PRIVATE_KEY
    if (!privateKey) {
        throw new Error("PRIVATE_KEY is not set")
    }

    console.log(`Running deploy script`)

    // Initialize the wallet.
    const wallet = new Wallet(privateKey)

    // Create deployer object and load the artifact of the contract we want to deploy.
    const deployer = new Deployer(hre, wallet)
    // Load contract
    const artifact = await deployer.loadArtifact("EthWallet")

    // Deploy this contract. The returned object will be of a `Contract` type,
    // similar to the ones in `ethers`.

    const ethWallet = await deployer.deploy(artifact)

    // Get the contract address.
    const ethWalletContractAddress = await ethWallet.getAddress()

    // Show the contract info.
    console.log(
        `${artifact.contractName} was deployed to ${ethWalletContractAddress}`,
    )

    // Verify the contract on Etherscan.

    console.log(`Verifying the contract on ZkSync explorer...`)

    const verificationId = await hre.run("verify:verify", {
        address: ethWalletContractAddress,
        contract: "contracts/EthWallet.sol:EthWallet",
        // constructorArguments: [...]
    })

    console.log(`Verification id: ${verificationId}`)
}
