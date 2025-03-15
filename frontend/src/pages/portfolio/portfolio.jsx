// Import helpers
import { useEffect, useState } from 'react';

// Import contexts
import { useAuth } from '../../contexts/authContext.jsx';
import { useUser } from '../../contexts/userContext.jsx'
import { usePortfolio } from '../../contexts/portfolioContext.jsx';
import { useTransaction } from '../../contexts/transactionContext.jsx';

// Import components
import LoginModal from '../../components/loginModal/modal.jsx';
import DropDown from '../../components/portfolioDropdown/dropdown.jsx';

// Import styles
import './portfolio.scss';

const Portfolio = () => {
    // Contexts
    const { user } = useAuth();
    const { balance } = useUser();
    const { portfolioValue, stockData, setStockFilter } = usePortfolio();
    const { handleTransactionRedirect } = useTransaction();

    // Show modal if user is not logged in
    const [showLoginModal, setShowLoginModal] = useState(false);
    useEffect(() => {
        user ? setShowLoginModal(false) : setShowLoginModal(true);
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
                                        <td><button className='btn' value={stock.symbol} onClick={(e) => handleTransactionRedirect(e)}>View</button></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5}>No Stocks to Display</td>
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

export default Portfolio;