// Import functions
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../contexts/authContext.js';
import { useTransaction } from '../../contexts/transactionContext.js';
import { log } from '../../utils/helpers.js'

// Import components
import Modal from '../../components/accessModal/modal.js';
import Dropdown from '../../components/portfolioDropdown/dropdown.js'

// Import styles
import './transactions.scss';
import { usePortfolio } from '../../contexts/portfolioContext.js';

const Transactions = () => {
    // Contexts
    const { user } = useAuth();
    const { transactions, transactionType, setTransactionType, startDate, setStartDate, endDate, setEndDate } = useTransaction();

    // Show modal if user is not logged in
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        user ? setShowModal(false) : setShowModal(true);
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
                        <select defaultValue={transactionType} onChange={(e) => setTransactionType(e.target.value)} value={transactionType} className='form-select'>
                            <option disabled value='All'>Transaction Type</option>
                            <option value='All'>All</option>
                            <option value='buy'>Buy</option>
                            <option value='sell'>Sell</option>
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

            <Modal show={showModal} />


        </div>
    )
}

export default Transactions;