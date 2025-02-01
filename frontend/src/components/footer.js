import "./layout.scss";

const Footer = () => {
    return (
        <footer id="footer" class="">
            <div class="row justify-content-center text-center mx-0 px-3 py-3">
                <div class="col-lg">
                    <h5>Mock Street Stock Portfolio Platform</h5>
                    <p>Buy and sell stocks with confidence! Start practicing trading today!</p>
                    <p>Developed by <a href="https://caleberickson21.github.io/">Caleb Erickson</a></p>
                </div>
                <div class="col-lg">
                    <h5>Resources</h5>
                    <p>For more information on stock trading, try out these websites!</p>
                    <p><a href="https://www.dowjones.com/smartmoney/what-is-the-stock-market/">What is the stock Market?</a></p>
                    <p><a href="https://finance.yahoo.com/">Yahoo Finance News</a></p>
                </div>
                <div class="col-lg">
                    <h5>Support</h5>
                    <p>For any questions or improvement suggestions, please reach out!</p>
                    <p>// EMAIL //</p>
                </div>
            </div>
        </footer>
    )
};

export default Footer;