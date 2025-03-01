import { createContext, useContext, useState, useEffect } from "react";
import { portfolioStocksHelper, log } from "../utils/helpers";
import { useAuth } from "./authContext";

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
    const { user } = useAuth();
    const [portfolioFilter, setPortfolioFilter] = useState('All');
    const [stockData, setStockData] = useState([]);
    const [stockFilter, setStockFilter] = useState('All');

    useEffect(() => {
        const getPortfolioStocks = async () => {
          const data = await portfolioStocksHelper(portfolioFilter);
    
          if (data.success) { setStockData(data.stocks); }
          else { log('error', 'portfolio', 'Error displaying portfolio information', data.message); }
        }
        getPortfolioStocks(); 
      }, [portfolioFilter, user]);

      return (
        <PortfolioContext.Provider value={{ portfolioFilter, setPortfolioFilter, stockData, setStockData, stockFilter, setStockFilter }}>
            {children}
        </PortfolioContext.Provider>
      );
}

export function usePortfolio() {
    return useContext(PortfolioContext);
}