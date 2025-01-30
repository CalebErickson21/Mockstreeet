import React from "react";
import "../styles/output.css";
import chartPng from "../images/chart.png";

const Home = () => {
    return (
        <>
            <nav id="navbar" class="navbar sticky-top navbar-expand-lg border-bottom border-body" data-bs-theme="dark">
                <div class="container-fluid">
                <button class="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navCollapse" aria-controls="navCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navCollapse">
                    <ul class="navbar-nav nav-underline mx-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" href="#">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Portfolio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Transactions</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Buy + Sell</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link mx-end" href="#">Login</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link mx-end" href="#">Register</a>
                    </li>
                    </ul>
                </div>
                </div>
            </nav>

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
        </>
    )
};

export default Home;