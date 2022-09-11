import './NFTCard.scss'
import { ethers } from 'ethers'

import ethIcon from '../../images/eth.svg'
import BuyButton from './BuyButton'

const NFTCard = ({ name, image, idx, totalPrice, buyClick, sold }) => {
    return (
        <div key={idx} className="nft-card">
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
                {buyClick && !sold && <BuyButton buyClick={buyClick} />}
                {!buyClick && sold && <p className="sold">Sold</p>}
            </div>
        </div>
    )
}

export default NFTCard
