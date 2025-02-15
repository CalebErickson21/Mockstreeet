// Import custom functions
import { useNavigation, loginHelper } from '../../utils/helpers';
import { useState } from 'react';

// Import styles
import './layout.scss';

// Import images
import logo from '../../assets/images/text_below.png';

const Login = () => {
    // Navigation
    const navigate = useNavigation();

    // Login
    const [userNameOrEmail, setUserNameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors

        const data = await loginHelper(userNameOrEmail, password);

        console.log("Login response:", data);
        if (data.success) {
            navigate('/')();
        }
        else {
            setError(data.message);
        }
    }

    

    return (
        <div id='login-register-container'>
            <div className='contaier-fluid'>
                <div className='row'>
                    <div className='col col-12 col-lg-6 d-flex justify-content-center' id='left'>
                        <img src={logo} alt='Mock Street Logo'/>
                    </div>

                    <div className='col col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center' id='right'>
                        <h2>Welcome Back!</h2>
                        <h5>Log in to manage your portfolio, trade stocks, and make smart investments!</h5>
                        <form onSubmit={handleLogin}>
                            <div className="form-group my-2">
                                <label htmlfor='username'>User Name or Email</label>
                                <input required type="text" id='username' value={userNameOrEmail} onChange={(e) => setUserNameOrEmail(e.target.value)} className="form-control"  placeholder="ex. JohnDoe123"/>
                            </div>

                            <div className="form-group my-2">
                                <label htmlfor='password'>Password</label>
                                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="password" placeholder="ex. Password123"/>
                            </div>

                            <button  type='submit' className="btn my-2">Login</button>
                        </form>
                        {error && <p className='error'>{error}</p>}
                        <h5>New? <a onClick={navigate('/register')}>Sign up</a> now and start trading today!</h5>
                    </div>
                </div>
            </div>




        </div>
    )
}

export default Login;