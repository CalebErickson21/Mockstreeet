import { createContext, useContext, useState, useEffect } from "react";
import { useNavigation, log } from "../utils/helpers";
import { checkAuthHelper, logoutHelper } from "../utils/helpers";

const AuthContext = createContext(); // Create context instance

export const AuthProvider = ({ children }) => {
    // Navigation
    const navigate = useNavigation();

    const [user, setUser ] = useState(null);

    // Global authentication check
    useEffect(() => {
        const fetchUser = async () => {
            const currUser = await checkAuthHelper();
            setUser(currUser);
            log('info', 'app', 'Fetch user recieved', currUser);
        };
        fetchUser();
    }, []); // Runs on mount
    
    // Logout function
    const handleLogout = async () => {
        const success = await logoutHelper();
        if (success) {
            setUser(null);
            navigate('/')();
            log('info', 'app', 'Logged out successfully');
        }
        else {
            log('error', 'app', 'Error logging out');
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, handleLogout }}>
            { children }
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}