// Import functions
import { Route, Routes } from 'react-router-dom';

// Import providers
import { AppProviders } from './contexts/AppProviders.jsx';

// Import components
import Header from './components/header/header.jsx';
import Footer from './components/footer/footer.jsx';

// Import pages
import Home from './pages/home/home.jsx';
import Login from './pages/login_register/login.jsx';
import Register from './pages/login_register/register.jsx'
import Portfolio from './pages/portfolio/portfolio.jsx';
import Transactions from './pages/transactions/transactions.jsx';
import Market from './pages/market/market.jsx';

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