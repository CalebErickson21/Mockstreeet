// Import dependencies
import { useNavigation } from '../../utils/helpers';
import { useEffect } from 'react';

// Import styles
import './modal.scss';

const LoginModal = ({ show }) => {
    // Navigation
    const navigate = useNavigation();

    // Modal controls
    useEffect(() => {
        if (show) {
            document.body.classList.add('modal-open');
        }
        else {
            document.body.classList.remove('modal-open');
        }

        return () => {
            document.body.classList.remove("modal-open"); // Cleanup when component unmounts
        };
    }, [show]);

    // visible component
    return (
        <div id='modal-container'>
            {show && <div className='modal-backdrop fade show'></div>}
            <div className={`modal fade ${show ? "show d-block" : ""}`} id="accessModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title" id="modalTitle">Log in!</h2>
                        </div>

                        <div className="modal-body">
                            <h5>You must be logged into access portfolio, transactions, and market</h5>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn" id="login" onClick={navigate('/login')}>Log In</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default LoginModal;