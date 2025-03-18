// Helpers
import { removeWatchHelper } from '../../utils/helpers.js';

// Contexts
import { usePortfolio } from '../../contexts/portfolioContext.jsx';

// Styles
import './removeWatchBtn.scss';

const RemoveWatchBtn = ({ stock }) => {
    // Contexts
    const { portfolioFilter, updateWatchlist } = usePortfolio();

    const handleRemove = async () => {
        const data = await removeWatchHelper(portfolioFilter, stock);

        if (data.success) { await updateWatchlist(); }

    }

    return (
        <button onClick={handleRemove} className='btn btn-dark-blue'>Unwatch</button>
    );
}

export default RemoveWatchBtn;
