const { assert, expect } = require("chai")
const hre = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("EthWallet", async function () {
          let ethWallet
          // let userBalance
          // let withdrawnToday
          // let lastWithdrawalTime
          // let depositAmount
          // let withdrawalAmount
          // let userCount
          // const dailyWithdrawalLimit = hre.ethers.utils.formatEther(10)

          beforeEach(async function () {
              ;[user1, user2] = await hre.ethers.getSigners()
              const EthWallet = await hre.ethers.getContractFactory("EthWallet")
              ethWallet = await EthWallet.deploy()
              await ethWallet.waitForDeployment()

              console.log("pancakes")
          })

          describe("deposit", async function () {
              it("Deposit amount must be above zero", async function () {
                  await expect(
                      ethWallet.deposit(),
                  ).to.be.revertedWithCustomError(
                      ethWallet,
                      "EthWallet__DepositMustBeAboveZero",
                  )
              })
          })
      })
