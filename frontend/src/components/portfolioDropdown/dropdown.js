// Import dependencies
import { useEffect, useState } from 'react';

// Import styles
import './dropdown.scss'
import { portfolioNameHelper, portfolioNewHelper } from '../../utils/helpers';

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
    const displayPortfolios = async () => {
        const data = await portfolioNameHelper();
        
        if (data.success) {
            setPortfolios(data.portfolioNames); // Ensure correct property
        } else {
            setPortfolios([]);
        }
    };

    // Create new portfolio
    const [portfolioName, setPortfolioName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleNewPortfolio = async (e) => {
        e.preventDefault();
        setError('');

        // Error checking
        if (!portfolioName) {
            setError('Portfolio name is required');
            return;
        }
        if (portfolioName.length > 50) {
            setError('Portfolio name must be less than 50 characters');
            return;
        }
        if (portfolioName.toLowerCase() === 'all') {
            setError("'All' is an invalid portfolio name");
            return;
        }

        // Get create information from helper
        const data = await portfolioNewHelper(portfolioName);

        if (data.success) {
            // Display all portfolios, including newly created
            setSuccess(data.message);
            displayPortfolios();
        }
        else {
            setError(data.message); // Show error message
        }
    }

    // Display portfolios on mount
    useEffect(() => {
        displayPortfolios();
    }, []);

    // visible return value
    return (
        <div id='dropdown-container'>

            <select className='form-select' onChange={(e) => setSelectedOption(e.target.value)} value={selectedOption} aria-label='Portfolio Select'>
                <option value='All'>Select Portfolio</option>
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

                        <form onSubmit={handleNewPortfolio}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="portfolioName" className="col-form-label">Portfolio Name</label>
                                    <input required onChange={(e) => setPortfolioName(e.target.value)} type="text" className="form-control" id="portfolioName" name="portfolioName"></input>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="submit" className="btn" id="create">Create</button>
                                {error && <h5 class='error'>{error}</h5>}
                                {success && <h5 class='success'>{success}</h5>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
 
        </div>
    )
}

export default DropDown;