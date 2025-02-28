// Import functions
import { useEffect, useState } from 'react';

// Import components
import Modal from '../../components/accessModal/modal.js';
import Dropdown from '../../components/portfolioDropdown/dropdown.js'

// Import styles
import './transactions.scss';

const Transactions = ({ user }) => {
    // Show modal if user is not logged in
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        user ? setShowModal(false) : setShowModal(true);
    }, [user]);
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
                        <select defaultValue='default' className='form-select'>
                            <option selected value='default'>Transaction Type</option>
                        </select>
                    </div>

                    <div className='col col-6 col-md-3'>
                        <Dropdown />
                    </div>


                    <div className='col col-6 col-md-3'>
                        <select defaultValue='default' className='form-select'>
                            <option selected value='default'>Date</option>
                        </select>
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
                            <th>Total Price</th>
                            <th>Transaction Type</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Apple</td>
                            <td>AAPL</td>
                            <td>10</td>
                            <td>$1,500</td>
                            <td>Buy</td>
                            <td>2025-02-14</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <Modal show={showModal} />


        </div>
    )
}

export default Transactions;