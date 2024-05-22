import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { GoogleLogin } from 'react-google-login';
import { refreshTokenSetup } from '../_utils/refreshToken';
import { Variables } from '../_utils/GlobalVariables';
import Page404 from '../Page404/Page404';
import axios from 'axios';
import $ from 'jquery';
import {
  Link, useNavigate
} from "react-router-dom";

const clientId = '747566937386-7fld458ia1ku014874ivgag4c42mtqt8.apps.googleusercontent.com';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailvalid, setEmailvalid] = useState(false);
  const displayNone = { display: 'none' };


  const navigate = useNavigate();

  const onSuccess = (res) => {
    // console.log('Login Success: currentUser:', res);
    // alert(
    //   `Logged in successfully welcome ${res.profileObj.name} . \n See console for full profile object.`
    // );
    refreshTokenSetup(res);
  };

  const onFailure = (res) => {
    // console.log('Login failed: res:', res);
    console.log(
      `Failed to login. 😢 Please ping this to repo owner twitter.com/sivanesh_fiz`
    );
  };

  const validateEmail = (value) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/.test(value)) {
      $('#EmailInvalidError').hide();
      setEmail(value);
      setEmailvalid(true);
    } else {
      $('#EmailInvalidError').show();
    }
  }

  const logIn = (e) => {
    // console.log('submitPayload');
    e.preventDefault();
    // If fields are blank
    if (email == '' || password == '') {
      return;
    }
    let submitPayload = {
      "username": email,
      "password": password
    };
    // console.log(submitPayload);
    const headers = {
      'Content-Type': 'application/json',
    }   

    setLoading(true);
    axios.post(Variables.apiURL + 'api/v1/auth/login/', submitPayload, { headers: headers })
      .then(response => {
        // $('#EmailExistsError').hide();

        setLoading(false);
        // console.log(response);

        if (response.status == 200) {
          $('#EmailAbsentError').hide();
          $('.alert-success').show();

          localStorage.removeItem("smstequser");
          let user = JSON.stringify(response);
          localStorage.setItem("smstequser", user);
          // console.log(localStorage.getItem("smstequser"));
          setTimeout(function () {
            // navigate('/home');

            window.location.href = "/bulksms";
          }, 1000);
        } else {
          $('.alert-success').hide();
          $('#SubmitError').show();
        }
      })
      .catch(error => {
        console.log('error');
        console.log(error);
        $('#EmailAbsentError').show();
        setLoading(false);
      })
  }

  const handleChange = (event) => {
    // this.setState({ [event.target.name]: event.target.value });
    if (event.target.name == "email") {
      validateEmail(event.target.value);
    } else if (event.target.name == "password") {
      validatePassword(event.target.value);
    }
  }

  const validatePassword = (value) => {
    setPassword(value);
  }

  const img = require('./loginbg.webp');

  const bodyStyle = {
    backgroundImage: `url(${img})`,
    backgroundSize: 'cover'
  }

  return (
    <div>
      <body style={bodyStyle} class="h-100 pt-5">
        <div class="authincation mt-5 mb-5 h-100">
          <div class="container pb-5 login-container h-100">
            <div class="row justify-content-center h-100 align-items-center">
              <div class="col-md-10 col-sm-12">
                <div class="authincation-content">
                  <div class="row no-gutters">
                    <div class="col-xl-12">
                      <div class="auth-form">
                        <h3 class="text-center mb-4 text-primary"><strong>Login</strong><p className='text-black mb-0 p-0 fs-16'>(Existing User)</p></h3>
                        <form onSubmit={logIn}>
                          <div class="form-group">
                            <label class="mb-1 text-primary"><strong>Email</strong></label>
                            <input onChange={handleChange} type="email" name="email" class="form-control" placeholder="hello@example.com" />
                          </div>
                          <div className="alert alert-danger mt-2" id='EmailInvalidError' style={displayNone} role="alert">
                            This Email is Invalid.
                          </div>
                          <div class="form-group">
                            <label class="mb-1 text-primary"><strong>Password</strong></label>
                            <input type="password" onChange={handleChange} name='password' class="form-control" placeholder="Password" />
                          </div>
                          <div className="alert alert-danger" id='EmailAbsentError' style={displayNone} role="alert">
                            Invalid Credentials. Check and try again
                          </div>
                          <div id='loginSuccess' className="alert alert-success" style={displayNone} role="alert">
                            <strong>Success! </strong>Logging you in.
                          </div>
                          <div class="text-center mt-4">
                            <button type="submit" class="btn bg-primary text-white btn-block"> {loading ? <span>Loading...</span> : <span>Sign Me In</span>}</button>
                          </div>
                          <div class="form-row d-flex justify-content-between mt-4 mb-2">
                            <div class="form-group">
                              <Link to="/forgot-password" class="text-primary" ><span className='text-blackish pl-1'>
                                Forgot Password?</span> Recover</Link>
                            </div>
                          </div>
                        </form>
                        {/* <GoogleLogin
                          clientId={clientId}
                          buttonText="Login"
                          onSuccess={onSuccess}
                          onFailure={onFailure}
                          cookiePolicy={'single_host_origin'}
                          style={{ marginTop: '100px' }}
                          isSignedIn={true}
                        /> */}
                        <div class="new-account mt-3">
                          <p class="text-blackish">Don't have an account?               <Link to="/register" class="text-primary" >Sign up</Link> </p>

                          {/* <a href="/register">Sign up</a>  */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </div>
  )
};

Login.propTypes = {};

Login.defaultProps = {};

export default Login;
