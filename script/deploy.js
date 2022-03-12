const hre = require("hardhat")
const {ethers} = require("hardhat");
let tombCa;
let tShareCa;
let tBondCa;
let genPool;
let genLpPool;
let tSharePool;
let treasury;
let masonry;
let ftmTombPair;
const initialTombTaxRate = 1;
const genesisPoolStartTs = 1644652800;
const genesisLpPoolStartTs = 1644652800;
// const tSharePoolStartTs = 1644656400;
const tShareStartTs = 1644652800;
const treasuryStartTs = 1644739200;
const oracleStartTs = treasuryStartTs;
const secondPerEpoch = 21600;

const verifyContract = async (contractAddress, arg1, arg2, arg3) => {
    let argList = [];

    if (arg1 != null) {
        argList.push(arg1)
    }
    if (arg2 != null) {
        argList.push(arg2)
    }
    if (arg3 != null) {
        argList.push(arg3)
    }
    if (argList.length == 0) {
        await hre.run("verify:verify", {
            address: contractAddress
        })
    } else {
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: argList
        })
    }


}

const deployTomb = async () => {
    const [deployer] = await ethers.getSigners();
    console.log(`deploying Tomb`)
    const Tomb = await ethers.getContractFactory("Tomb");
    const tomb = await Tomb.deploy(initialTombTaxRate, deployer.address);

    console.log("Tomb address: " + tomb.address);
    console.log('------------------------------')
    console.log(`Arg1: ${initialTombTaxRate}`)
    console.log(`Arg2: ${deployer.address}`)
    console.log('------------------------------')
    tombCa = tomb.address;
}

const deployTShare = async () => {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying TShare");
    const TShare = await ethers.getContractFactory("TShare");
    const tShare = await TShare.deploy(tShareStartTs, deployer.address, deployer.address);

    console.log("TShare address: " + tShare.address);
    console.log('------------------------------')
    console.log(`Arg1: ${tShareStartTs}`)
    console.log(`Arg2: ${deployer.address}`)
    console.log(`Arg1: ${deployer.address}`)
    console.log('------------------------------')

    tShareCa = tShare.address;
}

const deployTBond = async () => {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying TBond");
    const TBond = await ethers.getContractFactory("TBond");
    const tbond = await TBond.deploy();
    console.log('------------------------------')
    console.log("TBond address: " + tbond.address);
    console.log('No Arg')
    console.log('------------------------------')
    tBondCa = tbond.address
}

const deployGenPool = async () => {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying Gen pool");
    const TombGenesisRewardPool = await ethers.getContractFactory("TombGenesisRewardPool");
    const genRwPool = await TombGenesisRewardPool.deploy(tombCa, deployer.address, genesisPoolStartTs);
    console.log('------------------------------')
    console.log("Genesis Pool address: " + genRwPool.address);
    console.log(`Arg1: ${tombCa}`)
    console.log(`Arg2: ${deployer.address}`)
    console.log(`Arg3: ${genesisPoolStartTs}`)
    console.log('------------------------------')
    genPool = genRwPool.address
}

const deployGenLpPool = async () => {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying Gen Lp pool");
    const TombRewardPool = await ethers.getContractFactory("TombRewardPool");
    const tombRewardPool = await TombRewardPool.deploy(tombCa, genesisLpPoolStartTs);

    console.log('------------------------------')
    console.log("Genesis Lp Pool address: " + tombRewardPool.address);
    console.log(`Arg1: ${tombCa}`)
    console.log(`Arg2: ${genesisLpPoolStartTs}`)
    console.log('------------------------------')

    genLpPool = tombRewardPool.address
}

const deployTShareLpPool = async () => {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying tShare reward pool");
    const TShareRewardPool = await ethers.getContractFactory("TShareRewardPool");
    const tShareRewardPool = await TShareRewardPool.deploy(tShareCa, tShareStartTs);

    console.log('------------------------------')
    console.log("tShare Pool address: " + tShareRewardPool.address);
    console.log(`Arg1: ${tShareCa}`)
    console.log(`Arg1: ${tShareStartTs}`)
    console.log('------------------------------')

    tSharePool = tShareRewardPool.address

}

const deployTreasury = async () => {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying Treasury");
    const Treasury = await ethers.getContractFactory("Treasury");
    const treasurySm = await Treasury.deploy();

    console.log('------------------------------')
    console.log("Treasury address: " + treasurySm.address);
    console.log('No Arg')
    console.log('------------------------------')

    treasury = treasurySm.address

}

const deployMasonry = async () => {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying Masonry");
    const Masonry = await ethers.getContractFactory("Masonry");
    const masonrySm = await Masonry.deploy();

    console.log('------------------------------')
    console.log("Masonry address: " +  masonrySm.address);
    console.log('No Arg')
    console.log('------------------------------')

    masonry =  masonrySm.address

}

const deployOracle = async () => {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying Oracle");
    const Oracle = await ethers.getContractFactory("Oracle");
    const oracle = await Oracle.deploy(ftmTombPair, secondPerEpoch, oracleStartTs);

    console.log('------------------------------')
    console.log("Oracle address: " +  oracle.address);
    console.log(`Arg1: ${ftmTombPair}`)
    console.log(`Arg2: ${secondPerEpoch}`)
    console.log(`Arg3: ${oracleStartTs}`)
    console.log('------------------------------')

}

const main = async () => {
    await deployTomb().then(() => console.log('Tomb deployed'))
    await deployTShare().then(() => console.log('TShare deployed'))
    await deployTBond().then(() => console.log('TBond deployed'))
    await deployTreasury().then(() => console.log('Treasury deployed'))
    await deployGenPool().then(() => console.log('Gen pool deployed'))
    await deployGenLpPool().then(() => console.log('Gen Lp Pool deployed'))
    await deployTShareLpPool().then(() => console.log('TShare pool deployed'))
    await deployMasonry().then(() => console.log('Masonry  deployed'))
}

main().then(() => {
    console.log('All contract deployed')
}).catch((errors) => {
    console.log(errors)
})
