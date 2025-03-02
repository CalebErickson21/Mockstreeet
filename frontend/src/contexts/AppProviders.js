import { AuthProvider } from './authContext'
import { UserProvider } from './userContext'
import { PortfolioProvider } from './portfolioContext'

export const AppProviders = ({ children }) => {
    return (
        <AuthProvider>
            <UserProvider>
                <PortfolioProvider>
                    { children }
                </PortfolioProvider>
            </UserProvider>
        </AuthProvider>
    );
}
