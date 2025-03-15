import { createContext, useContext, useEffect, useState } from "react";
import { transactionsHelper, useNavigation } from "../utils/helpers";
import { usePortfolio } from "./portfolioContext";
import { useUser } from "./userContext";

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    // Helpers
    const navigate = useNavigation();

    // Contexts
    const { portfolioFilter, stockFilter, setStockFilter } = usePortfolio();
    const { balance } = useUser();

    // States
    const [transactions, setTransactions] = useState([]);
    const [transactionTypeFilter, setTransactionTypeFilter] = useState('All');
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [startDate, setStartDate] = useState(new Date(new Date(endDate).setDate(new Date(endDate).getDate() - 7)).toISOString().split('T')[0]);

    // Update transactions
    const updateTransactions = async () => {
        const data = await transactionsHelper(portfolioFilter, stockFilter, startDate, endDate);

        if (data.success) {
            setTransactions(data.transactions);
        }
    };

    // Handle transaction redirect
    const handleTransactionRedirect = ( stock ) => {
        setStockFilter(stock);
        navigate('/transactions')();
    }

    // Get transactions on context render and filter changes
    useEffect(() => {
        updateTransactions();
    }, [portfolioFilter, stockFilter, startDate, endDate, transactionTypeFilter]);


    return (
        <TransactionContext.Provider value={{ transactions, updateTransactions, transactionTypeFilter, setTransactionTypeFilter, startDate, setStartDate, endDate, setEndDate , handleTransactionRedirect }}>
            { children }
        </TransactionContext.Provider>
    )
}

export const useTransaction = () => {
    return useContext(TransactionContext);
}