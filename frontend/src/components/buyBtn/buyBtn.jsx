// Helpers
import { useEffect, useState } from "react";
import { buyHelper } from "../../utils/helpers";

// Contexts
import { useUser } from "../../contexts/userContext";
import { usePortfolio } from "../../contexts/portfolioContext";
import { useTransaction } from "../../contexts/transactionContext";

// Styles
import './buyBtn.scss';

const BuyBtn = ( {stock, company} ) => {

    // Contexts
    const { updateBalance } = useUser();
    const { portfolioFilter, getPortfolioStocks } = usePortfolio();
    const { updateTransactions } = useTransaction();

    // States
    const [showBuy, setShowBuy] = useState(false);
    const [shares, setShares] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Modal controls
    useEffect(() => {
        if (showBuy) {
            document.body.classList.add('modal-open');
        }
        else {
            document.body.classList.remove('modal-open');
        }

        // Clean up when component unmounts
        return () => {
            document.body.classList.remove('modal-open');
        }
    }, [showBuy]);

    // Buy Functionality
    const handleBuy = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');

        const data = await buyHelper(portfolioFilter, stock, shares);

        if (data.success) {
            setSuccess(data.message);
            await updateBalance();
            await getPortfolioStocks();
            await updateTransactions();
        }
        else {
            setError(data.message);
        }
    }
    
    // Visible component
    return (
        <>
            <button onClick={() => setShowBuy(true)} className='btn btn-dark-blue'>Buy</button>

            {showBuy && <div className='modal-backdrop fade show'></div>}
            <div id='buy-modal' className={`modal fade ${showBuy ? "show d-block" : ""}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel">
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h2 className='modal-title fs-5'>Buy {company}</h2>
                            <button type='button' onClick={() => setShowBuy(false)} className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
                        </div>

                        <form onSubmit={handleBuy}>
                            <div className='modal-body'>
                                <label htmlFor='buyShares' className='col-form-label'>Buy {stock} Shares</label>
                                <input required onChange={(e) => setShares(e.target.value)} type='number' className='form-control' name='buyShares' placeholder='ex. 15'></input>
                            </div>
                            <div className='modal-footer'>
                                {error && <div className='error'>{error}</div>}
                                {success && <div className='success'>{success}</div>}
                                <button type='submit' className='btn' id='buyBtn'>Buy</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}


export default BuyBtn;