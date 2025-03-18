// Import helpers
import { useEffect, useState } from 'react';

// Import contexts
import { useAuth } from '../../contexts/authContext.jsx';
import { useTransaction } from '../../contexts/transactionContext.jsx';

// Import components
import LoginModal from '../../components/loginModal/modal.jsx';
import Dropdown from '../../components/portfolioDropdown/dropdown.jsx';

// Import styles
import './transactions.scss';
import { usePortfolio } from '../../contexts/portfolioContext.jsx';

const Transactions = () => {
    // Contexts
    const { user } = useAuth();
    const { stockFilter, setStockFilter } = usePortfolio();
    const { transactions, transactionTypeFilter, setTransactionTypeFilter, startDate, setStartDate, endDate, setEndDate } = useTransaction();

    // States
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [uniqueStocks, setUniqueStocks] = useState([]);

    // Show modal if user is not logged in
    useEffect(() => {
        if (user) {
            setShowLoginModal(false);
            setUniqueStocks([]);
        }
        else { setShowLoginModal(true); }
    }, [user]);

    // Get unique stocks for dropdown
    useEffect(() => {
        if (!transactions || transactions.length === 0) {
            setUniqueStocks([]);
            return;
        }

        const filteredStocks = transactions.filter(
            (stock, index, self) => index === self.findIndex((s) => s.symbol === stock.symbol)
        );

        setUniqueStocks(filteredStocks);
    }, [transactions]);

    // Visible component
    return (
        <div id='transactions-container'>

            <div id='filters'>
                <div className='row'>
                    <div className='col col-4'>
                        <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className='form-select'>
                            <option disabled value='ALL'>Stock</option>
                            <option value='ALL'>All</option>
                            {uniqueStocks.map(stock => (
                                <option key={stock.symbol} value={stock.symbol}>{stock.symbol}</option>
                            ))}
                        </select>
                    </div>

                    <div className='col col-4'>
                        <select value={transactionTypeFilter} onChange={(e) => setTransactionTypeFilter(e.target.value)} className='form-select'>
                            <option disabled value='ALL'>Transaction Type</option>
                            <option value='ALL'>All</option>
                            <option value='BUY'>Buy</option>
                            <option value='SELL'>Sell</option>
                        </select>
                    </div>

                    <div className='col col-4'>
                        <Dropdown />
                    </div>


                    <div className='col col-2'></div>

                    <div className='col col-3'>
                        <label htmlFor='startDate'>From: </label>
                        <input onChange={(e) => setStartDate(e.target.value)} value={startDate} id='startDate' className='form-control date' type='date' placeholder='Start Date'></input>
                    </div>

                    <div className='col col-2'></div>

                    <div className='col col-3'>
                        <label htmlFor='endDate'>To: </label>
                        <input onChange={(e) => setEndDate(e.target.value)} value={endDate} id='endDate' className='form-control date' type='date' placeholder='End Date'></input>
                    </div>

                    <div className='col col-2'></div>
                    
                </div>

            </div>

            <div id='table-container'>
                <table className='table table-striped scrollable'>
                    <thead>
                        <tr>
                            <th>Stock</th>
                            <th>Ticker</th>
                            <th>Shares</th>
                            <th>Share Price</th>
                            <th>Total Price</th>
                            <th>Transaction Type</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? (
                            transactions.map((t, idx) => (
                                <tr key={idx}>
                                    <td>{t.company}</td>
                                    <td>{t.symbol}</td>
                                    <td>{t.shares}</td>
                                    <td>{t.share_price}</td>
                                    <td>{t.total_price}</td>
                                    <td>{t.type}</td>
                                    <td>{t.date}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7}>No Transactions to Display</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <LoginModal show={showLoginModal} />


        </div>
    )
}

export default Transactions;