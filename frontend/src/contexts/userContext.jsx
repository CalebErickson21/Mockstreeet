import { createContext, useContext, useState, useEffect } from "react";
import { userStatsHelper, log } from "../utils/helpers";
import { useAuth } from "./authContext";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { user } = useAuth();
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const getUserStats = async () => {
            const data = await userStatsHelper();

            if (data.success) {
                setBalance(data.balance);
            }
            else {
                log('error', 'UserProvider', 'Error fetching user data');
            }
        }
        getUserStats();
    }, [user]);

    return (
        <UserContext.Provider value = {{ balance }}>
            { children }
        </UserContext.Provider>
    );
}

export const useUser = () => {
    return useContext(UserContext);
}