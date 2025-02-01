import "../styles/output.css";
import chartPng from "../assets/images/chart.png";

const Home = () => {
    return (
        <div id="scroller" data-bs-spy="scroll" data-bs-target="#navbar" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" class="container-fluid bg-dark px-0" tabindex="0">
            <div class="section-dark align-items-center text-center mx-0 px-0 py-0" id="homeRow">
                <img src={chartPng} alt="Stock Chart Img"/>
                <div>
                <h1>Mock Street Stock Exchange</h1>
                <p>Welcome to the Mock Street Stock Exchange!</p>
                <p>Here you can buy and sell stocks, track your portfolio, and view your transaction history.</p>
                <p>Get started by creating an account or logging in.</p>
                </div>
            </div>
        </div>
    )
};

export default Home;