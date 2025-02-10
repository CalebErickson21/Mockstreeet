import { Route, Routes } from 'react-router-dom';

// Import components
import Header from './components/header.js';
import Footer from './components/footer.js';

// Import pages
import Home from './pages/home/home.js';
import Login from './pages/login_register/login.js';
import Register from './pages/login_register/register.js'
import Portfolio from './pages/portfolio/portfolio.js';
import Transactions from './pages/transactions/transactions.js';
import Market from './pages/market/market.js';

const App = () => {
  return (
    <div>
        <Header />
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/portfolio' element={<Portfolio />} />
            <Route path='/transactions' element={<Transactions />} />
            <Route path='/market' element={<Market />} />
        </Routes>
        <Footer />
    </div>
  )
}

export default App;