// Import library functions
import { useState, useEffect } from 'react'; // useState manages component state, useEffect handles side effects

// Import custom functions
import { useNavHome, useNavLogin, useNavRegister } from '../utils/helpers';

// Import styles
import "./layout.scss";

// Import logo
import logo from "../assets/images/text_right.png";

const lgWidth = 992;

const Header = () => {
    const navHome = useNavHome();
    const navLogin = useNavLogin();
    const navRegister = useNavRegister();

    // Center nav tabs function
    const [isCentered, setIsCenter] = useState(window.innerWidth >= lgWidth);

    useEffect(() => {
        const handleResize = () => {
            setIsCenter(window.innerWidth >= lgWidth);
        }

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);


    return (
        <nav id="navbar" className="navbar sticky-top navbar-expand-lg border-bottom border-body">
            <div className="container-fluid">
                
                <a className="navbar-brand" onClick={navHome}>
                    <img src={logo} alt='MockStreet Logo'/>
                </a>


                <div className="collapse navbar-collapse" id="navCollapse">
                    <ul className={`navbar-nav nav-underline mb-2 mb-lg-0 ${isCentered ? "nav-center" : ""}`} id="nav-center">
                        <li className="nav-item">
                            <a className="nav-link" onClick={navHome}>Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" >Portfolio</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" >Transactions</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" >Buy + Sell</a>
                        </li>
                    </ul>

                    <ul className="navbar-nav nav-underline ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link" onClick={navLogin}>Login</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={navRegister}>Register</a>
                        </li>
                    </ul>
                </div>


                <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navCollapse" aria-controls="navCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

            </div>
        </nav>
    )
};

export default Header;