// Import dependencies
import { useEffect, useState } from 'react';

// Import styles
import './dropdown.scss'
import { portfolioNameHelper } from '../../utils/helpers';

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

    // Portfolio information
    const [portfolios, setPortfolios] = useState([]);
    useEffect(() => {
        const displayPortfolios = async () => {
            const data = await portfolioNameHelper();
            
            if (data.success) {
                setPortfolios(data.portfolioNames); // Ensure correct property
            } else {
                setPortfolios([]);
            }
        };
    
        displayPortfolios(); // Always fetch portfolios
    
        if (selectedOption === 'createNew' || selectedOption === undefined) {
            displayPortfolios();
        }
    
    }, [selectedOption]); // Runs on `selectedOption` change

    // visible return value
    return (
        <div id='dropdown-container'>

            <select defaultValue='All' className='form-select' onChange={(e) => setSelectedOption(e.target.value)} value={selectedOption} aria-label='Portfolio Select'>
                <option selected value='All'>Select Portfolio</option>
                {portfolios.map((portfolio, index) => (
                    <option key={index} value={portfolio}>
                        {portfolio}
                    </option>
                ))}
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