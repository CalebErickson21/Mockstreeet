// Import dependencies
import { useEffect, useState } from 'react';
import { portfolioStocksHelper, log } from '../../utils/helpers.js';

// Import styles
import './market.scss';

// Import components
import Modal from '../../components/accessModal/modal.js';
import DropDown from '../../components/portfolioDropdown/dropdown.js';

const Market = ({ user }) => {

    // Show modal if user is not logged in
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        user ? setShowModal(false) : setShowModal(true);
    }, [user]);

    // Portfolio dropdown
    const [portfolio, setPortfolio] = useState('All');
    const [error, setError] = useState('');
    const [portfolioStocks, setPortfolioStocks] = useState([]);

    // Currently owned stocks
    const handleCurrentStocks = async () => {
        //e.preventDefault();
        setError('');

        const data = await portfolioStocksHelper(portfolio);

        if (data.success) {
            setPortfolioStocks(data.stocks);
        }
        else {  
            setError(data.message);
            log('error', 'portfolio', 'Error displaying portfolio information', data.message);
        }
    };

    // Call handlePortfolio on mount and when portfolio value changes
    useEffect(() => {
        // If portfolio changes to currently existing portfolio
        if (portfolio !== 'createNew') {
            handleCurrentStocks();
        }
    }, [portfolio]);

    // Visible component
    return (
        <div id='market-container'>
            <div id='info' className='row'>
                <div className='col col-4'>
                    <h5>Current Capital: // Pull from backend \\</h5>
                </div>

                <div className='col col-4'>
                    <button className='btn'>Add Capital</button>
                </div>

                <div className='col col-4'>
                    <DropDown selectedOption={portfolio} setSelectedOption={setPortfolio} />
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
                            {portfolioStocks.length > 0 ? (
                                portfolioStocks.map(stock => (
                                    <tr key={stock.symbol}>
                                        <td>{stock.company}</td>
                                        <td>{stock.symbol}</td>
                                        <td>{stock.shares}</td>
                                        <td>{stock.share_price}</td>
                                        <td>BUY</td>
                                        <td>SELL</td>
                                        <td>History</td>
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