// Styles
import './historyBtn.scss';

const HistoryBtn = ({ stock, handleTransactionRedirect }) => {

    return (
        <button onClick={() => handleTransactionRedirect(stock)} className='btn btn-dark-blue'>History</button>
    )

}

export default HistoryBtn;