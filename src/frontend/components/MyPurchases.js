import { useState, useEffect } from 'react'
import LoadingSpinner from './LoadingSpinner'
import { ethers } from 'ethers'
import './Home.scss'
import NFTCard from './UI/NFTCard'

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
        setTimeout(loadPurchasedItems(), 1000)
    }, [nft, marketplace])

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
                    <div className="nft-box">
                        {purchases.map((item, idx) => (
                            <div key={idx}>
                                <NFTCard
                                    name={item.name}
                                    image={item.image}
                                    totalPrice={item.totalPrice}
                                    seller={item.seller}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyPurchases
