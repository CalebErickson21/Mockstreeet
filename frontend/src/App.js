import { Route, Routes } from 'react-router-dom';

// Import components
import Header from './components/header';
import Footer from './components/footer';

// Import pages
import Home from './pages/home';

const App = () => {
  return (
    <div>
        <Header />
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
        <Footer />
    </div>
  )
}

export default App;