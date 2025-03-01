import { AuthProvider } from './authContext'
import { PortfolioProvider } from './portfolioContext'

export function AppProviders({ children }) {
    return (
        <AuthProvider>
            <PortfolioProvider>
                { children }
            </PortfolioProvider>
        </AuthProvider>
    )
}

