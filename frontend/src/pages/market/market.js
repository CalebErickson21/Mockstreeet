// Import styles
import './market.scss';

const Market = () => {
    return (
        <div id='market-container'>
            <div id='info' class='row justify-content-center align-items-center'>
                <div class='col col-auto'>
                    <h5>Current Capital: // Pull from backend \\</h5>
                </div>
                <div class='col col-auto'>
                    <button class='btn'>Add Capital</button>
                </div>
                
            </div>

            <div id='watchlist' class='section'>
                <h2>Watch List</h2>
                <div id='watchlist-scroll' class='scrollable'>
                    <h5>watchlist</h5>
                    <h5>watchlist</h5>
                    <h5>watchlist</h5>
                    <h5>watchlist</h5>
                    <h5>watchlist</h5>
                    <h5>watchlist</h5>
                    <h5>watchlist</h5>
                </div>
            </div>


            <div id='portfolio' class='section'>
                <h2>Your Stocks</h2>
                <div id='portfolio-scroll' class='scrollable'>
                    <h5>portfolio</h5>
                    <h5>portfolio</h5>
                    <h5>portfolio</h5>
                    <h5>portfolio</h5>
                    <h5>portfolio</h5>
                    <h5>portfolio</h5>
                    <h5>portfolio</h5>
                    <h5>portfolio</h5>
                </div>
            </div>


            <div id='market' class='section'>
                <h2>Market</h2>
                <div id='market-scroll' class='scrollable'>
                    <h5>market</h5>
                    <h5>market</h5>
                    <h5>market</h5>
                    <h5>market</h5>
                    <h5>market</h5>
                    <h5>market</h5>
                    <h5>market</h5>
                    <h5>market</h5>
                </div>
            </div>


        </div>
    )
}

export default Market;