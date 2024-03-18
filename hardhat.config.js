require("@nomicfoundation/hardhat-toolbox")
require("@nomicfoundation/hardhat-ethers")
require("ethers")
require("hardhat-deploy")
require("@matterlabs/hardhat-zksync-deploy")
require("@matterlabs/hardhat-zksync-solc")
require("@matterlabs/hardhat-zksync-verify")
require("dotenv").config()

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    zksolc: {
        version: "latest",
        settings: {},
    },

    defaultNetwork: "hardhat",

    networks: {
        hardhat: {
            zksync: false,
            chainId: 31337,
            blockConfirmations: 1,
        },
        localhost: {
            zksync: false,
            chainId: 31337,
        },
        sepolia: {
            zksync: false,
            url: SEPOLIA_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            chainId: 11155111,
            blockConfirmations: 6,
        },
        zkSyncTestnet: {
            zksync: true,
            url: "https://sepolia.era.zksync.dev",
            ethNetwork: SEPOLIA_RPC_URL,
            verifyURL:
                "https://explorer.sepolia.era.zksync.dev/contract_verification",
        },
    },

    etherscan: {
        apiKey: {
            sepolia: ETHERSCAN_API_KEY,
        },
    },

    solidity: {
        compilers: [
            {
                version: "0.8.22",
            },
        ],
    },

    namedAccounts: {
        deployer: {
            default: 0,
            1: 0,
        },
    },
}
