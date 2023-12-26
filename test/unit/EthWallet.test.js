const { assert, expect } = require("chai")
const hre = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("EthWallet", async function () {
          let ethWallet
          let userBalance
          let initialContractBalance
          // let withdrawnToday
          // let lastWithdrawalTime
          let depositAmount
          // let withdrawalAmount
          // const dailyWithdrawalLimit = hre.ethers.parseEther("10")

          beforeEach(async function () {
              ;[user1, user2] = await hre.ethers.getSigners()
              const EthWallet = await hre.ethers.getContractFactory("EthWallet")
              ethWallet = await EthWallet.deploy()
              await ethWallet.waitForDeployment()
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

              it("Should allow a user to deposit ether", async function () {
                  depositAmount = hre.ethers.parseEther("1") // 1 Ether
                  const initialContractBalance =
                      await hre.ethers.provider.getBalance(ethWallet.target)

                  // Perform the deposit
                  const depositTx = await ethWallet.deposit({
                      value: depositAmount,
                  })

                  // Wait for the transaction to be mined
                  await depositTx.wait()

                  // Get the new contract balance
                  const newContractBalance =
                      await hre.ethers.provider.getBalance(ethWallet.target)

                  // Check if the contract balance increased by the deposit amount
                  expect(newContractBalance).to.equal(
                      initialContractBalance + depositAmount,
                  )
              })
          })
      })
