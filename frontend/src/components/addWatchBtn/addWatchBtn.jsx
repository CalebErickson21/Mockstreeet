// Helpers
import { addWatchHelper } from '../../utils/helpers.js';

// Contexts
import { usePortfolio } from '../../contexts/portfolioContext.jsx';

// Styles
import './addWatchBtn.scss';

const AddWatchBtn = ({ stock }) => {
    // Contexts
    const { portfolioFilter, updateWatchlist } = usePortfolio();
    
    const handleAdd = async (e) => {
        e.preventDefault();
        
        const data = await addWatchHelper(portfolioFilter, stock);

        if (data.success) { await updateWatchlist(); }

    }

    return (
        <button onClick={(e) => handleAdd(e)} className='btn btn-dark-blue'>Watch</button>
    );
}

export default AddWatchBtn;
