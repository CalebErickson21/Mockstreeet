import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { portfolioStocksHelper, portfolioNameHelper, watchlistHelper, log } from "../utils/helpers";
import { useAuth } from "./authContext";

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const { user } = useAuth();
  const [portfolioFilter, setPortfolioFilter] = useState('All');
  const [portfolioList, setPortfolioList] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [stockFilter, setStockFilter] = useState('ALL');
  const [portfolioValue, setPortfolioValue ] = useState(0);
  const [watchlist, setWatchlist] = useState([]);

  // Get portfolio stocks
  const getPortfolioStocks = useCallback(async () => {
    if (portfolioFilter === 'createNew') { return; }

    const data = await portfolioStocksHelper(portfolioFilter);
  
    if (data.success) { 
      setStockData(data.stocks);
      setPortfolioValue(data.value); 
    }
    else { log('error', 'portfolio', 'Error displaying portfolio information', data.message); }
  }, [portfolioFilter]);
  useEffect(() => {
    const refresh = async () => {
      user ? await getPortfolioStocks() : setStockData([]);
    }
    refresh(); 
  }, [portfolioFilter, user, getPortfolioStocks]);

  // Get list of all portfolios
  const updatePortfolioList = async () => {
    const data = await portfolioNameHelper();
      
    if (data.success) {
      setPortfolioList(data.portfolioNames); // Ensure correct property
    } else {
      setPortfolioList([]);
    }
  };
  useEffect(() => {
    const refresh = async () => {
      user ? await updatePortfolioList() : setPortfolioList([]);
    }
    refresh();
  }, [user]);

  // Update watchlist function
  const updateWatchlist = useCallback(async () => {
    const data = await watchlistHelper(portfolioFilter);

    if (data.success) { setWatchlist(data.watchlist); }
  }, [portfolioFilter]);

  // Return context wrapper
  return (
    <PortfolioContext.Provider value={{ portfolioFilter, setPortfolioFilter, portfolioList, updatePortfolioList, portfolioValue, setPortfolioValue, stockData, setStockData, stockFilter, setStockFilter, getPortfolioStocks, watchlist, updateWatchlist }}>
      { children }
    </PortfolioContext.Provider>
  );
}

// Export function for getting portfolio values
export const usePortfolio = () => {
    return useContext(PortfolioContext);
}