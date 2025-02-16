// Import functions
import { useEffect, useState } from 'react';

// Import components
import Modal from '../../components/accessModal/modal.js';

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
                <div class='row'>
                    <div class='col col-4'>
                        <select class='form-select'>
                            <option selected>Stock</option>
                        </select>
                    </div>

                    <div class='col col-4'>
                        <select class='form-select'>
                            <option selected>Transaction Type</option>
                        </select>
                    </div>

                    <div class='col col-4'>
                        <select class='form-select'>
                            <option selected>Date</option>
                        </select>
                    </div>
                </div>

            </div>

            <div id='table-container'>
                <table class='table table-striped scrollable'>
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

            <Modal show={showModal} handleClose={() => setShowModal(false)} />


        </div>
    )
}

export default Transactions;