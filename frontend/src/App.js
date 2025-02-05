import { Route, Routes } from 'react-router-dom';

// Import components
import Header from './components/header.js';
import Footer from './components/footer.js';

// Import pages
import Home from './pages/home/home.js';
import Login from './pages/login/login.js';

const App = () => {
  return (
    <div>
        <Header />
        <Routes>
            <Route path='/' element={<Home />} />

            <Route path='/login' element={<Login />} />
        </Routes>
        <Footer />
    </div>
  )
}

export default App;