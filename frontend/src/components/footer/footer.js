import "./footer.scss";

const Footer = () => {
    return (
    <div id="footer-container">
        <footer id="footer" className="">
            <div className="row justify-content-center text-center mx-0 px-3 py-3">
                <div className="col-lg">
                    <h5>Mock Street Stock Portfolio Platform</h5>
                    <p>Buy and sell stocks with confidence! Start practicing trading today!</p>
                    <p>Developed by <a href="https://caleberickson21.github.io/" target="blank">Caleb Erickson</a></p>
                </div>
                <div className="col-lg">
                    <h5>Resources</h5>
                    <p>For more information on stock trading, try out these websites!</p>
                    <p><a href="https://www.dowjones.com/smartmoney/what-is-the-stock-market/" target="blank">What is the stock Market?</a></p>
                    <p><a href="https://finance.yahoo.com/" target="blank">Yahoo Finance News</a></p>
                </div>
                <div className="col-lg">
                    <h5>Support</h5>
                    <p>For any questions or improvement suggestions, please reach out!</p>
                    <p><a data-bs-toggle='modal' data-bs-target='#modal'>Send Email</a></p>
                </div>
            </div>
        </footer>

        <div className="modal fade" id="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title fs-5" id="modalTitle">New message to support team</h2>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label for="emailSubject" className="col-form-label">Subject:</label>
                                <input type="text" className="form-control" id="emailSubject" name="emailSubject" required></input>
                            </div>
                            <div className="mb-3">
                                <label for="emailBody" className="col-form-label">Message:</label>
                                <textarea className="form-control" id="emailBody" required></textarea>
                            </div>
                        </form>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn" data-bs-dismiss="modal" id="close">Close</button>
                        <button type="button" className="btn" id="send">Send</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
};

export default Footer;