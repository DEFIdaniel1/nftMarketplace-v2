import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="buy">Buy</Link>
            <Link to="mint">Mint</Link>
        </nav>
    )
}
export default Navbar
