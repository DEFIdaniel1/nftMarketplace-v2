const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('NFT Marketplace', function () {
    let deployer, account1, account2, nftContract, marketplaceContract
    let feePercent = 5
    beforeEach(async function () {
        const nftFactory = await ethers.getContractFactory('NFT')
        const marketplaceFactory = await ethers.getContractFactory('Marketplace')
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        account1 = accounts[1]
        account2 = accounts[2]
        nftContract = await nftFactory.deploy()
        marketplaceContract = await marketplaceFactory.deploy(feePercent)
    })
    describe('Deployment', function () {
        it('Should initialize correct NFT name and symbol', async function () {
            expect(await nftContract.name()).to.equal('Megaladon')
            expect(await nftContract.symbol()).to.equal('MEGA')
        })
        it('Should track feeAccount and feePercent of the marketplace', async function () {
            expect(await marketplaceContract.s_feePercent()).to.equal(5)
            expect(await marketplaceContract.i_feeAccount()).to.equal(deployer.address)
        })
        describe('feeChange', function () {
            it('Reverts if feePercent is changed higher than 10', async function () {
                await expect(marketplaceContract.feeChange(11)).to.be.revertedWithCustomError(
                    marketplaceContract,
                    'Marketplace__FeePercentTooHigh'
                )
            })
            it('Updates marketplace fee percentage correctly', async function () {
                const newFee = 10
                await marketplaceContract.feeChange(newFee)
                expect(await marketplaceContract.s_feePercent()).to.equal(newFee)
            })
        })
    })
})
