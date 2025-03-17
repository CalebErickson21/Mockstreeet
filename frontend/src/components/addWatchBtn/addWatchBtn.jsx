// Helpers
import { addWatchHelper } from '../../utils/helpers.js';

// Contexts
import { usePortfolio } from '../../contexts/portfolioContext.jsx';

const AddWatchBtn = ({ stock }) => {
    // Contexts
    const { portfolioFilter, updateWatchlist } = usePortfolio();
    
    const handleAdd = async () => {
        console.log('In the handleAdd function');
        const data = await addWatchHelper(portfolioFilter, stock);

        if (data.success) {
            console.log('Successfully added');
        }
        await updateWatchlist();

    }

    return (
        <button onClick={handleAdd}className='btn'>Watch</button>
    );
}

export default AddWatchBtn;
