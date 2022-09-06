import { useState } from 'react'
import { ethers } from 'ethers'
import { NFTStorage } from 'nft.storage'

const NFT_STORAGE_TOKEN = process.env.REACT_APP_NFT_STORAGE_TOKEN
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })

const Mint = ({ nft, marketplace }) => {
    const [imageUrl, setImageUrl] = useState('')
    const [price, setPrice] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [imgFile, setImgFile] = useState({})

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

    async function handleFileUpload(e) {
        const file = e.target.files[0]
        try {
            const added = await client.add(file)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            updateFileUrl(url)
            console.log(fileUrl)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    const uploadToIPFS = async (event) => {
        event.preventDefault()
        const file2 = event.target.files[0]

        console.log('uploading...')
        console.log(file2)
        if (file2 !== 'undefined') {
            try {
                const added = await client.add(file2)
                const url = `https://ipfs.infura.io/ipfs/${added.path}`
                setImageUrl(url)
            } catch (error) {
                console.log('Error uploading file: ', error)
            }
        } else {
            console.log('IPFS RAWR RAWR ERROR... file undefined')
        }
    }

    // will add all metadata to IPFS, then interact with blockchain to mint/list NFT
    const createNFT = async (e) => {
        e.preventDefault()
        if (imageUrl === '' || price === '' || name === '' || description === '') {
            alert('Please fill out the form.')
        }
        //
        try {
            const ipfsUploadResult = await client.add(
                JSON.stringify({ imageUrl, name, description })
            )
            mintThenList(ipfsUploadResult)
        } catch (e) {
            console.log('IPFS upload error for JSON object', e)
        }
    }

    async function uploadNftMetadata(imagePath, name, description) {
        // load the file from disk
        // const image = await fileFromPath(imagePath)

        const image = 
        // create a new NFTStorage client using our API key
        const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })

        // call client.store, passing in the image & metadata
        return nftstorage.store({
            image2,
            name,
            description,
        })
    }
    // only need this if uploading from disk directory
    async function fileFromPath(filePath) {
        const content = await fs.promises.readFile(filePath)
        const type = mime.getType(filePath)
        return new File([content], path.basename(filePath), { type })
    }

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
                <input type="file" onChange={handleFileUpload} />
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
