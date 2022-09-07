import './NFTCard.scss'
import { ethers } from 'ethers'

import ethIcon from '../../images/eth.svg'
import BuyButton from './BuyButton'

const NFTCard = ({ name, image, seller, buyer, totalPrice, buyClick }) => {
    return (
        <div className="nft-card">
            <div className="nft-image-div">
                <img src={image} alt={name} className="nft-image" />
            </div>
            <h3 className="nft-content__title">{name}</h3>
            <div className="nft-lower-box">
                <div className="nft-price-box">
                    <div className="nft-price-box__price">Price</div>
                    <div className="nft-price-box__value">
                        <img src={ethIcon} className="nft-price-box__value-icon" alt="eth" />
                        <div className="nft-price-box__value-amount">
                            {ethers.utils.formatEther(totalPrice)}
                        </div>
                    </div>
                </div>
                {buyClick ? <BuyButton buyClick={buyClick} /> : <p className="sold">Sold</p>}
            </div>
        </div>
    )
}

export default NFTCard
