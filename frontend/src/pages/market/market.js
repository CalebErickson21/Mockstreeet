// Import dependencies
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/authContext.js';
import { useUser } from '../../contexts/userContext.js';
import { usePortfolio } from '../../contexts/portfolioContext.js';

// Import styles
import './market.scss';

// Import components
import Modal from '../../components/accessModal/modal.js';
import DropDown from '../../components/portfolioDropdown/dropdown.js';

const Market = () => {
    // Contexts
    const { user } = useAuth();
    const { balance, setBalance } = useUser();
    const { stockData, setStockData, setStockFilter } = usePortfolio();

    // Show modal if user is not logged in
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        user ? setShowModal(false) : setShowModal(true);
    }, [user]);


    // Visible component
    return (
        <div id='market-container'>
            <div id='info' className='row'>
                <div className='col col-4'>
                    <h5>Capital: ${balance}</h5>
                </div>

                <div className='col col-4'>
                    <button className='btn'>Add Capital</button>
                </div>

                <div className='col col-4'>
                    <DropDown />
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
                                <th>Shares</th>
                                <th>Price per Share</th>
                                <th colSpan='2'>Transaction Type</th>
                                <th>Transaction History</th>
                            </tr>
                        </thead>
                        <tbody>
                            
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
                                <th>Shares</th>
                                <th>Share Value</th>
                                <th colSpan='2'>Transaction Type</th>
                                <th>Transaction History</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockData.length > 0 ? (
                                stockData.map(stock => (
                                    <tr key={stock.symbol}>
                                        <td>{stock.company}</td>
                                        <td>{stock.symbol}</td>
                                        <td>{stock.shares}</td>
                                        <td>{stock.share_price}</td>
                                        <td><button className='btn'>Buy</button></td>
                                        <td><button className='btn'>Sell</button></td>
                                        <td><button className='btn' value={stock.symbol} onClick={(e) => setStockFilter(e.target.value)}>View</button></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6}>No Stocks to Display</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            <div id='market' className='section'>
                <div id='market-header' className="d-flex align-items-center gap-2">
                    <h2>Market</h2>
                    <form className='d-flex align-items-center gap-2'>
                        <input required type="text" className="form-control" id="stockSearch" name="stockSearch" placeholder='Search Stocks'></input>
                        <button class='btn' type='submit'>Search</button>
                    </form>
                </div>
                <div id='market-scroll' className='scrollable'>
                    <table className='table table-striped scrollable'>
                        <thead>
                            <tr>
                                <th>Stock</th>
                                <th>Symbol</th>
                                <th>Current Value</th>
                                <th colSpan='2'>Transaction Type</th>
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