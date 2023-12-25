const { assert, expect } = require("chai");
const hre = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("EthWallet", async function () {
      let ethWallet;
      let userBalance;
      let withdrawnToday;
      let lastWithdrawalTime;
      let depositAmount;
      let withdrawalAmount;
      let userCount;
      const dailyWithdrawalLimit = hre.ethers.utils.formatEther(10);

      beforeEach(async function () {
        [user1] = await hre.ethers.getSigners();
        const EthWallet = await hre.ethers.getContractFactory("EthWallet");
        ethWallet = await EthWallet.deploy();
        await ethWallet.waitForDeployment();
      });
    });
