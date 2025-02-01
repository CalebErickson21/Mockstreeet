import { useNavigate }  from 'react-router-dom';

// Import styles
import "./layout.scss";

const Header = () => {
    const navigate = useNavigate();

    const navHome = () => {
        navigate('/'); // Navigate to homepage
    };
    return (
        <nav id="navbar" class="navbar sticky-top navbar-expand-lg border-bottom border-body" data-bs-theme="dark">
            <div class="container-fluid">
                <button class="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navCollapse" aria-controls="navCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navCollapse">
                    <ul class="navbar-nav nav-underline mx-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link" onClick={navHome}>Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" >Portfolio</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" >Transactions</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" >Buy + Sell</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link mx-end" >Login</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link mx-end" >Register</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
};

export default Header;