import { createContext, useContext, useEffect, useState } from "react";
import { transactionsHelper } from "../utils/helpers";
import { usePortfolio } from "./portfolioContext";
import { useUser } from "./userContext";

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {

    const { portfolioFilter, stockFilter } = usePortfolio();
    const { balance } = useUser();

    const [transactions, setTransactions] = useState([]);
    const [marketStock, setMarketStock] = useState('');
    const [transactionType, setTransactionType] = useState('All');
    const [buy, setBuy] = useState(false);
    const [sell, setSell] = useState(false);
    const [endDate, setEndDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date(endDate - 7 * 24 * 60 * 60 * 1000));

    // Get transactions function, does not run on mount of context
    const updateTransactions = async () => {
        const data = await transactionsHelper(portfolioFilter, stockFilter, startDate, endDate);

        if (data.success) {
            setTransactions(data.transactions);
        }
    };

    // Buy stocks function, might move to market.js
    const buyStock = async () => {
        //const data = await buyStockHelper(balance, stockTransaction, shares);

        // if (data.success) {
        //     // Return data success message
        // }
        // else {
        //     // Return error message
        // }
    }

    // Sell stocks function, might move to market.js
    const sellStock = async () => {

    }

    // Get transactions on context render and filter changes
    useEffect(() => {
        updateTransactions();
    }, [portfolioFilter, stockFilter, startDate, endDate, transactionType]);


    return (
        <TransactionContext.Provider value={{ transactions, updateTransactions, transactionType, setTransactionType, startDate, setStartDate, endDate, setEndDate }}>
            { children }
        </TransactionContext.Provider>
    )
}

export const useTransaction = () => {
    return useContext(TransactionContext);
}