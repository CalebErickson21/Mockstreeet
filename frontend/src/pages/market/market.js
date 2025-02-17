// Import functions
import { useEffect, useState } from 'react';

// Import styles
import './market.scss';

// Import components
import Modal from '../../components/accessModal/modal.js';

const Market = ({ user }) => {

    // Show modal if user is not logged in
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        user ? setShowModal(false) : setShowModal(true);
    }, [user]);


    return (
        <div id='market-container'>
            <div id='info' className='row justify-content-center align-items-center'>
                <div className='col col-auto'>
                    <h5>Current Capital: // Pull from backend \\</h5>
                </div>
                <div className='col col-auto'>
                    <button className='btn'>Add Capital</button>
                </div>
                
            </div>

            <div id='watchlist' className='section'>
                <h2>Watch List</h2>
                <div id='watchlist-scroll' className='scrollable'>
                    <table className='table table-striped scrollable'>
                        <thead>
                            <tr>
                                <th>Stock</th>
                                <th>Symbol</th>
                                <th>Current Value</th>
                                <th colspan='2'>Transaction Type</th>
                                <th>Transaction History</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>TEST</td>
                                <td>TEST</td>
                                <td>100</td>
                                <td><button className='btn'>Buy</button></td>
                                <td><button className='btn'>Sell</button></td>
                                <td><button className='btn'>View</button></td>
                            </tr>
                        </tbody>
                    </table>
                    
                </div>
            </div>


            <div id='portfolio' className='section'>
                <h2>Your Stocks</h2>
                <div id='portfolio-scroll' className='scrollable'>
                    <table className='table table-striped scrollable'>
                        <thead>
                            <tr>
                                <th>Stock</th>
                                <th>Symbol</th>
                                <th>Current Value</th>
                                <th colspan='2'>Transaction Type</th>
                                <th>Transaction History</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>TEST</td>
                                <td>TEST</td>
                                <td>100</td>
                                <td><button className='btn'>Buy</button></td>
                                <td><button className='btn'>Sell</button></td>
                                <td><button className='btn'>View</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>


            <div id='market' className='section'>
                <h2>Market</h2>
                <div id='market-scroll' className='scrollable'>
                    <table className='table table-striped scrollable'>
                        <thead>
                            <tr>
                                <th>Stock</th>
                                <th>Symbol</th>
                                <th>Current Value</th>
                                <th colspan='2'>Transaction Type</th>
                                <th>Transaction History</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>TEST</td>
                                <td>TEST</td>
                                <td>100</td>
                                <td><button className='btn'>Buy</button></td>
                                <td><button className='btn'>Sell</button></td>
                                <td><button className='btn'>View</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={showModal} />

        </div>
    )
}

export default Market;