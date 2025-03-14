// Import helpers
import { useEffect, useState } from 'react';
import { marketHelper } from '../../utils/helpers.js';

// Import styles
import './market.scss';

// Import components
import LoginModal from '../../components/loginModal/modal.js';
import DropDown from '../../components/portfolioDropdown/dropdown.js';

// Import contexts
import { useAuth } from '../../contexts/authContext.js';
import { useUser } from '../../contexts/userContext.js';
import { usePortfolio } from '../../contexts/portfolioContext.js';
import { useTransaction } from '../../contexts/transactionContext.js';


const Market = () => {
    // Contexts
    const { user } = useAuth();
    const { balance } = useUser();
    const { stockData } = usePortfolio();
    const { handleTransactionRedirect } = useTransaction();

    // States
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [searchStock, setSearchStock] = useState('');
    const [searchRes, setSearchRes] = useState([]);

    // Modal functions
    useEffect(() => {
        user ? setShowLoginModal(false) : setShowLoginModal(true);
    }, [user]);

    const handleSearch = async (e) => {
        e.preventDefault();
        
        // Error check
        if (!searchStock) {
            return;
        }

        // Fetch data using helper
        const data = await marketHelper(searchStock);
        if (data.success) {
            setSearchRes(data.stock);
        }
        else {
            setSearchRes([]);
        }
    };


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
                                        <td><button className='btn' value={stock.symbol} onClick={(e) => handleTransactionRedirect(e)}>View</button></td>
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
                    <form onSubmit={handleSearch} className='d-flex align-items-center gap-2'>
                        <input required onChange={(e) => setSearchStock(e.target.value)} value={searchStock} type="text" className="form-control" id="stockSearch" name="stockSearch" placeholder='Search By Symbol'></input>
                        <button class='btn' type='submit'>Search</button>
                    </form>
                </div>
                <div id='market-scroll' className='scrollable'>
                    <table className='table table-striped scrollable'>
                        <thead>
                            <tr>
                                <th>Stock</th>
                                <th>Symbol</th>
                                <th>Share Value</th>
                                <th colSpan='2'>Transaction Type</th>
                                <th>Transaction History</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchRes.length > 0 ? (
                                searchRes.map(stock => (
                                    <tr key={stock.symbol}>
                                        <td>{stock.company}</td>
                                        <td>{stock.symbol}</td>
                                        <td>{stock.share_price}</td>
                                        <td>Buy</td>
                                        <td>Sell</td>
                                        <td>View</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6}>Please Search for Valid Stock Symbol(s) as a comma separated list</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <LoginModal show={showLoginModal} />
        </div>
    )
}

export default Market;