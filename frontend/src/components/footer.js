import "./layout.scss";

const Footer = () => {
    return (
        <footer id="footer" class="">
            <div class="row justify-content-center text-center mx-0 px-3 py-3">
                <div class="col-lg">
                    <h5>Mock Street Stock Portfolio Platform</h5>
                    <p>Buy and sell stocks with confidence! Start practicing trading today!</p>
                    <p>Developed by Caleb Erickson // LINK PORTFOLIO //</p>
                </div>
                <div class="col-lg">
                    <h5>Resources</h5>
                    <p>For more information on stock trading, try out these websites!</p>
                    <p>// WEBSITES //</p>
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