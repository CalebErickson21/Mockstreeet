// Dependencies
import { useState, useEffect } from "react";
import { emailHelper } from '../../utils/helpers.js';

// Import styles
import "./footer.scss";

const Footer = () => {
    // States
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setEmail('');
        setSubject('');
        setMessage('');
        setSuccess('');
        setError('');
    }, []);

    const handleEmail = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');

        const data = await emailHelper(email, subject, message);

        if (data.success) {
            setSuccess(data.message);
            setEmail('');
            setSubject('');
            setMessage('');
        }
        else {
            setError(data.message);
        }
    }

    // Visible component
    return (
    <div id="footer-container">
        <footer id="footer" className="">
            <div className="row justify-content-center text-center mx-0 px-3 py-3">
                <div className="col-lg">
                    <h5>Mock Street Stock Portfolio Platform</h5>
                    <p>Buy and sell stocks with confidence! Start practicing trading today!</p>
                    <p>Developed by <a href="https://caleberickson21.github.io/"  target="_blank" rel='noreferrer'>Caleb Erickson</a></p>
                </div>
                <div className="col-lg">
                    <h5>Resources</h5>
                    <p>For more information on stock trading, try out these websites!</p>
                    <p><a href="https://www.dowjones.com/smartmoney/what-is-the-stock-market/" target="_blank" rel='noreferrer'>What is the stock Market?</a></p>
                    <p><a href="https://finance.yahoo.com/" target="_blank" rel='noreferrer'>Yahoo Finance News</a></p>
                </div>
                <div className="col-lg">
                    <h5>Support</h5>
                    <p>For any questions or improvement suggestions, please reach out!</p>
                    <p><a data-bs-toggle='modal' data-bs-target='#modal' href='#modal'>Send Email</a></p>
                </div>
            </div>
        </footer>

        <div className="modal fade" id="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title fs-5" id="modalTitle">New message to support team</h2>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <form onSubmit={handleEmail}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="emailEmail" className='col-form-label'>Email:</label>
                                <input onChange={(e) => setEmail(e.target.value)} type='text' className="form-control" id="emailEmail" name="emailEmail" required></input>

                                <label htmlFor="emailSubject" className="col-form-label">Subject:</label>
                                <input onChange={(e) => setSubject(e.target.value)} type="text" className="form-control" id="emailSubject" name="emailSubject" required></input>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="emailBody" className="col-form-label">Message:</label>
                                <textarea onChange={(e) => setMessage(e.target.value)} className="form-control" id="emailBody" required></textarea>
                            </div>
                        </div>

                        <div className="modal-footer">
                            {error && <div className='error'>{error}</div>}
                            {success && <div className='success'>{success}</div>}
                            <button type="button" className="btn" data-bs-dismiss="modal" id="close">Close</button>
                            <button type="submit" className="btn" id="send">Send</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    )
};

export default Footer;