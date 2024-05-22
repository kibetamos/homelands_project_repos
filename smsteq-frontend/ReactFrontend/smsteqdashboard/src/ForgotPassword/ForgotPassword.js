import { React, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Link, useNavigate
} from "react-router-dom";
import $ from 'jquery';
import axios from 'axios';
import { Variables } from '../_utils/GlobalVariables';


function ForgotPassword() {

  const displayNone = { display: 'none' };
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailvalid, setEmailvalid] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [currentpasswordError, setCurrentpasswordError] = useState("")
  const [oldpasswordError, setOldpasswordError] = useState("")
  const [CodeError, setCodeError] = useState("")
  const [repeatpasswordError, setRepeatpasswordError] = useState("")
  const [timer, setTimer] = useState(5)

  const handleChange = (event) => {
    // this.setState({ [event.target.name]: event.target.value });
    if (event.target.name == "email") {
      validateEmail(event.target.value);
    }
  }

  const handleResetCodeChange = (event) => {
    // this.setState({ [event.target.name]: event.target.value });
    if (event.target.value.length > 0) {
      $("#CodeError").hide();
      validateEmail(event.target.value);
    }
    setResetCode(event.target.value);
  }

  const validateEmail = (value) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/.test(value)) {
      $('#EmailInvalidError').hide();
      setEmail(value);
      setEmailvalid(true);
    } else {
      $('#EmailInvalidError').show();
    }
  }

  //confirm otp
  const confirmCode = (e) => {
    // console.log('submitPayload');
    e.preventDefault();
    // If fields are blank
    if (resetCode.length != 4) {
      $("#CodeError").show();
      setCodeError("Invalid Code");
      return;
    }
    validatePassword2();
    if (password == '') {
      setOldpasswordError("Your password should be more than 6 characters");
      $('#NewPasswordError').show();
      return;
    }
    let submitPayload = {
      email: email,
      new_password: password,
      otp: resetCode
    }
    // console.log(submitPayload);
    const headers = {
      'Content-Type': 'application/json',
    }
    setResetLoading(true);
    axios.put(Variables.apiURL + 'api/v1/reset_password/', submitPayload, { headers: headers })
      .then(response => {
        // $('#EmailExistsError').hide();

        setResetLoading(false);
        // console.log(response);

        if (response.status == 200) {
          // document.getElementById("NewPasswordForm").reset();
          $('#ResetCodeError').hide();
          $('.alert-success').show();

          setInterval(reduceTimer, 1000);
        } else {
          $('.alert-success').hide();
          $('#ResetCodeError').show();
        }
      })
      .catch(error => {
        console.log('error');
        console.log(error);
        $('#ResetCodeError').show();
        setResetLoading(false);
      })
  }

  let timerr = 5;
  const reduceTimer = () => {
    timerr = timerr - 1;
    setTimer(timerr);
    if (timerr == 0) {
      window.location.href = "/login";
    }
  }

  //send otp to email
  const resetPassword = (e) => {
    // console.log('submitPayload');
    e.preventDefault();
    // If fields are blank
    if (email == '') {
      return;
    }
    let submitPayload = {
      "email": email,
    };
    // console.log(submitPayload);
    const headers = {
      'Content-Type': 'application/json',
    }
    setLoading(true);
    axios.post(Variables.apiURL + 'api/v1/reset_email/', submitPayload, { headers: headers })
      .then(response => {
        // $('#EmailExistsError').hide();

        setLoading(false);
        // console.log(response);

        if (response.status == 200) {
          $('#ResetError').hide();
          $('#EmailSentSuccess').show();
          $('#resetEmailDiv').hide();
          $('#resetCodeDiv').show();
        } else {
          $('.alert-success').hide();
          $('#ResetError').show();
        }
      })
      .catch(error => {
        console.log('error');
        console.log(error);
        $('#ResetError').show();
        setLoading(false);
      })
  }

  const validatePassword2 = () => {
    let newpassword = document.getElementById("newpassword").value;
    let repeatnewpassword = document.getElementById("repeatnewpassword").value;
    if (newpassword != repeatnewpassword) {
      setRepeatpasswordError("The Passwords do not match");
      $('#repeatPasswordError').show();
      return;
    } else {
      $('#repeatPasswordError').hide();
      setPassword(repeatnewpassword);
    }
  }

  const validatePassword = (event) => {
    let value = event.target.value;
    $('#NewPasswordError').hide();
    if (value.length < 6) {
      // $('#IncorrectPasswordError').hide();
      setOldpasswordError("Your password should be more than 6 characters");
      $('#NewPasswordError').show();
    } else {
      $('#NewPasswordError').hide();
      if (/^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{6,}$/.test(value)) {
        // console.log('valid');
        // setPassword(value);
        $('#NewPasswordError').hide();
      } else {
        setOldpasswordError("Your password should contain at least one number and a letter");
        $('#NewPasswordError').show();
      }
    }
  }

  const img = require('./loginbg.png');

  const bodyStyle = {
    backgroundImage: `url(${img})`,
    backgroundSize: 'cover'
  }


  return (
    <body style={bodyStyle} className="h-100 pt-3">
      <div class="authincation mt-5 mb-5 h-100">
        <div class="container pt-5 pb-5 login-container h-100">
          <div className="row justify-content-center h-100 align-items-center">
            <div className="col-md-10 col-sm-12">
              <div className="authincation-content">
                <div className="row no-gutters">
                  <div id='resetEmailDiv' className="col-xl-12">
                    <div className="auth-form">
                      <h3 className="text-center mb-4 text-primary"><strong>Forgot Password</strong></h3>
                      <form onSubmit={resetPassword}>
                        <div className="form-group">
                          <label className="mb-1 text-primary"><strong>Email</strong></label>
                          <input onChange={handleChange} type="email" name="email" className="form-control" placeholder="hello@example.com" />
                        </div>
                        <div className="alert alert-danger mt-2" id='EmailInvalidError' style={displayNone} role="alert">
                          This Email is Invalid.
                        </div>
                        <div className="alert alert-danger mt-2" id='ResetError' style={displayNone} role="alert">
                          <strong>Error!</strong> Make sure the email is registered and try again.
                        </div>
                        <div id='EmailSentSuccess' className="alert alert-success" style={displayNone} role="alert">
                          <strong>Success! </strong>Check your email.
                        </div>
                        <div className="text-center mt-4">
                          <button type="submit" className="btn bg-primary text-white btn-block"> {loading ? <span>Loading...</span> : <span>Reset Password</span>}</button>
                        </div>
                      </form>
                      <div className="new-account mt-3">
                        <p className="text-blackish">Already have an account?
                          <Link to="/login" className="text-primary" > Sign in</Link>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div style={displayNone} id='resetCodeDiv' className="col-xl-12">
                    <div className="auth-form">
                      <h3 className="text-center mb-4 text-primary"><strong>Forgot Password</strong></h3>
                      <form id="NewPasswordForm" onSubmit={confirmCode}>
                        <div className="form-group">
                          <p>Check your email <strong>"{email}"</strong> for the reset code</p>
                          <label className="mb-1 text-primary"><strong>Reset Code</strong></label>
                          <input onChange={handleResetCodeChange} maxLength="4" type="text" className="form-control border-darker" placeholder="...." />
                        </div>
                        <div className="alert alert-danger mt-2" id='CodeError' style={displayNone} role="alert">
                          {CodeError}
                        </div>
                        <div class="form-group">
                          <label className="mb-1 text-primary"><strong>New Password</strong></label>
                          <input onChange={validatePassword} type="password" id="newpassword" class="border-darker form-control" placeholder="Password" />
                          <div className="alert alert-danger mt-2" id='NewPasswordError' style={displayNone} role="alert" >
                            <strong></strong>{oldpasswordError}
                          </div>
                        </div>
                        <div class="form-group">
                          <label className="mb-1 text-primary"><strong>Repeat New Password</strong></label>
                          <input onChange={validatePassword2} type="password" id="repeatnewpassword" class="border-darker form-control" placeholder="Password" />
                          <div className="alert alert-danger mt-2" id='repeatPasswordError' style={displayNone} role="alert">
                            <strong></strong>{repeatpasswordError}
                          </div>
                        </div>
                        <div className="alert alert-danger mt-2" id='EmailInvalidError' style={displayNone} role="alert">
                          This Email is Invalid.
                        </div>
                        <div className="alert alert-danger mt-2" id='ResetCodeError' style={displayNone} role="alert">
                          The code is incorrect
                        </div>
                        <div id='ResetCodeSuccess' className="alert alert-success" style={displayNone} role="alert">
                          Your password was changed successfully. Log in to your account. {timer}
                        </div>
                        <div className="text-center mt-4">
                          <button type="submit" className="btn bg-primary text-white btn-block"> {resetLoading ? <span>Loading...</span> : <span>Submit</span>}</button>
                        </div>
                      </form>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  )
};

ForgotPassword.propTypes = {};

ForgotPassword.defaultProps = {};

export default ForgotPassword;
