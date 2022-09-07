import { useState, useEffect } from 'react'
import LoadingSpinner from './LoadingSpinner'

const MyPurchases = ({ marketplace, nft, account }) => {
    const [loading, setLoading] = useState(true)
    const [purchases, setPurchases] = useState([])

    const loadPurchasedItems = async () => {
        setLoading(true)
        // filter EVENT
        console.log('starting load')
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
                    // seller: i.buyer,
                }
                return purchasedItem
            })
        )
        setPurchases(purchases)
        setLoading(false)
    }
    useEffect(() => {
        loadPurchasedItems()
    }, [marketplace])

    if (loading) {
        return (
            <div>
                <h2>Loading purchases...</h2>
                <LoadingSpinner />
            </div>
        )
    }
    return <div>My Purchases</div>
}

export default MyPurchases
