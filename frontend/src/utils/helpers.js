import { useNavigate } from 'react-router-dom';

// Hook to use in components
export const useNavHome = () => {
    const navigate = useNavigate();
    return () => { navigate('/'); }
};

export const useNavLogin = () => {
    const navigate = useNavigate();
    return () => { navigate('/login'); }
}

export const useNavRegister = () => {
    const navigate = useNavigate();
    return () => { navigate('/register'); }
}
