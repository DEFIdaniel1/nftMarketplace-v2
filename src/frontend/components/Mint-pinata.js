import { useState } from 'react'
import { ethers } from 'ethers'
const { storeImages, storeTokenURIMetadata } = require('../helpers/usePinataUpload')

const Mint = ({ nft, marketplace }) => {
    const [imageUrl, setImageUrl] = useState('')
    const [price, setPrice] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const metadataTemplate = {
        name: '',
        description: '',
        image: '',
        attributes: [{ rarity: '' }],
    }

    const handlePriceChange = (event) => {
        setPrice(event.target.value)
        console.log(price)
    }
    const handleNameChange = (event) => {
        setName(event.target.value)
        console.log(name)
    }
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value)
        console.log(description)
    }

    const getImageURI = async (event) => {
        event.preventDefault()
        const image = event.target.files[0]
        if (!image) {
            alert('Upload an image file first.')
        }
        const imgURI = await storeImages(image)
        console.log(`Image URI received: ${imgURI}`)
        return imgURI
    }

    // const mintNFT = async()=> {

    // }

    const mintThenList = async (ipfsObject) => {
        const uri = `https://ipfs.infura.io/ipfs/${ipfsObject.path}`
        const listingPrice = ethers.utils.parseEther(price.toString())

        const mintTx = await nft.mint(uri)
        await mintTx.wait()

        const tokenId = await nft.tokenCount()
        const approveMarketplaceTx = await nft.approve(marketplace.address, tokenId)
        await approveMarketplaceTx.wait()

        const listNFTTx = await marketplace.listNFT(nft.address, tokenId, listingPrice)
        await listNFTTx.wait()
    }

    return (
        <div>
            <h1>Mint Your NFT</h1>
            <form action="">
                <label>Upload Image</label>
                {/* <input type="file" id="nftImage" name="file" onChange={uploadToIPFS} /> */}
                <input type="file" onChange={getImageURI} />
                <label>Name</label>
                <input type="text" placeholder="name" onChange={handleNameChange} />
                <label>Description</label>
                <input
                    type="textarea"
                    placeholder="My glorious NFT description..."
                    onChange={handleDescriptionChange}
                />
                <label>Price</label>
                <input type="number" placeholder="Price in ETH" onChange={handlePriceChange} />
                <button onClick={createNFT}>Mint and List NFT!</button>
            </form>
        </div>
    )
}

export default Mint
