// Import dependencies
import { useNavigate } from 'react-router-dom';

/** Logger function
 * 
 * @param {*} level 
 * @param {*} module 
 * @param {*} message 
 * @param {*} data 
 */
export const log = (level, module, message, data = null) => {
    const timeStamp = new Date().toISOString();
    console[level](`[${level.toUpperCase()}] [${timeStamp}] [${module}] - [${message}]`, data || '');
};

/** Navigation helper
 * 
 * @returns function that takes path as argument as navigates to that path 
 */
export const useNavigation = () => {
    const navigate = useNavigate();
    return (path) => () => navigate(path);
};

/** Register Helper
 * 
 * @param {*} firstName 
 * @param {*} lastName 
 * @param {*} email 
 * @param {*} username 
 * @param {*} password 
 * @param {*} passwordConfirmation 
 * @returns the server response after backend request
 */
export const registerHelper = async (firstName, lastName, email, username, password, passwordConfirmation) => {
    try {
        // Backed request with registration information
        const response = await fetch('http://localhost:5000/register', { // Backend path
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Ensures cookies are included in request
            body: JSON.stringify({ firstName, lastName, email, username, password, passwordConfirmation }), // Request body
        });
        const data = await response.json();
        
        if (response.ok) { // Status code 200-299
            // Return registration data
            log('info', 'registerHelpers', 'Registration response ok', data);
            return data;
        } else {
            // Return registration error
            log('error', 'registerHelper', `${response.status}`, data.message);
            return { success: false, message: data.message || 'An error occurred. Please try again.' };
        }
    } catch (err) {
        // Error handling
        log('error', 'registerHelper', 'Error: ', err.message);
        return { success: false, message: "An error occurred. Please try again." };
    }
};

/** Login Helper
 * 
 * @param {*} userNameOrEmail 
 * @param {*} password 
 * @returns the server response after backend request
 */
export const loginHelper = async (userNameOrEmail, password) => {
    try {
        // Backend request with login information
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Include cookies
            body: JSON.stringify({ userNameOrEmail, password }),
        });
        const data = await response.json();
        
        if (response.ok) { // Status code 200-299
            // Return good response
            log('info', 'loginHelper', `${response.status}`, data.message);
            return data;
        }
        else {
            // Return error
            log('error', 'loginHelper', `${response.status}`, data.message);
            return { success: false, message: data.message || 'An error occured. Please try again.'};
        }
    } catch (err) {
        // Error handling
        log('error', 'loginHelper', 'Error: ', err.message);
        return { success: false, message: "An error occurred. Please try again." };
    }
};

/** Check authentication helper
 * 
 * @returns the server response after backend request
 */
export const checkAuthHelper = async () => {
    try {
        // Backend request
        const response = await fetch("http://localhost:5000/check-auth", {
            method: "GET",
            credentials: "include" 
        });
        const data = await response.json();

        // Return status of authentication
        log('info', 'checkAuthHelper', `${response.status}`, data.message);
        return data.success ? data.user : null;
    }
    catch (err) {
        // Error handling
        log('error', 'checkAuthHelper', 'Error: ', err.message);
        return null;
    }
};

/** Portfolio name helper
 * 
 * @returns all the portfolio names for a user
 */
export const portfolioNameHelper = async () => {
    try {
        const response = await fetch('http://localhost:5000/portfolio/names', {
            method: 'GET',
            headers: { 'Content-Type' : 'application/json' },
            credentials: 'include',
        });
        const data = await response.json();

        if (response.ok) {
            log('info', 'portfolioNameHelper', `${response.status}`, data.message);
            return data;
        }
        else {
            // Return error
            log('error', 'portfolioNameHelper', `${response.status}`, data.message);
            return {success: false, message: data.message || 'An error occured. Please try again'};
        }
    }
    catch (err) {
        log('error', 'portfolioNameHelper', 'Error: ', err.message);
        return { success: false, message: "An error occurred. Please try again." };
    }
};

