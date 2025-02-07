// Import custom functions
import { useNavRegister } from '../../utils/helpers';

// Import styles
import './layout.scss';

// Import images
import logo from '../../assets/images/text_below.png';

const Login = () => {
    const navRegister = useNavRegister();

    return (
        <div id='login'>
            <div className='contaier-fluid'>
                <div className='row'>
                    <div className='col col-12 col-lg-6 d-flex justify-content-center' id='left'>
                        <img src={logo} alt='Mock Street Logo'/>
                    </div>

                    <div className='col col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center' id='right'>
                        <h2>Welcome Back!</h2>
                        <h5>Log in to manage your portfolio, trade stocks, and make smart investments!</h5>
                        <form>
                            <div className="form-group my-2">
                                <label htmlfor='userName'>User Name or Email</label>
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
                            <button className="btn my-2">Login</button>
                        </form>
                        <h5>New? <a onClick={navRegister}>Sign up</a> now and start trading today!</h5>
                    </div>
                </div>
            </div>




        </div>
    )


}

export default Login;