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
                    <table class='table table-striped scrollable'>
                        <thead>
                            <tr>
                                <th>Stock</th>
                                <th>Symbol</th>
                                <th>Current Value</th>
                                <th colspan='2'>Transaction Type</th>
                                <th>Transaction History</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>TEST</td>
                                <td>TEST</td>
                                <td>100</td>
                                <td><button class='btn'>Buy</button></td>
                                <td><button class='btn'>Sell</button></td>
                                <td><button class='btn'>View</button></td>
                            </tr>
                        </tbody>
                    </table>
                    
                </div>
            </div>


            <div id='portfolio' class='section'>
                <h2>Your Stocks</h2>
                <div id='portfolio-scroll' class='scrollable'>
                    <table class='table table-striped scrollable'>
                        <thead>
                            <tr>
                                <th>Stock</th>
                                <th>Symbol</th>
                                <th>Current Value</th>
                                <th colspan='2'>Transaction Type</th>
                                <th>Transaction History</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>TEST</td>
                                <td>TEST</td>
                                <td>100</td>
                                <td><button class='btn'>Buy</button></td>
                                <td><button class='btn'>Sell</button></td>
                                <td><button class='btn'>View</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>


            <div id='market' class='section'>
                <h2>Market</h2>
                <div id='market-scroll' class='scrollable'>
                    <table class='table table-striped scrollable'>
                        <thead>
                            <tr>
                                <th>Stock</th>
                                <th>Symbol</th>
                                <th>Current Value</th>
                                <th colspan='2'>Transaction Type</th>
                                <th>Transaction History</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>TEST</td>
                                <td>TEST</td>
                                <td>100</td>
                                <td><button class='btn'>Buy</button></td>
                                <td><button class='btn'>Sell</button></td>
                                <td><button class='btn'>View</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>


        </div>
    )
}

export default Market;