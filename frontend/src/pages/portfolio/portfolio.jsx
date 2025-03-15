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
import HistoryButton from '../../components/historyBtn/historyButton.jsx';
import CapitalBtn from '../../components/capitalBtn/capitalBtn.jsx';

// Import styles
import './portfolio.scss';
import BuyButton from '../../components/buyBtn/buyButton.jsx';
import SellButton from '../../components/sellBtn/sellButton.jsx';

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
                    <div className='col col-3'>
                        <h5>Capital: ${ balance }</h5>
                    </div>
                    <div className='col col-3'>
                        <CapitalBtn />
                    </div>
                    <div className='col col-3'>
                        <h5>Portfolio Value: ${ portfolioValue }</h5>
                    </div>
                    <div className='col col-3'>
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
                                <th colSpan={2}>Manage Stock</th>
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
                                        <td>${stock.total_price}</td>
                                        <td><BuyButton stock={stock.symbol} company={stock.company} /></td>
                                        <td><SellButton stock={stock.symbol} company={stock.company} /></td>
                                        <td><HistoryButton stock={stock.symbol} handleTransactionRedirect={handleTransactionRedirect} /></td>
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