// Import functions
import { useEffect, useState } from 'react';
import { portfolioStocksHelper, log } from '../../utils/helpers.js';

// Import components
import Modal from '../../components/accessModal/modal.js';
import DropDown from '../../components/portfolioDropdown/dropdown.js';

// Import styles
import './portfolio.scss';

const Portfolio = ({ user }) => {
    // Show modal if user is not logged in
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        user ? setShowModal(false) : setShowModal(true);
    }, [user]);

    // Portfolio data
    const [portfolio, setPortfolio] = useState('All');
    const [stocks, setStocks] = useState([]);
    const [error, setError] = useState('');

    // Display portfolio contents
    const handlePortfolio = async () => {
        //e.preventDefault();
        setError('');

        const data = await portfolioStocksHelper(portfolio);

        if (data.success) {
            setStocks(data.stocks);
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
            handlePortfolio();
        }
    }, [portfolio]);

    // Visible component
    return (
        <div id='portfolio-container'>
            <div id='info'>
                <div className='row'>
                    <div className='col col-6 col-md-4'>
                        <h5>Cash on Hand: // DB Req \\</h5>
                    </div>
                    <div className='col col-6 col-md-4'>
                        <h5>Portfolio Value: // DB Req \\</h5>
                    </div>
                    <div className='col col-6 col-md-4'>
                        <h5>Lifetime +/-: // DB Req \\</h5>
                    </div>
                    <div className='col col-6 col-md-4'>
                        <DropDown selectedOption={portfolio} setSelectedOption={setPortfolio} />
                    </div>
                    <div className='col col-6 col-md-4'>
                        <h5>Investment +/-: // DB Req \\</h5>
                    </div>
                    <div className='col col-6 col-md-4'>
                        <h5>Lifetime ROI: // DB Req \\</h5> 
                    </div>
                </div>
            </div>

            <div id='details'>
                <div id='table-container'>
                    <table className='table table-striped scrollable'>
                        <thead>
                            <tr>
                                <th>Stock</th>
                                <th>Symbol</th>
                                <th>Shares</th>
                                <th>Total Value</th>
                                <th>+/-</th>
                                <th>Transaction History</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.length > 0 ? (
                                stocks.map(stock => (
                                    <tr key={stock.symbol}>
                                        <td>{stock.company}</td>
                                        <td>{stock.symbol}</td>
                                        <td>{stock.shares}</td>
                                        <td>{stock.total_price}</td>
                                        <td>TODO</td>
                                        <td>TODO</td>
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

            <Modal show={showModal} />
        </div>
    )
}

export default Portfolio;