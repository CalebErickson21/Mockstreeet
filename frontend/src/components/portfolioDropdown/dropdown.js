// Import dependencies
import { useEffect, useState } from 'react';
import { usePortfolio } from '../../contexts/portfolioContext';

// Import styles
import './dropdown.scss'
import { portfolioNewHelper, portfolioNameHelper } from '../../utils/helpers';

const DropDown = ()  => {
    // Contexts
    const { portfolioFilter, setPortfolioFilter } = usePortfolio();

    // Declarations
    const [showModal, setShowModal] = useState(false);
    const [portfolioList, setPortfolioList] = useState([]);
    const [newPortfolio, setNewPortfolio] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Modal controls
    useEffect(() => {
        // Open modal
        if (portfolioFilter === "createNew") {
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
    }, [portfolioFilter]); // Run when selected option changes and on mount

    const handleCloseModal = () => {
        setShowModal(false);
        setPortfolioFilter('All');
    }

    // Get portfolio list
    const updatePortfolioList = async () => {
        const data = await portfolioNameHelper();
        
        if (data.success) {
            setPortfolioList(data.portfolioNames); // Ensure correct property
        } else {
            setPortfolioList([]);
        }
    };

    // Create new portfolio
    const handleNewPortfolio = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');

        // Error checking
        if (!newPortfolio) {
            setError('Portfolio name is required');
            return;
        }
        if (newPortfolio.length > 50) {
            setError('Portfolio name must be less than 50 characters');
            return;
        }
        if (newPortfolio.toLowerCase() === 'all' || newPortfolio.toLowerCase() === 'createnew') {
            setError("'All' and 'Create new' are invalid portfolio names");
            return;
        }

        // Get create information from helper
        const data = await portfolioNewHelper(newPortfolio);
        if (data.success) {
            updatePortfolioList();
            setSuccess(data.message);
        }
        else {
            setError(data.message); // Show error message
        }
    }

    // Display portfolios on mount
    useEffect(() => {
        updatePortfolioList();
    }, []);

    // visible return value
    return (
        <div id='dropdown-container'>

            <select className='form-select' onChange={(e) => setPortfolioFilter(e.target.value)} value={portfolioFilter} aria-label='Portfolio Select'>
                <option value='All' disabled>Select Portfolio</option>
                {portfolioList.map((portfolio, index) => (
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
                                    <input required onChange={(e) => setNewPortfolio(e.target.value)} type="text" className="form-control" id="portfolioName" name="portfolioName" placeholder='ex. Tech Stocks'></input>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="submit" className="btn" id="create">Create</button>
                                {error && <h5 className='error'>{error}</h5>}
                                {success && <h5 className='success'>{success}</h5>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
 
        </div>
    )
}

export default DropDown;