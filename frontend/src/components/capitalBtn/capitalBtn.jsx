 // Helpers
 import { useState } from "react";

 const CapitalBtn = () => {

    // States
    const [showCapital, setShowCapital] = useState(false);
    const [capital, addCapital] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');


    const handleAddCapital = async (e) => {
        e.preventDefault();
        // TODO
    }

    return (
        <>
            <div className="capitalBtn">
                <button onClick={() => {setShowCapital(true)}} className='btn'> Add Capital</button>
            </div>

            {showCapital && <div className='modal-backdrop fade show'></div>}
            <div id='buy-modal' className={`modal fade ${showCapital ? "show d-block" : ""}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel">
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h2 className='modal-title fs-5'>Add Capital</h2>
                            <button type='button' onClick={() => setShowCapital(false)} className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
                        </div>

                        <form onSubmit={handleAddCapital}>
                            <div className='modal-body'>
                                <label htmlFor='addCapital' className='col-form-label'>Add Capital ($)</label>
                                <input required onChange={(e) => addCapital(e.target.value)} type='number' className='form-control' name='addCapital' placeholder='ex. 1000'></input>
                            </div>
                            <div className='modal-footer'>
                                <button type='submit' className='btn' id='buyBtn'>Add Capital</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </>
    )
 }

 export default CapitalBtn;