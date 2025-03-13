// Import helpers
import { useEffect, useState, useRef } from 'react';

// Import contexts
import { useAuth } from '../../contexts/authContext.js';
import { useTransaction } from '../../contexts/transactionContext.js';

// Import components
import LoginModal from '../../components/loginModal/modal.js';
import Dropdown from '../../components/portfolioDropdown/dropdown.js';

// Import styles
import './transactions.scss';

const Transactions = () => {
    // Contexts
    const { user } = useAuth();
    const { transactions, transactionTypeFilter, setTransactionTypeFilter, startDate, setStartDate, endDate, setEndDate } = useTransaction();

    // Show modal if user is not logged in
    const [showLoginModal, setShowLoginModal] = useState(false);
    useEffect(() => {
        user ? setShowLoginModal(false) : setShowLoginModal(true);
    }, [user]);

    // Visible component
    return (
        <div id='transactions-container'>

            <div id='filters'>
                <h5>Filter By:</h5>
                <div className='row'>
                    <div className='col col-6 col-md-3'>
                        <select defaultValue='default' className='form-select'>
                            <option disabled value='default'>Stock</option>
                        </select>
                    </div>

                    <div className='col col-6 col-md-3'>
                        <select defaultValue={transactionTypeFilter} onChange={(e) => setTransactionTypeFilter(e.target.value)} value={transactionTypeFilter} className='form-select'>
                            <option disabled value='All'>Transaction Type</option>
                            <option value='All'>All</option>
                            <option value='Buy'>Buy</option>
                            <option value='Sell'>Sell</option>
                        </select>
                    </div>

                    <div className='col col-6 col-md-3'>
                        <Dropdown />
                    </div>


                    <div className='col col-6 col-md-3'>
                        <div className='col col-6'>
                            <input onChange={(e) => setStartDate(e.target.value)} value={startDate} className='form-control date' type='date' placeholder='Start Date'></input>
                        </div>

                        <div className='col col-6'>
                            <div className='col col-6'>
                                <input onChange={(e) => setEndDate(e.target.value)} value={endDate} className='form-control date' type='date' placeholder='End Date'></input>
                            </div>
                        </div>
                    </div>
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
                            transactions.map(t => (
                                <tr key={t.symbol}>
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