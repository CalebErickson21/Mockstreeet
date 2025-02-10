import { useNavigate } from 'react-router-dom';

// Hook to use in components
export const useNavigation = () => {
    const navigate = useNavigate();
    return (path) => () => navigate(path);
};
