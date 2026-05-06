// Import dependencies
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

// Import styles
import "./header.scss";

// Import logo
import logo from "../../assets/images/text_right.png";

// Declare screen width (boostrap variable)
const lgWidth = 992;

const Header = () => {
    const { user, handleLogout } = useAuth();

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

                    <Link className="navbar-brand" to="/">
                        <img src={logo} alt='MockStreet Logo'/>
                    </Link>


                    <div className="collapse navbar-collapse" id="navCollapse">
                        <ul className={`navbar-nav nav-underline mb-2 mb-lg-0 ${isCentered ? "nav-center" : ""}`} id="nav-center">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/portfolio">Portfolio</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/market">Buy + Sell</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/transactions">Transactions</Link>
                            </li>
                        </ul>
                        {user ? (
                            <ul className="navbar-nav nav-underline ms-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <button
                                        type="button"
                                        className="nav-link btn btn-link text-start text-decoration-none p-0 border-0"
                                        onClick={() => void handleLogout()}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        ) : (
                            <ul className="navbar-nav nav-underline ms-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
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
