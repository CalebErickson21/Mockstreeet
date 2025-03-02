// Import functions
import { Route, Routes } from 'react-router-dom';

// Import providers
import { AppProviders } from './contexts/AppProviders.js';

// Import components
import Header from './components/header/header.js';
import Footer from './components/footer/footer.js';

// Import pages
import Home from './pages/home/home.js';
import Login from './pages/login_register/login.js';
import Register from './pages/login_register/register.js'
import Portfolio from './pages/portfolio/portfolio.js';
import Transactions from './pages/transactions/transactions.js';
import Market from './pages/market/market.js';

const App = () => {
  // App layout
  return (
    <AppProviders>
      <div id='app-container'>
          <Header /> 
          <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/portfolio' element={<Portfolio />} />
              <Route path='/market' element={<Market />} />
              <Route path='/transactions' element={<Transactions />} />
          </Routes>
          <Footer />
      </div>
    </AppProviders>
  )
}

export default App;