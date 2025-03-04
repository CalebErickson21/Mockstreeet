import { createContext, useContext, useState } from "react";
import { transactionsHelper } from "../utils/helpers";
import { usePortfolio } from "./portfolioContext";

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {

    const { portfolioFilter, stockFilter } = usePortfolio();

    const [transactions, setTransactions] = useState([]);
    const [stockTransaction, setStockTransaction] = useState('');
    const [buy, setBuy] = useState(false);
    const [sell, setSell] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(startDate - 7 * 24 * 60 * 60 * 1000));

    // Get transactions function, does not run on mount of context
    const updateTransactions = async () => {
        const data = await transactionsHelper(portfolioFilter, stockFilter, startDate, endDate);

        if (data.success) {
            setTransactions(data.transactions);
        }
    };

    // Buy stocks function, might move to market.js
    const buyStock = async () => {

    }

    // Sell stocks function, might move to market.js
    const sellStock = async () => {

    }


    return (
        <TransactionContext.Provider value={{ transactions, setTransactions, updateTransactions }}>
            { children }
        </TransactionContext.Provider>
    )
}

export const useTransaction = () => {
    return useContext(TransactionContext);
}