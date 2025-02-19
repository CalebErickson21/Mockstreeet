// Import dependencies
import { useEffect, useState } from 'react';

// Import styles
import './dropdown.scss'

const DropDown = ({ selectedOption, setSelectedOption })  => {

    const [showModal, setShowModal] = useState(false);

    // Modal controls
    useEffect(() => {
        // Open modal
        if (selectedOption === "createNew") {
          setShowModal(true);
          document.body.classList.add('modal-open');
        // Close modal
        } else {
          setShowModal(false);
          document.body.classList.remove('modal-open');
        }

        // Clean up when component unmounts
        return () => {
            document.body.classList.remove('modal-open');
        }
    }, [selectedOption]); // Run when selected option changes and on mount

    // Close modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOption('default');
    }

    // visible return value
    return (
        <div id='dropdown-container'>

            <select defaultValue='default' className='form-select' onChange={(e) => setSelectedOption(e.target.value)} value={selectedOption} aria-label='Portfolio Select'>
                <option selected value='default'>Select Portfolio</option>
                <option className='select-footer' value='createNew'>Create New</option>
            </select>

            {showModal && <div className='modal-backdrop fade show'></div>}
            <div className={`modal fade ${showModal ? "show d-block" : ""}`} id="newPortfolio" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title fs-5" id="modalTitle">New Portfolio</h2>
                            <button type="button" onClick={handleCloseModal} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="portfolioName" className="col-form-label">Portfolio Name</label>
                                    <input required type="text" className="form-control" id="portfolioName" name="portfolioName"></input>
                                </div>
                            </form>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn" id="create">Create</button>
                        </div>
                    </div>
                </div>
            </div>
 
        </div>
    )
}

export default DropDown;