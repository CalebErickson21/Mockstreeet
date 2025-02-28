// Import functions
import { Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { checkAuthHelper, logoutHelper, useNavigation, log, portfolioStocksHelper } from './utils/helpers.js';

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
  // Declarations
  const [user, setUser] = useState(null);
  const [portfolioFilter, setPortfolioFilter] = useState('All');
  const [stockData, setStockData] = useState([]);
  const [stockFilter, setStockFilter] = useState('');
  const navigate = useNavigation();


  // Global authentication check
  useEffect(() => {
    const fetchUser = async () => {
      const currUser = await checkAuthHelper();
      setUser(currUser);
      log('info', 'app', 'Fetch user recieved', currUser);
    };
    fetchUser();
  }, []); // Runs on mount
  // Logout function
  const handleLogout = async () => {
    const success = await logoutHelper();
    if (success) {
        setUser(null);
        navigate('/')();
        log('info', 'app', 'Logged out successfully');
    }
    else {
        log('error', 'app', 'Error logging out');
    }
  };

  // Get stock data for a specified portfolio
  useEffect(() => {
    const getPortfolioStocks = async () => {
      const data = await portfolioStocksHelper(portfolioFilter);

      if (data.success) { setStockData(data.stocks); }
      else { log('error', 'portfolio', 'Error displaying portfolio information', data.message); }
    }
    if (portfolioFilter !== 'createNew') { getPortfolioStocks(); }
  }, [portfolioFilter]); // On app mount, and when portfolio changes


  // App layout
  return (
    <div id='app-container'>
        <Header user={user} handleLogout={handleLogout} /> {/*Pass user an an argument and logout user to deal with logouts in header */}
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login setUser={setUser} />} /> {/*Pass set user as an argument to update user globally */}
            <Route path='/register' element={<Register />} /> 
            <Route path='/portfolio' element={<Portfolio user={user} portfolioFilter={portfolioFilter} setPortfolioFilter={setPortfolioFilter} stockData={stockData} setStockFilter={setStockFilter} />} />
            <Route path='/transactions' element={<Transactions user={user} />} /> {/*Pass user as an argument to get global login status */}
            <Route path='/market' element={<Market user={user}/>} />
        </Routes>
        <Footer />
    </div>
  )
}

export default App;