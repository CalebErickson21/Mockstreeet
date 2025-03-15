const HistoryButton = ({ stock, handleTransactionRedirect }) => {

    return (
        <button onClick={() => handleTransactionRedirect(stock)} className='btn'>History</button>
    )

}

export default HistoryButton;