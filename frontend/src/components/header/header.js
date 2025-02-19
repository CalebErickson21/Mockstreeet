// Import dependencies
import { useState, useEffect } from 'react'; // useState manages component state, useEffect handles side effects
import { useNavigation }  from '../../utils/helpers';

// Import styles
import "./header.scss";

// Import logo
import logo from "../../assets/images/text_right.png";

// Declare screen width (boostrap variable)
const lgWidth = 992;

const Header = ({ user, handleLogout }) => {
    const navigate = useNavigation();

    // Center nav tabs function - handles window resizing
    const [isCentered, setIsCenter] = useState(window.innerWidth >= lgWidth);
    useEffect(() => {
        const handleResize = () => {
            setIsCenter(window.innerWidth >= lgWidth);
        }

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Visible component
    return (
        <div id='header-container'>
            <nav id="navbar" className="navbar sticky-top navbar-expand-lg border-bottom border-body">
                <div className="container-fluid">
                    
                    <a className="navbar-brand" onClick={navigate('/')}>
                        <img src={logo} alt='MockStreet Logo'/>
                    </a>


                    <div className="collapse navbar-collapse" id="navCollapse">
                        <ul className={`navbar-nav nav-underline mb-2 mb-lg-0 ${isCentered ? "nav-center" : ""}`} id="nav-center">
                            <li className="nav-item">
                                <a className="nav-link" onClick={navigate('/')}>Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" onClick={navigate('/portfolio')}>Portfolio</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" onClick={navigate('/market')}>Buy + Sell</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" onClick={navigate('/transactions')}>Transactions</a>
                            </li>
                        </ul>
                        {user ? (
                            <ul className="navbar-nav nav-underline ms-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <a className="nav-link" onClick={handleLogout}>Logout</a>
                                </li>
                            </ul>
                        ) : (
                            <ul className="navbar-nav nav-underline ms-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <a className="nav-link" onClick={navigate('/login')}>Login</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" onClick={navigate('/register')}>Register</a>
                                </li>
                            </ul>
                        )}
                    </div>


                    <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navCollapse" aria-controls="navCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                </div>
            </nav>
        </div>
    )
};

export default Header;