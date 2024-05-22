 import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Header from '../_Layouts/Header/Header';
import Sidebar from '../_Layouts/Sidebar/Sidebar';
import $ from 'jquery';
import { Variables } from '../_utils/GlobalVariables';
import axios from 'axios';
import { setConstantValue } from 'typescript';


const Profile = () => {
  const [currentpasswordError, setCurrentpasswordError] = useState("")
  const [oldpasswordError, setOldpasswordError] = useState("")
  const [repeatpasswordError, setRepeatpasswordError] = useState("")
  const [otherErrors, setOtherErrors] = useState("")
  const [UserDetails, setUserDetails] = useState("")
  const [loading, setLoading] = useState(false)


  const submitForm = (e) => {
    e.preventDefault();
    validate();
  }
  const getUserDetails = () => {
    let thisName = document.getElementById("name")
    let thisEmail = document.getElementById("mail")
    let gotten = JSON.parse(localStorage.getItem("smstequser"));
    let UserDetails = gotten.data
    console.log (UserDetails)
    thisName.innerHTML = UserDetails.first_name + ' ' + UserDetails.last_name;
    thisEmail.innerHTML = UserDetails.username;
  }
  useEffect(() => {
    getUserDetails();
  }, [])
  const validate = () => {
    let currentpassword = document.getElementById("currentpassword").value;
    let newpassword = document.getElementById("newpassword").value;
    let repeatnewpassword = document.getElementById("repeatnewpassword").value;
    if (currentpassword == '' || newpassword == '' || repeatnewpassword == '') {
      setOtherErrors("Please fill all the fields above")
      $('#otherErrors').show();
      return;
    }
    if (newpassword != repeatnewpassword) {
      setRepeatpasswordError("The Passwords do not match");
      $('#repeatPasswordError').show();
      return;
    } else {
      $('#repeatPasswordError').hide();
    }
    let payload =
    {
      "old_password": currentpassword,
      "password": newpassword,
      "password2": repeatnewpassword
    }
    let gotten = JSON.parse(localStorage.getItem("smstequser"));
    let token = gotten.data.access;
    let userid = gotten.data.id;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + token
    }
    hideErrors()
    setLoading(true);
    // console.log(payload)
    axios.put(Variables.apiURL + 'api/v1/change_password/' + userid + "/", payload, { headers: headers })
      .then(response => {
        // $('#EmailExistsError').hide();

        setLoading(false);
        // console.log(response);

        if (response.status == 200) {
          $('#changepasswordSuccess').show();
          document.getElementById("change-password-form").reset();
        } else {
          $('#changepasswordSuccess').hide();
          setOtherErrors("Something Went wrong, Please try again");
          $('#otherErrors').show();
        }

      })
      .catch(error => {
        console.log('error');
        console.log(error);
        // $('#EmailExistsError').hide();
        setLoading(false);
        setOtherErrors("Something went wrong please try again")
        $('#otherErrors').show();
        // if (error.response.data.email) {
        //   $('#EmailExistsError').show();
        // } else {
        //   $('.alert-success').hide();
        //   $('#SubmitError').show();
        // }
      })
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

  const hideErrors = () => {
    $('#otherErrors').hide();
    $('#NewPasswordError').hide();
    $('#repeatPasswordError').hide();
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
    }
  }


  const displayNone = { display: 'none' };
  return (
    <div>
      <Header title="Profile"></Header>
      <Sidebar></Sidebar>
      <div class="content-body">
        <div class="container-fluid">

          <div class="row">
            <div class="col-lg-12">
              <div class="profile card card-body px-3 pt-3 pb-0">
                <div class="profile-head">
                  <h4 class="text-primary pl-4 mb-5">User Information</h4>
                  <div class="profile-info">
                    <div class="profile-photo">
                      <img src="images/profile/profile.png" class="img-fluid rounded-circle" alt="" />
                    </div>
                    <div class="profile-details">
                      <div class=" px-2 mr-2 ">
                        <p class="mb-1">Name</p>
                        <h4 id="name" class="text-muted mb-0"></h4>
                      </div>
                      <div class=" px-2 ">
                        <p class="mb-1">Email</p>
                        <h4 id="mail" class="text-muted mb-0"></h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12">
              <div class="profile card card-body px-3 pt-3 pb-0">
                <div class="profile-head">
                  <h4 class="text-primary pl-3 mb-3">Change Password</h4>
                  <div class="profile-info">
                    {/*  <div class="profile-photo">
                    <img src="images/profile/profile.png" class="img-fluid rounded-circle" alt="" />
                  </div> */}
                    <div class="profile-details ">
                      <form onSubmit={submitForm} id="change-password-form" class="full-width">
                        {/* <p class="mb-1">Change Password</p> */}
                        <div class="form-group ">
                          <div class="col-md-12">
                            <label>Current Password</label>
                            <input type="password" id='currentpassword' class="form-control border-darker" placeholder="Password" />
                            <div style={displayNone} className="alert alert-danger mt-2" id='currentPasswordError' role="alert">
                              <strong> </strong> {currentpasswordError}
                            </div>
                          </div>
                        </div>
                        <div class="form-group col-md-12">
                          <label>New Password</label>
                          <input onChange={validatePassword} type="password" id="newpassword" class="border-darker form-control" placeholder="Password" />
                          <div className="alert alert-danger mt-2" id='NewPasswordError' style={displayNone} role="alert" >
                            <strong></strong>{oldpasswordError}
                          </div>
                        </div>
                        <div class="form-group col-md-12">
                          <label>Repeat New Password</label>
                          <input onChange={validatePassword2} type="password" id="repeatnewpassword" class="border-darker form-control" placeholder="Password" />
                          <div className="alert alert-danger mt-2" id='repeatPasswordError' style={displayNone} role="alert">
                            <strong></strong>{repeatpasswordError}
                          </div>
                        </div>
                        <div className="alert alert-danger mt-2" id='otherErrors' style={displayNone} role="alert">
                          <strong></strong>{otherErrors}
                        </div>
                        <div id='changepasswordSuccess' className="alert alert-success" style={displayNone} role="alert">
                          <strong>Success! </strong>Your password was changed Successfully
                        </div>
                        <button type="submit" class="btn btn-primary">
                          {loading ? <span>Loading...</span> : <span>Change Password</span>}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

Profile.propTypes = {};

Profile.defaultProps = {};

export default Profile;
