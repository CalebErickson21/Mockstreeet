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
}

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
        
        if (response.ok) { // Status code 200-299
            // Return registration data
            const data = await response.json();
            log('info', 'registerHelpers', 'Registration response ok', data);
            return data;
        } else {
            // Return registration error
            const errData = await response.json();
            log('error', 'registerHelper', `${response.status}`, errData.message);
            return { success: false, message: errData.message || 'An error occurred. Please try again.' };
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
        
        if (response.ok) { // Status code 200-299
            // Return response data
            const data = await response.json();
            log('info', 'loginHelper', `${response.status}`, data.message);
            return data;
        }
        else {
            // Return error
            const errData = await response.json();
            log('error', 'loginHelper', `${response.status}`, errData.message);
            return { success: false, message: errData.message || 'An error occured. Please try again.'}
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
}

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
}
