// Import custom functions
import { useState } from 'react';
import { useNavigation, registerHelper } from '../../utils/helpers';

// Import styles
import './layout.scss';

// Import logo
import logo from '../../assets/images/text_below.png';

const Register = () => {
    // Navigation
    const navigate = useNavigation();

    // Register
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors

        // Check if password and confirmation match
        if (password !== passwordConfirmation) {
            setError("Passwords do not match.");
            return;
        }

        // Call the registerHelper to handle registration logic
        const data = await registerHelper(firstName, lastName, email, username, password, passwordConfirmation);

        console.log("Register response:", data);

        if (data.success) {
            navigate('/login')(); // Redirect to login page after successful registration
        } else {
            setError(data.message); // Show error message
        }
  };

    return (
        <div id='login-register-container'>
            <div className='contaier-fluid'>
                <div className='row'>
                    <div className='col col-12 col-lg-6 d-flex justify-content-center' id='left'>
                        <img src={logo} alt='Mock Street Logo'/>
                    </div>

                    <div className='col col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center' id='right'>
                        <h2>Welcome!</h2>
                        <h5>Start trading today!</h5>
                        <form onSubmit={handleRegister}>
                            <div className='form-group my-2'>
                                <label htmlfor='firstName'>First Name</label>
                                <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" id='firstName' className="form-control"  placeholder="ex. John"/>
                                <label htmlfor='lastName'>Last Name</label>
                                <input required value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" id='lastName' className="form-control"  placeholder="ex. Doe"/>
                            </div>
                            <div className="form-group my-2">
                                <label htmlfor='email'>Email</label>
                                <input required value={email} onChange={(e) => setEmail(e.target.value)} type="text" id='email' className="form-control"  placeholder="ex. JohnDoe123@example.com"/>
                            </div>
                            <div className="form-group my-2">
                                <label htmlfor='username'>Username</label>
                                <input required value={username} onChange={(e) => setUsername(e.target.value)} type="text" id='username' className="form-control"  placeholder="ex. JohnDoe123"/>
                            </div>
                            <div className="form-group my-2">
                                <label htmlfor='password'>Password</label>
                                <input required value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" id="password" placeholder="ex. Password123"/>
                            </div>
                            <div className="form-group my-2">
                                <label htmlfor='passwordConfirmation'>Confirm Password</label>
                                <input required value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} type="password" className="form-control" id="passwordConfirmation" placeholder="ex. Password123"/>
                            </div>
                            <button className="btn my-2" type='submit'>Register</button>
                        </form>
                        {error && <div id='error'>{error}</div>}
                        <h5>Already have account? <a onClick={navigate('/login')}>Log in!</a></h5>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Register;