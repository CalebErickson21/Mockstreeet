import { createContext, useContext, useState, useEffect } from "react";
import { portfolioStocksHelper, portfolioNameHelper, log } from "../utils/helpers";
import { useAuth } from "./authContext";

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const { user } = useAuth();
  const [portfolioFilter, setPortfolioFilter] = useState('All');
  const [portfolioList, setPortfolioList] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [stockFilter, setStockFilter] = useState('');
  const [portfolioValue, setPortfolioValue ] = useState(0);

  // Get portfolio stocks
  useEffect(() => {
    const getPortfolioStocks = async () => {
      const data = await portfolioStocksHelper(portfolioFilter);
    
      if (data.success) { 
        setStockData(data.stocks);
        setPortfolioValue(data.value); 
      }
      else { log('error', 'portfolio', 'Error displaying portfolio information', data.message); }
    }
    getPortfolioStocks(); 
    }, [portfolioFilter, user]);

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
      updatePortfolioList();
    }, [user]);

    // Return context wrapper
    return (
      <PortfolioContext.Provider value={{ portfolioFilter, setPortfolioFilter, portfolioList, updatePortfolioList, portfolioValue, setPortfolioValue, stockData, setStockData, stockFilter, setStockFilter }}>
        { children }
      </PortfolioContext.Provider>
    );
}

// Export function for getting portfolio values
export const usePortfolio = () => {
    return useContext(PortfolioContext);
}