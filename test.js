(async () => {

const { ethers } = require("hardhat")

const BondTreasuryContract = await ethers.getContractFactory("BondTreasury")
const BondTreasury = await BondTreasuryContract.deploy()

console.log("bond treasury deployed at:", BondTreasury.address)
console.log("premium:", await BondTreasury.getBondPremium())

})()