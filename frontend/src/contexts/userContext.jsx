import { createContext, useContext, useState, useEffect } from "react";
import { balanceHelper, log } from "../utils/helpers";
import { useAuth } from "./authContext";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { user } = useAuth();
    const [balance, setBalance] = useState(0);

    const updateBalance = async () => {
        const data = await balanceHelper();

        if (data.success) {
            setBalance(data.balance);
        }
        else {
            log('error', 'UserProvider', 'Error fetching user data');
        }
    }
    useEffect(() => {
        updateBalance();  
    }, [user]);

    return (
        <UserContext.Provider value = {{ balance, updateBalance }}>
            { children }
        </UserContext.Provider>
    );
}

export const useUser = () => {
    return useContext(UserContext);
}