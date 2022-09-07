import './Icon.scss'
import sprite from '../../images/sprite.svg'

const Icon = ({ color, width, height, type, name }) => {
    return (
        <svg className={type} fill={color} width={width} height={height}>
            <use href={`${sprite}#icon-${name}`} xlinkHref={`${sprite}#icon-${name}`} />
        </svg>
    )
}

export default Icon
