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
          let withdrawalAmount
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

              it("Should allow a user to deposit ether to the contract", async function () {
                  // ASK WHY THIS TEST TAKES NO TIME AND DOES IT MATTER?
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

              it("maps users addresses to their balances after deposit", async function () {
                  depositAmount = hre.ethers.parseEther("1")
                  const user2DepositAmount = hre.ethers.parseEther("2")
                  // user1 deposit and check balance
                  const depositTx = await ethWallet.deposit({
                      value: depositAmount,
                  })

                  await depositTx.wait()

                  userBalance = await ethWallet.getUserBalance()

                  expect(await ethWallet.getUserBalance()).to.equal(
                      depositAmount,
                  )

                  // user2 deposit and check balance
                  const depositTxUser2 = await ethWallet
                      .connect(user2)
                      .deposit({ value: user2DepositAmount })

                  await depositTxUser2.wait()

                  expect(
                      await ethWallet.connect(user2).getUserBalance(),
                  ).to.equal(user2DepositAmount)
              })

              it("Allows multiple deposits by the same user", async function () {
                  depositAmount = hre.ethers.parseEther("1")
                  const depositAmount2 = hre.ethers.parseEther("3")

                  const depositTx1 = await ethWallet.deposit({
                      value: depositAmount,
                  })

                  await depositTx1.wait()

                  const depositTx2 = await ethWallet.deposit({
                      value: depositAmount2,
                  })

                  await depositTx2.wait()

                  userBalance = await ethWallet.getUserBalance()

                  expect(await ethWallet.getUserBalance()).to.equal(
                      depositAmount + depositAmount2,
                  )
              })
          })

          describe("withdraw", async function () {
              beforeEach(async function () {
                  depositAmount = hre.ethers.parseEther("1")
                  const depositTx = await ethWallet.deposit({
                      value: depositAmount,
                  })
                  await depositTx.wait()
              })

              it("Withdrawal amount must be above zero", async function () {
                  await expect(
                      ethWallet.withdraw(0),
                  ).to.be.revertedWithCustomError(
                      ethWallet,
                      "EthWallet__WithdrawalMustBeAboveZero",
                  )
              })

              it("Does not allow withdrawals above the amount held in the contract", async function () {
                  const overdrawAmount = hre.ethers.parseEther("2")

                  await expect(
                      ethWallet.withdraw(overdrawAmount),
                  ).to.be.revertedWithCustomError(
                      ethWallet,
                      "EthWallet_InsufficientContractBalance()",
                  )
              })

              it("Does not allow withdrawals if users balance is empty", async function () {
                  await expect(
                      ethWallet.connect(user2).withdraw(depositAmount),
                  ).to.be.revertedWithCustomError(
                      ethWallet,
                      "EthWallet__WalletIsEmpty()",
                  )
              })

              it("Does not allow withdrawals if user balance is below amount requested", async function () {
                  const user2DepositAmount = hre.ethers.parseEther("2")
                  withdrawalAmount = hre.ethers.parseEther("2")
                  const user2Tx = await ethWallet
                      .connect(user2)
                      .deposit({ value: user2DepositAmount })

                  await user2Tx.wait()

                  await expect(
                      ethWallet.connect(user1).withdraw(withdrawalAmount),
                  ).to.be.revertedWithCustomError(
                      ethWallet,
                      "EthWallet__WithdrawalExceedsUserBalance()",
                  )
              })

              //   it("Allows users to withdraw from contract", async function () {
              //       const user1InitialEtherBalance =
              //           await hre.ethers.provider.getBalance(user1.address)
              //       const user1DepositAmount = hre.ethers.parseEther("5")
              //       withdrawalAmount = hre.ethers.parseEther("2")

              //       console.log(user1InitialEtherBalance)

              //       // User1 2nd deposit (6 ETH total)
              //       user1DepositTx2 = await ethWallet.deposit({
              //           value: user1DepositAmount,
              //       })
              //       user1depositTx2Reciept = await user1DepositTx2.wait()

              //       console.log(depositTxGasCost)

              //       const gasUsed = user1depositTx2Reciept.gasUsed

              //       const gasPrice = user1depositTx2Reciept.gasPrice

              //       const gasCost = gasUsed * gasPrice

              //       console.log(gasCost)

              //       // User1 withdraw
              //       const user1WithdrawTx =
              //           await ethWallet.withdraw(withdrawalAmount)

              //       await user1WithdrawTx.wait()
              //   })
          })
      })
