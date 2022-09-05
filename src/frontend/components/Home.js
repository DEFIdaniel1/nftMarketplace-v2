import { useEffect } from 'react'
import { useState } from 'react'

import LoadingSpinner from './LoadingSpinner'

const Home = ({ marketplace, nft }) => {
    const [loading, setLoading] = useState(true)
    const [items, setItems] = useState([])
    const itemsArray = []
    const loadMarketplaceItems = async () => {
        const itemCount = await marketplace.getItemCount()
        for (let i = 1; i <= itemCount; i++) {
            const item = await marketplace.getItemsMap(i)
            if (!item.sold) {
                const uri = await nft.tokenURI(item.uri) //built in interface contract
                const totalPrice = await marketplace.getTotalPrice(item.itemId)
                // use uri to get IPFS metadata
                const response = await fetch(uri)
                const metadata = await response.json()
                const newItem = {
                    totalPrice,
                    itemId: item.itemId,
                    seller: item.seller,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image,
                }
                setItems((arr) => [...arr, newItem])
            }
        }
        // setItems(itemsArray)
        setLoading(false)
    }
    const buyMarketItem = async (item) => {
        const buyTx = await marketplace.purchaseNFT(item.itemId, { value: item.totalPrice })
        await buyTx.wait()
        // loadMarketplaceItems() // reload after purchase will remove the purchased item
    }
    useEffect(() => {
        loadMarketplaceItems()
    }, [buyMarketItem])

    return
    {
        loading && (
            <div>
                <h1>Loading NFTs...</h1>
                <LoadingSpinner />
            </div>
        )
    }
    {
        items.length == 0 && (
            <div>
                <h2>No listed NFTs for sale...</h2>
            </div>
        )
    }
    {
        items.length > 0 && (
            <div>
                {items.map((item, idx) => (
                    <div key={idx}>
                        <h2>{item.name}</h2>
                        <img src={item.image} alt={`NFT ${item.name}`} />
                        <p>{item.description}</p>
                        <h3>{item.totalPrice}</h3>
                        <button onClick={buyMarketItem(item)}>Buy NFT</button>
                    </div>
                ))}
            </div>
        )
    }
}

export default Home
