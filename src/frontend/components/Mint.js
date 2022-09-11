import { useState } from 'react'
import { ethers } from 'ethers'
import { useNavigate } from 'react-router-dom'

import './Mint.scss'
import LoadingScreen from './UI/LoadingScreen'
import Button from '../components/UI/Button'

const NFT_URI_1 =
    'https://bafybeic5soplkxiipl5wrs4wtpucoo6ikxew5t33apjljxfxezpaecbqie.ipfs.nftstorage.link/nft1.json'
const NFT_URI_2 =
    'https://bafybeic5soplkxiipl5wrs4wtpucoo6ikxew5t33apjljxfxezpaecbqie.ipfs.nftstorage.link/nft2.json'
const NFT_URI_3 =
    'https://bafybeic5soplkxiipl5wrs4wtpucoo6ikxew5t33apjljxfxezpaecbqie.ipfs.nftstorage.link/nft3.json'
const NFT_URI_4 =
    'https://bafybeic5soplkxiipl5wrs4wtpucoo6ikxew5t33apjljxfxezpaecbqie.ipfs.nftstorage.link/nft4.json'
const NFT_URI_5 =
    'https://bafybeic5soplkxiipl5wrs4wtpucoo6ikxew5t33apjljxfxezpaecbqie.ipfs.nftstorage.link/nft5.json'

const Mint = ({ nft, marketplace, account, loading }) => {
    const [userNumber, setUserNumber] = useState('')
    const [price, setPrice] = useState('')
    const navigate = useNavigate()

    const priceChangeHandler = (event) => {
        setPrice(event.target.value)
    }
    const userNumberHandler = (event) => {
        setUserNumber(event.target.value)
    }

    const getRandomURI = () => {
        console.log('Starting random number generation')
        const randomNumber = Math.floor(Math.random() * 1000)
        const doubleRandom = ((userNumber * randomNumber) % 5) + 1
        let outputURI
        switch (doubleRandom) {
            case 1:
                outputURI = NFT_URI_1
                break
            case 2:
                outputURI = NFT_URI_2
                break
            case 3:
                outputURI = NFT_URI_3
                break
            case 4:
                outputURI = NFT_URI_4
                break
            case 5:
                outputURI = NFT_URI_5
                break
            default:
                console.log(`Try again. Random number was: ${doubleRandom} outputURI: ${outputURI}`)
        }
        return outputURI
    }

    const mintThenList = async () => {
        if (userNumber === '' || price === '') {
            alert('Input a random number and price.')
            return
        }
        const uri = getRandomURI()
        const listingPrice = ethers.utils.parseEther(price.toString())
        const mintTx = await nft.mint(uri)
        await mintTx.wait()
        const tokenId = await nft.balanceOf(account)
        console.log('Newly minted tokenID: ' + tokenId)

        const approveMarketplaceTx = await nft.approve(marketplace.address, tokenId)
        console.log('Approving marketplace...')
        await approveMarketplaceTx.wait()

        const listNFTTx = await marketplace.listNFT(nft.address, tokenId, listingPrice)
        console.log('Listing NFT on marketplace...')
        await listNFTTx.wait()
        console.log('Minting and listing complete!')
        navigate('/listings')
        window.location.reload()
    }

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <div className="mintPage">
            <h1>Mint Your NFT</h1>
            <h3>Control your destiny... </h3>
            <form className="mintForm" action="">
                <div>
                    <label>Random Number</label>
                    <p>Pick a number to randomize your NFT mint.</p>
                    <input
                        className="randomNumber"
                        type="number"
                        placeholder="Your number"
                        onChange={userNumberHandler}
                    />
                </div>
                <div>
                    <label>Sell Price</label>
                    <p>Instantly list your NFT for the price you want.</p>
                    <input
                        className="sellPrice"
                        type="number"
                        placeholder="Price in ETH"
                        onChange={priceChangeHandler}
                    />
                </div>
            </form>
            <div className="mintButton">
                <Button onClick={mintThenList}>Mint and List!</Button>
            </div>
        </div>
    )
}

export default Mint
