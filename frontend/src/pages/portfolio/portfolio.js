// Import functions
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/authContext.js';
import { useUser } from '../../contexts/userContext.js'
import { usePortfolio } from '../../contexts/portfolioContext.js';

// Import components
import Modal from '../../components/accessModal/modal.js';
import DropDown from '../../components/portfolioDropdown/dropdown.js';

// Import styles
import './portfolio.scss';

const Portfolio = () => {
    // Contexts
    const { user } = useAuth();
    const { balance } = useUser();
    const { portfolioValue, stockData, setStockFilter } = usePortfolio();

    // Show modal if user is not logged in
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        user ? setShowModal(false) : setShowModal(true);
    }, [user]);

    // Visible component
    return (
        <div id='portfolio-container'>
            <div id='info'>
                <div className='row'>
                    <div className='col col-4'>
                        <h5>Capital: ${ balance }</h5>
                    </div>
                    <div className='col col-4'>
                        <h5>Portfolio Value: ${ portfolioValue }</h5>
                    </div>
                    <div className='col col-4'>
                        <DropDown />
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
                            {stockData.length > 0 ? (
                                stockData.map(stock => (
                                    <tr key={stock.symbol}>
                                        <td>{stock.company}</td>
                                        <td>{stock.symbol}</td>
                                        <td>{stock.shares}</td>
                                        <td>{stock.total_price}</td>
                                        <td>TODO</td>
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

            <Modal show={showModal} />
        </div>
    )
}

export default Portfolio;