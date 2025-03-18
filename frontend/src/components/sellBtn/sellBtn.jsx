// Helpers
import { useEffect, useState } from "react";
import { sellHelper } from "../../utils/helpers";

// Contexts
import { useUser } from "../../contexts/userContext";
import { usePortfolio } from "../../contexts/portfolioContext";
import { useTransaction } from "../../contexts/transactionContext";

// Styles
import './sellBtn.scss';

const SellBtn = ( {stock, company} ) => {

    // Contexts
    const { updateBalance } = useUser();
    const { portfolioFilter, getPortfolioStocks } = usePortfolio();
    const { updateTransactions } = useTransaction();
    

    // States
    const [showSell, setShowSell] = useState(false);
    const [shares, setShares] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Modal controls
    useEffect(() => {
        if (showSell) {
            document.body.classList.add('modal-open');
        }
        else {
            document.body.classList.remove('modal-open');
        }

        // Clean up when component unmounts
        return () => {
            document.body.classList.remove('modal-open');
        }
    }, [showSell]);

    // Buy Functionality
    const handleSell = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const data = await sellHelper(portfolioFilter, stock, shares);
        if (data.success) {
            setSuccess(data.message);
            await getPortfolioStocks();
            await updateTransactions();
            await updateBalance();
        }
        else {
            setError(data.message);
        }
    }
    
    // Visible Component
    return (
        <>
            <button onClick={() => setShowSell(true)} className='btn btn-dark-blue'>Sell</button>

            {showSell && <div className='modal-backdrop fade show'></div>}
            <div id='buy-modal' className={`modal fade ${showSell ? "show d-block" : ""}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel">
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h2 className='modal-title fs-5'>Sell {company}</h2>
                            <button type='button' onClick={() => setShowSell(false)} className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
                        </div>

                        <form onSubmit={handleSell}>
                            <div className='modal-body'>
                                <label htmlFor='sellShares' className='col-form-label'>Sell {stock} Shares</label>
                                <input required onChange={(e) => setShares(e.target.value)} type='number' className='form-control' name='sellShares' placeholder='ex. 15'></input>
                            </div>
                            <div className='modal-footer'>
                                {error && <div className='error'>{error}</div>}
                                {success && <div className='success'>{success}</div>}
                                <button type='submit' className='btn' id='buyBtn'>Sell</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}


export default SellBtn;