// Import custom functions
import { useNavLogin } from '../../utils/helpers';

// Import styles
import './layout.scss';

// Import logo
import logo from '../../assets/images/text_below.png';

const Register = () => {
    const navLogin = useNavLogin();

    return (
        <div id='login'>
            <div className='contaier-fluid'>
                <div className='row'>
                    <div className='col col-12 col-lg-6 d-flex justify-content-center' id='left'>
                        <img src={logo} alt='Mock Street Logo'/>
                    </div>

                    <div className='col col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center' id='right'>
                        <h2>Welcome!</h2>
                        <h5>Start trading today!</h5>
                        <form>
                            <div className='form-group my-2'>
                                <label htmlfor='firstName'>First Name</label>
                                <input type="text" id='firstName' className="form-control"  placeholder="ex. John"/>
                                <label htmlfor='lastName'>Last Name</label>
                                <input type="text" id='lastName' className="form-control"  placeholder="ex. Doe"/>
                            </div>
                            <div className="form-group my-2">
                                <label htmlfor='userName'>Email</label>
                                <input type="text" id='userName' className="form-control"  placeholder="ex. JohnDoe123"/>
                            </div>
                            <div className="form-group my-2">
                                <label htmlfor='password'>Password</label>
                                <input type="password" className="form-control" id="password" placeholder="ex. Password123"/>
                            </div>
                            <div className="form-group my-2">
                                <label htmlfor='passwordConfirmation'>Confirm Password</label>
                                <input type="password" className="form-control" id="passwordConfirmation" placeholder="ex. Password123"/>
                            </div>
                            <button className="btn my-2">Register</button>
                        </form>
                        <h5>Already have account? <a onClick={navLogin}>Log in!</a></h5>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Register;