const hre = require("hardhat")
const {ethers} = require("hardhat");
const admin = '0x5D52Be75de735461D8C81bAea74005657A470EF9';
let tombCa = '0xBEf8F941F0b9FF97355435974fa2a124b647C8e1';
let tShareCa = '0x5853C51ED3Bd8818F234A0783A82fDe7D65A34bd';
let tBondCa = '0x49f458c147B58D24D4023583872976e45862813b';
let genPool = '0x1e40F877c6fA21ff6eF9351E0a41Ff2E7c5814B6';
let genLpPool = '0x8C5E6e769656CA4652C91edB6A250Ad92f0343DA';
let tSharePool = '0xF8447281Cd72FdA6BA6D228139ba08a00249052d';
let treasury = '0x97564478803de1824b43A086dFf3a6BD0599cF32';
let masonry = '0xB3F611c2B2FD8f513C4F8075F02573cCbaA7dE71';
let ftmTombPair = '0x0bebb88261b2d72463632d3dd960a42e93d54f8b';
let ftmTSharePair = '0x88eb7d79760f521fe56d258b8ca1084c4ba0c3ba';
let oracle = '0x7674FBDaF88c03f1b2754dD9997F4e43D066C68C';
const initialTombTaxRate = 0;
const genesisPoolStartTs = 1647007200; //Thời gian bắt đầu genesis pool
const genesisLpPoolStartTs = genesisPoolStartTs + 24*60*60; // Thời gian bắt đầu genesis LP pool
const tShareStartTs = genesisLpPoolStartTs + 48*60*60; //Thời gian start tShare reward pool
const tShareClaimStartTs = tShareStartTs; //Thời gian claim fund tShare
const secondPerEpoch = 21600; //Thời gian mỗi epoch (theo s)
const treasuryStartTs = tShareStartTs + 24*60*60; // Thời gian bắt đầu Boadroom
const oracleStartTs = tShareStartTs;

const DAO_FUND = '0xE75f991d2c55646A68C4989FC931FFe469a74C17';

const main = async () => {
    // await deployTomb().then(() => console.log('Tomb deployed'))
    // await deployTShare().then(() => console.log('TShare deployed'))
    // await deployTBond().then(() => console.log('TBond deployed'))
    // await deployGenPool().then(() => console.log('Gen pool deployed'))
    // await deployGenLpPool().then(() => console.log('Gen Lp Pool deployed'))
    // await deployTShareLpPool().then(() => console.log('TShare pool deployed'))
    // await deployTreasury().then(() => console.log('Treasury deployed'))
    // await deployMasonry().then(() => console.log('Masonry  deployed'))
    await deployOracle().then(() => console.log('Oracle deployed'))
}

const verifyContract = async (contractAddress, arg1, arg2, arg3) => {
    console.log('Verifying contract')
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

    if (argList.length === 0) {
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: []
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
    await tomb.deployed();

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
    const tShare = await TShare.deploy(tShareClaimStartTs, DAO_FUND, deployer.address);

    console.log("TShare address: " + tShare.address);
    console.log('------------------------------')
    console.log(`Arg1: ${tShareClaimStartTs}`)
    console.log(`Arg2: ${DAO_FUND}`) //DAO FUND
    console.log(`Arg3: ${deployer.address}`) //DEV FUND
    console.log('------------------------------')

    tShareCa = tShare.address;
}

const deployTBond = async () => {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying TBond");
    const TBond = await ethers.getContractFactory("TBond");
    const tbond =  await TBond.deploy();
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
    const genRwLpPool = await TombRewardPool.deploy(tombCa, deployer.address, genesisLpPoolStartTs);
    console.log('------------------------------')
    console.log("Genesis Lp Pool address: " + genRwLpPool.address);
    console.log(`Arg1: ${tombCa}`)
    console.log(`Arg2: ${deployer.address}`)
    console.log(`Arg3: ${genesisLpPoolStartTs}`)
    console.log('------------------------------')
    genLpPool = genRwLpPool.address
}
//
// const deployGenLpPool = async () => {
//     const [deployer] = await ethers.getSigners();
//     console.log("Deploying Gen Lp pool");
//     const TombRewardPool = await ethers.getContractFactory("TombRewardPool");
//     const tombRewardPool = await TombRewardPool.deploy(tombCa, genesisLpPoolStartTs);
//
//     console.log('------------------------------')
//     console.log("Genesis Lp Pool address: " + tombRewardPool.address);
//     console.log(`Arg1: ${tombCa}`)
//     console.log(`Arg2: ${genesisLpPoolStartTs}`)
//     console.log('------------------------------')
//
//     genLpPool = tombRewardPool.address
// }

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

// const debug = async () => {
//     const provider = new ethers.providers.JsonRpcProvider('https://silent-blue-pine.fantom.quiknode.pro/e090f5e00508f9949cf0dbe646c4542facb5a8ca/');
//     const transaction = await provider.send('debug_traceTransaction', ['0x9e63085271890a141297039b3b711913699f1ee4db1acb667ad7ce304772036b']);
//     console.log(transaction);
// }
//
// debug().then(data => {
//     console.log(JSON.stringify(data))
// })


main().then(() => {
    console.log('All contract deployed')
}).catch((errors) => {
    console.log(errors)
})

