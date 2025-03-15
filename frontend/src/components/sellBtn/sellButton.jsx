import { useEffect, useState } from "react";

const SellButton = ( {stock} ) => {

    // States
    const [showSell, setShowSell] = useState(false);
    const [shares, setShares] = useState(0);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

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
    const handleSell = async () => {
        // TODO
    }
    

    return (

        <>
            <button onClick={() => setShowSell(true)} className='btn'>Sell</button>

            {showSell && <div className='modal-backdrop fade show'></div>}
            <div id='buy-modal' className={`modal fade ${showSell ? "show d-block" : ""}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel">
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h2 className='modal-title fs-5'>Sell {stock}</h2>
                            <button type='button' onClick={() => setShowSell(false)} className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
                        </div>

                        <form onSubmit={handleSell}>
                            <div className='modal-body'>
                                <label htmlFor='buyShares' className='col-form-label'>Sell Shares</label>
                                <input required onChange={(e) => setShares(e.target.value)} type='number' className='form-control' name='buyShares' placeholder='ex. 15'></input>
                            </div>
                            <div className='modal-footer'>
                                <button type='submit' className='btn' id='buyBtn'>Sell</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}


export default SellButton;