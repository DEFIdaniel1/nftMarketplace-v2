const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('NFT Marketplace', function () {
    let deployer, account1, account2, nftContract, marketplaceContract
    let feePercent = 5
    let testURI = 'URI'
    let testURI2 = 'another URI'
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
    describe('Mint NFT', function () {
        it('Should track each minted NFT', async function () {
            // account1 to mint NFT
            await nftContract.connect(account1).mint(testURI)
            expect(await nftContract.tokenCount()).to.equal(1)
            expect(await nftContract.balanceOf(account1.address)).to.equal(1)
            expect(await nftContract.tokenURI(1)).to.equal(testURI)
            // account2 mints NFT
            await nftContract.connect(account2).mint(testURI2)
            expect(await nftContract.tokenCount()).to.equal(2)
            expect(await nftContract.balanceOf(account2.address)).to.equal(1)
            expect(await nftContract.tokenURI(2)).to.equal(testURI2)
        })
    })
    describe('listNFT marketplace function', function () {
        let tokenId = 1
        let itemId = 1
        const price = ethers.utils.parseEther('1')
        beforeEach(async function () {
            // account 1 mints and approves marketplace to transfer the NFT
            await nftContract.connect(account1).mint(testURI)
            await nftContract.connect(account1).approve(marketplaceContract.address, tokenId)
        })
        it('Marketplace is approved to list specific NFT', async function () {
            expect(await nftContract.getApproved(tokenId)).equals(marketplaceContract.address)
        })
        it('Should transfer NFT from seller to marketplace', async function () {
            await marketplaceContract.connect(account1).listNFT(nftContract.address, tokenId, price)
            expect(await nftContract.ownerOf(1)).to.equal(marketplaceContract.address)
        })
        it('Should emit Listing event', async function () {
            await expect(
                marketplaceContract.connect(account1).listNFT(nftContract.address, tokenId, price)
            ).to.emit(marketplaceContract, 'Listing')
        })
        it('Marketplace s_itemCount tracks', async function () {
            await marketplaceContract.connect(account1).listNFT(nftContract.address, tokenId, price)
            expect(await marketplaceContract.s_itemCount()).to.equal(itemId)
        })
        it('Marketplace itemsMap mapping tracks', async function () {
            await marketplaceContract.connect(account1).listNFT(nftContract.address, tokenId, price)
            const item = await marketplaceContract.itemsMap(1)
            expect(item.itemId).to.equal(itemId)
            expect(item.nft).to.equal(nftContract.address)
            expect(item.tokenId).to.equal(tokenId)
            expect(item.price).to.equal(price)
            expect(item.sold).to.equal(false)
        })
        it('Reverts if price is 0', async function () {
            await expect(
                marketplaceContract.listNFT(nftContract.address, tokenId, 0)
            ).to.be.revertedWithCustomError(
                marketplaceContract,
                'Marketplace__PriceMustBeMoreThanZero'
            )
        })
    })
})