/** Portfolio stock helper
 * 
 * @param {*} portfolio 
 * @returns the server response from backedn
 */
export const portfolioStocksHelper = async ( portfolio ) => {
    try {
        // Backend request with portfolio information
        const response = await fetch(`http://localhost:5000/portfolio/stocks?portfolio=${portfolio}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Include cookies
        });
        const data = await response.json();

        if (response.ok) { // Status code 2XX
            log('info', 'portfolioStocksHelper', `${response.status}`, data);
            return data;
        }
        else {
            // Return error
            log('error', 'portfolioStocksHelper', `${response.status}`, data.message);
            return {success: false, message: data.message || 'An error occured. Please try again'};
        }
    }
    catch (err) {
        log('error', 'portfolioStocksHelper', 'Error: ', err.message);
        return { success: false, message: "An error occurred. Please try again." };
    }
};

/** New portfolio helper
 * 
 * @param {*} portfolio 
 * @returns 
 */
export const portfolioNewHelper = async ( portfolio ) => {
    try {
        // Backend request with login information
        const response = await fetch('http://localhost:5000/portfolio/new', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Include cookies
            body: JSON.stringify({ portfolio }),
        });
        const data = await response.json();

        if (response.ok) {
            return data;
        }
        else {
            return({ success: false, message: data.message || 'An error occured. Please try again.' });
        }
    }
    catch (err) {
        log('error', 'portfolioStocksHelper', 'Error: ', err.message);
        return { success: false, message: "An error occurred. Please try again." };
    }
};

/** User stats helper
 * 
 * @returns user balance
 */
export const userStatsHelper = async () => {
    try {
        // Backend request with login information
        const response = await fetch('http://localhost:5000/user/stats', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Include cookies
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        }
        else {
            return ({ success: false, message: data.message || 'An error occured. Please try again.' });
        }
    }
    catch (err) {
        log('error', 'userStatsHelper', 'Error: ', err.message);
        return ({ success: false, message: err.message || 'An error occured. Please try again.' });
    }
};

/** Transactions helper
 * 
 * @returns all transactions that fit the given parameters
 */
export const transactionsHelper = async (portfolioFilter, stockFilter, startDateFilter, endDateFilter) => {
    try {
        const response = await fetch(`http://localhost:5000/portfolio/transactions?portfolio=${portfolioFilter}&stock=${stockFilter}&startDate=${startDateFilter}&endDate=${endDateFilter}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Include cookies
        });
        const data = await response.json();

        if (response.ok) {
            return data;
        }
        else {
            return ({ success: false, message: data.message || 'An error occured. Please try again.' });
        }
    }
    catch (err) {
        log('error', 'transactionsHelper', 'Error: ', err.message);
        return ({ success: false, message: err.message || 'An error occured. Please try again.' });
    }
};

export const marketHelper = async (searchStock) => {
    try {
        const response = await fetch(`http://localhost:5000/market/search?stock=${searchStock}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Include cookies
        });
        const data = await response.json();

        if (response.ok) {
            return data;
        }
        else {
            return ({ success: false, message: data.message || 'An error occured. Please try again.' });
        }
    }
    catch (err) {
        log('error', 'marketHelper', 'Error: ', err.message || 'An error occured. Please try again.');
        return ({ success: false, message: err.message || 'An error occured. Please try again.' });
    }
};

/** Logout helper
 * 
 * @returns true = successful logout, false otherwise
 */
export const logoutHelper = async () => {
    try {
        // Backedn request
        const response = await fetch("http://localhost:5000/logout", {
            method: "GET", // Default method for fetch(), included for clarity
            credentials: "include"
        });
        const data = await response.json();

        // Return logout status
        if (data.success) {
            log('info', 'logoutHelper', `${response.status}`, data.message);
            return true;
        }
        else {
            log('error', 'logoutHelper', `${response.status}`, data.message);
            return false;
        }
    }
    catch (err) {
        // Error handling
        log('error', 'logoutHelper', 'Error: ', err.message);
        return false;
    }
};
