import { render } from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from '../src/frontend/components/App'
import Buy from '../src/frontend/components/Buy'
import Mint from '../src/frontend/components/Mint'
import Navbar from '../src/frontend/components/Navbar'

render(
    <BrowserRouter>
        <Navbar />
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="mint" element={<Mint />} />
            <Route path="buy" element={<Buy />} />
            <Route path="/*" element={<App />} />
        </Routes>
    </BrowserRouter>,
    document.getElementById('root')
)
