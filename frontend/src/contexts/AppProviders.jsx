import { AuthProvider } from './authContext'
import { UserProvider } from './userContext'
import { PortfolioProvider } from './portfolioContext'
import { TransactionProvider } from './transactionContext'

export const AppProviders = ({ children }) => {
    return (
        <AuthProvider>
            <UserProvider>
                <PortfolioProvider>
                    <TransactionProvider>
                        { children }
                    </TransactionProvider>
                </PortfolioProvider>
            </UserProvider>
        </AuthProvider>
    );
}
