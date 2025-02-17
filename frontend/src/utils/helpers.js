import { useNavigate } from 'react-router-dom';

// Hook to use in components
export const useNavigation = () => {
    const navigate = useNavigate();
    return (path) => () => navigate(path);
};

// Handle register
export const registerHelper = async (firstName, lastName, email, username, password, passwordConfirmation) => {
    try {
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ firstName, lastName, email, username, password, passwordConfirmation }),
        });
        
        if (response.ok) {
            const data = await response.json();
            return data; // Return the response data
        } else {
            const errData = await response.json();
            return { success: false, message: errData.message || 'An error occurred. Please try again.' };
        }
    } catch (error) {
        console.error("Registration error:", error);
        return { success: false, message: "An error occurred. Please try again." };
    }
};


// Handle Login
export const loginHelper = async (userNameOrEmail, password) => {
    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ userNameOrEmail, password }),
        });
        
        if (response.ok) {
            const data = await response.json();
            return data; // Return the response data
        }
        else {
            const errData = await response.json();
            return { success: false, message: errData.message || 'An error occured. Please try again.'}
        }
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "An error occurred. Please try again." };
    }
};

// Check user authentication
export const checkAuthHelper = async () => {
    try {
        const response = await fetch("http://localhost:5000/check-auth", { credentials: "include" });
        const data = await response.json();

        return data.success ? data.user: null;
    }
    catch (err) {
        console.error("Authentication error:", err);
        return null;
    }
}

// Handle logout
export const logoutHelper = async () => {
    try {
        const response = await fetch("http://localhost:5000/logout", {credentials: "include"});
        const data = await response.json();

        if (data.success) {
            return true;
        }
        else {
            console.error("Logout error");
            return false;
        }
    }
    catch (err) {
        console.error("Logout error:", err);
        return false;
    }
}
