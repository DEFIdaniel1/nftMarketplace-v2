import './BuyButton.scss'
import Icon from './Icon'

const BuyButton = ({ buyClick }) => {
    const chevronRightIcon = {
        name: 'chevron-thin-right',
        className: 'btn-chevron',
    }

    return (
        <div>
            <button className="btn" onClick={buyClick}>
                Buy Now
                <Icon type={'btn-chevron'} name={'chevron-thin-right'} />
            </button>
        </div>
    )
}

export default BuyButton
