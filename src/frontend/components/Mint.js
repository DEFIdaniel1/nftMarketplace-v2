import { useState } from 'react'
import { ethers } from 'ethers'
import { useNavigate } from 'react-router-dom'

const NFT_URI_1 =
    'https://bafkreieauppee6ogkwr5kzgzqtm5jm3wfxltwmkojvmerzguui4uv5ebum.ipfs.nftstorage.link/'
const NFT_URI_2 =
    'https://bafkreigqooj7rbw4p5nocaxtfqlutkck55kpsinmohl7ebjrulwkphwj2i.ipfs.nftstorage.link/'
const NFT_URI_3 =
    'https://bafkreignao3uxqljfnw3czrw3gkjv42yv6vzp3jq7fbr7bq7g2ottglxuy.ipfs.nftstorage.link/'
const NFT_URI_4 =
    'https://bafkreicpinncqvb5w2ukozbo3huprzkjhfprwxpl4vfjvzd2mbmulqronq.ipfs.nftstorage.link/'
const NFT_URI_5 =
    'https://bafkreicji7ewjw6vdmvodurlfaqvb4cb74xmeg6c6wbnx3yzsgarqyg4fe.ipfs.nftstorage.link/'

const Mint = ({ nft, marketplace, account }) => {
    const [userNumber, setUserNumber] = useState('')
    const [price, setPrice] = useState('')
    const navigate = useNavigate()

    const priceChangeHandler = (event) => {
        setPrice(event.target.value)
        console.log(price)
    }
    const userNumberHandler = (event) => {
        setUserNumber(event.target.value)
        console.log(userNumber)
    }

    const getRandomURI = () => {
        console.log('starting random number generation')
        const randomNumber = Math.floor(Math.random() * 1000)
        console.log('randomNumber:' + randomNumber)
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
        console.log(`doubleRandom: ${doubleRandom}`)
        return outputURI
    }

    const mintThenList = async () => {
        if (userNumber === '' || price === '') {
            alert('Input a random number and price.')
        }
        const uri = getRandomURI()
        console.log(`URI: ${uri}`)
        const listingPrice = ethers.utils.parseEther(price.toString())

        const mintTx = await nft.mint(uri)
        await mintTx.wait()
        console.log('_____getting balance_______')
        const balanceOf = await nft.balanceOf(account)
        console.log(account)
        console.log(balanceOf)
        const tokenId = await nft.balanceOf(account)
        console.log('tokenID ' + tokenId)
        console.log('Approving marketplace...')
        const approveMarketplaceTx = await nft.approve(marketplace.address, tokenId)
        await approveMarketplaceTx.wait()

        console.log('Listing NFT on marketplace...')
        const listNFTTx = await marketplace.listNFT(nft.address, tokenId, listingPrice)
        await listNFTTx.wait()
        console.log('Minting and listing complete!')
        navigate('/')
    }

    return (
        <div>
            <h1>Mint Your NFT</h1>
            <form action="">
                <label>Random Number</label>
                <input
                    type="number"
                    placeholder="A number to output a random NFT"
                    onChange={userNumberHandler}
                />
                <label>Sell Price</label>
                <input
                    type="number"
                    placeholder="Price to sell your NFT in ETH"
                    onChange={priceChangeHandler}
                />
                <button type="button" onClick={mintThenList}>
                    Mint and List NFT!
                </button>
            </form>
        </div>
    )
}

export default Mint
