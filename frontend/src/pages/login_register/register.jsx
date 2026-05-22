// Import custom functions
import { useState } from 'react';
import { useNavigation, registerHelper, log } from '../../utils/helpers';

// Import styles
import './layout.scss';

// Import logo
import logo from '../../assets/images/text_below.png';

const Register = () => {
    // Navigation
    const navigate = useNavigation();

    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        const form = e.currentTarget;
        const formData = new FormData(form);
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const email = formData.get('email');
        const username = formData.get('username');
        const password = formData.get('password');
        const passwordConfirmation = formData.get('passwordConfirmation');

        // Check if password and confirmation match
        if (password !== passwordConfirmation) {
            setError("Passwords do not match.");
            return;
        }

        // Check first name, last name, username, and password length
        if (firstName.length > 25 || lastName.length > 25 || username.length > 25 || password > 25) {
            setError('First name, last name, username, and password must be less than 25 characters');
            return;
        }

        // Check email length
        if (email.length > 50) { 
            setError('Email must be less than 50 characters');
            return;
        }

        // Call the registerHelper to handle registration logic
        const data = await registerHelper(firstName, lastName, email, username, password, passwordConfirmation);

        if (data.success) {
            form.reset();
            navigate('/login')(); // Redirect to login page after successful registration
            log('info', 'registser', 'Successfully logged in', data.user);
        } else {
            log('error', 'register', 'Registration error', data.message);
            setError(data.message); // Show error message
        }
    };

    // Visible component
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
                                <label htmlFor='firstName'>First Name</label>
                                <input required type="text" id="firstName" name="firstName" className="form-control" placeholder="ex. John" autoComplete="given-name" />
                                <label htmlFor='lastName'>Last Name</label>
                                <input required type="text" id="lastName" name="lastName" className="form-control" placeholder="ex. Doe" autoComplete="family-name" />
                            </div>
                            <div className="form-group my-2">
                                <label htmlFor='email'>Email</label>
                                <input required type="email" id="email" name="email" className="form-control" placeholder="ex. JohnDoe123@example.com" autoComplete="email" />
                            </div>
                            <div className="form-group my-2">
                                <label htmlFor='username'>Username</label>
                                <input required type="text" id="username" name="username" className="form-control" placeholder="ex. JohnDoe123" autoComplete="username" />
                            </div>
                            <div className="form-group my-2">
                                <label htmlFor='password'>Password</label>
                                <input required type="password" id="password" name="password" className="form-control" placeholder="ex. Password123" autoComplete="new-password" />
                            </div>
                            <div className="form-group my-2">
                                <label htmlFor='passwordConfirmation'>Confirm Password</label>
                                <input required type="password" id="passwordConfirmation" name="passwordConfirmation" className="form-control" placeholder="ex. Password123" autoComplete="new-password" />
                            </div>
                            <button className="btn my-2" type='submit'>Register</button>
                        </form>
                        {error && <p className='error'>{error}</p>}
                        <h5>Already have account? <button className='link' onClick={navigate('/login')}>Log in!</button></h5>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Register;