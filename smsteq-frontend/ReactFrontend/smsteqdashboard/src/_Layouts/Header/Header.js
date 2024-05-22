import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Link, useNavigate
} from "react-router-dom";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import { Variables } from '../../_utils/GlobalVariables';
import axios from 'axios';
import SendMessageWizard from '../Wizard/SendMessageWizard';
import BuySmsWizard from '../Wizard/BuySmsWizard';
import BuySenderId from '../Wizard/BuySenderId';

function Header(props) {

  let [currentslidervalue, setCurrentslidervalue] = useState(1000);
  let [amountDue, setamountDue] = useState(1000);
  const [loading, setLoading] = useState(false);
  let gotten = JSON.parse(localStorage.getItem("smstequser"));
  const navigate = useNavigate();
  const { title } = props;

  //on component mount
  useEffect(() => {
    let item = document.getElementById('RechargeSliderValue')
    item.value = 5000;
    setamountDue(5000);
    creditBalance();

    var myElementToCheckIfClicksAreInsideOf = document.querySelector('#sendMessageModalBodyInner');
    var myElementToCheckIfClicksAreInsideOf2 = document.querySelector('#addDraftModalinner');

    // Listen for click events on add Group Modal
    // document.getElementById("sendMessageModal").addEventListener('click', function (event) {
    //   if (myElementToCheckIfClicksAreInsideOf.contains(event.target)) {
    //     // console.log('clicked inside');
    //   } else {
    //     hideAllModals()

    //     let closeBtn = document.getElementById("sendMessageWizardCloseBtn");
    //     if (closeBtn.classList.contains("hide")) {
    //       closeBtn.classList.remove("hide");
    //     }
    //     // console.log('clicked outside');
    //   }
    // });

    // document.getElementById("addDraftsModal").addEventListener('click', function (event) {
    //   if (myElementToCheckIfClicksAreInsideOf2.contains(event.target)) {
    //     // console.log('clicked inside');
    //   } else {
    //     hideAllModals()

    //     let closeBtn = document.getElementById("addDraftModalBtn");
    //     if (closeBtn.classList.contains("hide")) {
    //       closeBtn.classList.remove("hide");
    //     }
    //     // console.log('clicked outside');
    //   }
    // });
  }, []);

  const hideAllModals = (e) => {
    // if (!document.getElementById('addGroupModal').classList.contains("fade")) {
    //   console.log("called");
    //   let chooser = document.getElementById("showGroupModalBtn");
    //   chooser.click();
    // } else {
    //   console.log("not called");
    // }
    let modal = document.getElementsByClassName('modal-backdrop')
    // console.log(modal[0]);
    document.getElementById("hideGroupChooserBtn").click()
    document.getElementById("addDraftModalBtn").click()
    setTimeout(function () {
      modal[0].style.display = 'none'
      // modal[0].classList.toggle('show')
    }, 500)

    // document.getElementById('addGroupModal').classList.toggle("fade")
  }

  // setCurrentslidervalue(1000);


  //if not logged in
  if (gotten == null || !gotten) {
    //redirect to login 
    window.location.href = "/login";
    // console.log(window.location.pathname);
  } else { //refresh token

    const headers = {
      'Content-Type': 'application/json',
    }
    let gotten = JSON.parse(localStorage.getItem("smstequser"));
    let token = gotten.data.refresh;
    let payload = {
      "refresh": token
    };

    axios.post(Variables.apiURL + 'api/v1/auth/refresh/', payload, { headers: headers })
      .then(response => {
        if (response.status == 200) {
          let access = response.data.access;
          let user = gotten;
          user.data.access = access;

          localStorage.removeItem("smstequser");
          let localuser = JSON.stringify(user);
          localStorage.setItem("smstequser", localuser);

          //log out automatically
          setTimeout(function () {
            logOut();
          }, 3600000)
        } else {
          logOut();
        }
      })
  }


  const logOut = () => {
    localStorage.removeItem("smstequser");
    navigate('/login');
  }

  const creditBalance = () => {
    let thisBalance = document.getElementById("balance")
    let gotten = JSON.parse(localStorage.getItem("smstequser"));
    let token = gotten.data.access;
    let id = gotten.data.id;
    // console.log(id)
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + token
    }
    // console.log(user.data);
    axios.get(Variables.apiURL + 'api/v1/credit/balance/' + id, { headers: headers })
      .then(response => {
        // console.log(response.data)
        let userBalance = response.data;
        thisBalance.innerHTML = userBalance.balance;
      })
  }


  // let balance = 0;
  //   if (localStorage.getItem("smstequser") !== null) {
  //     let user = JSON.parse(localStorage.getItem("smstequser"));
  //     // console.log(user.data);
  //     balance = user.data.balance;
  //   }


  return (
    <div>

      {/*  Nav header start */}
      <div className="nav-header">
        <a href="/bulksms" className="brand-logo">
          <img className="logo-abbr" src="./images/logo.png" alt="" />
          <img className="logo-compact" src="./images/logo-text.png" alt="" />
          <img className="brand-title" src="./images/logo-text.png" alt="" />
        </a>

        <div className="nav-control">
          <div className="hamburger">
            <span className="line"></span><span className="line"></span><span className="line"></span>
          </div>
        </div>
      </div>
      {/*  Nav header end */}

      {/* Buy SMS Modal*/}
      <BuySmsWizard></BuySmsWizard>
      {/* Buy SMS Modal End*/}


      {/* Send SMS Modal */}
      <div class="modal fade background-opaque" id="sendMessageModal">
        <div class="modal-dialog sendMessageModalBody" role="document" id="sendMessageModalBodyInner">
          <div class="modal-content sendMessageModalBodyInner">
            <div class="modal-header">
              <h5 class="modal-title">Send Message</h5>
              <button id="sendMessageWizardCloseBtn" type="button" class="close" data-dismiss="modal"><span>&times;</span>
                {/* <button id="sendMessageWizardCloseBtn" type="button" onClick={hideAllModals} class="close" data-dismiss="modal"><span>&times;</span> */}
              </button>
            </div>
            <div class="modal-body overflow-hidden-tag">
              <SendMessageWizard />
              {/* <form>
                <div class="form-group">
                  <label className="mb-1 text-Black"><strong></strong></label>
                  <input type="text" class="form-control input-default " placeholder="From" />
                </div>
                <div class="form-group">
                  <input type="text" class="form-control input-rounded" placeholder="Type Contact or Select from List" />
                </div>
                <div class="form-group">
                  <textarea type="text" class="form-control" placeholder="Type your Message here" />
                </div>
              </form> */}
            </div>
          </div>
        </div>
      </div>
      {/* Send SMS Modal End*/}


      {/* Header start */}
      <div class="header">
        <div class="header-content">
          <nav class="navbar navbar-expand">
            <div class="collapse navbar-collapse justify-content-between">
              <div class="header-left">
                <div class="dashboard_bar">
                  {/* Dashboard */}
                  {title}
                </div>
              </div>
              <ul class="navbar-nav header-right">
                <li class="nav-item">
                  <div class="">
                    <div className='card-header border-none d-block'>
                      <div class="row">
                        <h6 className='card-title'>
                          Wallet Balance
                        </h6>
                      </div>
                      <div class="row">
                        <b className='mb-0 subtitle'>KES. </b> <p id="balance" className='mb-0 subtitle'>
                        </p>
                      </div>

                    </div>
                  </div>
                </li>
                <li class="nav-item"><button data-toggle="modal" data-target="#buyCreditsModalside" type="button" class="btn btn-primary">Buy Credits</button>
                </li>

                <li class="nav-item dropdown header-profile">
                  <a class="nav-link" href="javascript:void(0)" role="button" data-toggle="dropdown">
                    <img src="images/profile/rename.png" width="20" />
                  </a>
                  <div class="dropdown-menu dropdown-menu-right2">
                    <a href="/profile" class="dropdown-item ai-icon">
                      <svg id="icon-user1" xmlns="http://www.w3.org/2000/svg" class="text-primary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      <span class="ml-2">Profile </span>
                    </a>
                    <a href="javascript:void(0);" onClick={logOut} class="dropdown-item ai-icon">
                      <svg id="icon-logout" xmlns="http://www.w3.org/2000/svg" class="text-danger" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                      <span class="ml-2">Logout </span>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
      {/* Header end */}
    </div>
  );
}

Header.propTypes = {
  title: PropTypes.string
};

Header.defaultProps = {
  title: 'Home'
};

export default Header;