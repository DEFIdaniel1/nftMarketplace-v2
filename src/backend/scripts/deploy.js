const fs = require('fs')
const { ethers } = require('hardhat')

async function main() {
    const [deployer] = await ethers.getSigners()
    console.log('Deploying contracts with the account:', deployer.address)
    console.log('Account balance:', (await deployer.getBalance()).toString())

    // Deploy contracts here:
    const nftFactory = await ethers.getContractFactory('NFT')
    const nftContract = await nftFactory.deploy()

    const marketplaceFactory = await ethers.getContractFactory('Marketplace')
    const marketplaceContract = await marketplaceFactory.deploy(5)

    console.log(`\n NFT Contract address is: ${nftContract.address}\n`)
    console.log(`\n Marketplace address is: ${marketplaceContract.address}\n`)

    // Save contract ABI and deployed address to files
    saveFrontendFiles(nftContract, 'NFT')
    saveFrontendFiles(marketplaceContract, 'Marketplace')
}

function saveFrontendFiles(contract, name) {
    const contractsDir = __dirname + '/../../frontend/contractsData'

    // Make folder if needed
    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir)
    }

    // Write address to file
    fs.writeFileSync(
        contractsDir + `/${name}-address.json`,
        JSON.stringify({ address: contract.address }, undefined, 2)
    )

    // Artifact contains ABI data to interact with the contract. Saves to file.
    const contractArtifact = artifacts.readArtifactSync(name)
    fs.writeFileSync(contractsDir + `/${name}.json`, JSON.stringify(contractArtifact, null, 2))
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
