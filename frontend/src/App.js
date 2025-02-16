// Import functions
import { Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { checkAuthHelper } from './utils/helpers.js';

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

  // Global authentication check
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const currUser = await checkAuthHelper();
      setUser(currUser);
    };
    fetchUser();
  }, []);

  return (
    <div id='app-container'>
        <Header user={user} setUser={setUser} />
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login setUser={setUser} />} />
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