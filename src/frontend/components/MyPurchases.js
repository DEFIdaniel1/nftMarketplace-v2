import { useState, useEffect } from 'react'
import LoadingSpinner from './LoadingSpinner'
import { ethers } from 'ethers'

const MyPurchases = ({ marketplace, nft, account }) => {
    const [loading, setLoading] = useState(true)
    const [purchases, setPurchases] = useState([])

    const loadPurchasedItems = async () => {
        setLoading(true)
        // filter EVENT
        const filter = marketplace.filters.Purchased(null, null, null, null, null, account)
        const results = await marketplace.queryFilter(filter)
        // use Promise.all b/c multiple async functions will be performed
        const purchases = await Promise.all(
            results.map(async (i) => {
                i = i.args
                const uri = await nft.tokenURI(i.tokenId)
                const response = await fetch(uri)
                const metadata = await response.json()
                const totalPrice = await marketplace.getTotalPrice(i.itemId)
                let purchasedItem = {
                    totalPrice,
                    price: i.price,
                    itemId: i.itemId,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image,
                    seller: i.seller,
                }
                return purchasedItem
            })
        )
        setPurchases(purchases)
        setLoading(false)
    }
    useEffect(() => {
        loadPurchasedItems()
    }, [marketplace, nft])

    if (loading) {
        return (
            <div>
                <h2>Loading purchases...</h2>
                <LoadingSpinner />
            </div>
        )
    }
    return (
        <div>
            {purchases.length > 0 && (
                <div>
                    <h1>My Purchases</h1>
                    {purchases.map((item, idx) => (
                        <div key={idx}>
                            <h3>{item.name}</h3>
                            <div className="imgDiv">
                                <img src={item.image} alt={`NFT ${item.name}`} />
                            </div>
                            <p>{item.description}</p>
                            <h3>Price: {ethers.utils.formatEther(item.totalPrice)} ETH</h3>
                            <p>
                                Seller: {item.seller.slice(0, 4)}...
                                {item.seller.slice(item.seller.length - 4)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyPurchases
