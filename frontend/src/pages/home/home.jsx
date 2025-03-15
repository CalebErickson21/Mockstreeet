// Import styles
import "./home.scss";

// Import images
import chartPng from "../../assets/images/chart.png";

const Home = () => {
    // Visible component
    return (
        <div>
            <div className="align-items-center text-center mx-0 px-0 py-0" id="home">
                <img src={chartPng} alt="Stock Chart Img"/>
                <div>
                <h1>Mock Street Stock Exchange</h1>
                <p>Welcome to the Mock Street Stock Exchange!</p>
                <p>Here you can buy and sell stocks, track your portfolio, and view your transaction history.</p>
                <p>Get started by creating an account or logging in.</p>
                </div>
            </div>
        
            <div id="info" className="mx-0 px-2 py-2 alighn-items-center text-center">
                <h3>What is MockStreet?</h3>
                <p>MockStreet is a stock trading simulator that allows you to buy and sell stocks with virtual money. You can view your portfolio and transaction history to track your investments. MockStreet is a great way to learn about the stock market without risking real money.</p>

                <h3>Are Mock Street prices accurate?</h3>
                <p>Yes! The stock prices are updated in real time - you can count on Mock Street for delivering an authentic experience of trading real stocks.</p>

                <h3>Am I risking my own money?</h3>
                <p>No, Mock Street uses Mock Dollars, virtual money with no real world value. They represent real money that you would invest in the stock market. The value of your investments fluctuates accordingly with the stock market. 1 Mock Dollar = 1 USD.</p>
            
                <h3>How do I get started?</h3>
                <p>Simply create an account or log in to start trading. You will receive $10,000 in Mock Dollars to get you started. You can use this money to buy and sell stocks on the Mock Street Stock Exchange.</p>
            </div>
        </div>
    )
};

export default Home;