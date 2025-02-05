import './login.scss';
import logo from '../../assets/images/text_below.png';

const Login = () => {
    return (
        <div id='login'>
            <div class='contaier-fluid'>
                <div class='row'>
                    <div class='col col-12 col-lg-6 d-flex justify-content-center' id='left'>
                        <img src={logo} alt='Mock Street Logo'/>
                    </div>

                    <div class='col col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center' id='right'>
                        <h2>Welcome Back!</h2>
                        <h5>Log in to manage your portfolio, trade stocks, and make smart investments!</h5>
                        <form>
                            <div class="form-group my-2">
                                <label htmlfor='username'>User Name or Email</label>
                                <input type="text" id='username' class="form-control"  placeholder="ex. JohnDoe123"/>
                            </div>
                            <div class="form-group my-2">
                                <label htmlfor='password'>Password</label>
                                <input type="password" class="form-control" id="password" placeholder="ex. Password123"/>
                            </div>
                            <div class="form-group my-2">
                                <label htmlfor='passwordConfirmation'>Confirm Password</label>
                                <input type="password" class="form-control" id="passwordConfirmation" placeholder="ex. Password123"/>
                            </div>
                            <button class="btn my-2">Login</button>
                        </form>
                        <h5>New? <a>Sign up</a> now and start trading today!</h5>
                    </div>
                </div>
            </div>




        </div>
    )


}

export default Login;