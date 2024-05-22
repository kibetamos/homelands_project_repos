import React, { useState, forwardRef, useRef, useImperativeHandle, useEffect } from "react";
import PropTypes from 'prop-types';
import Header from '../_Layouts/Header/Header';
import Sidebar from '../_Layouts/Sidebar/Sidebar';
import { Variables } from './../_utils/GlobalVariables';
import axios from 'axios';
import $ from 'jquery';
import BuySenderId from "../_Layouts/Wizard/BuySenderId";

const SenderIds = () => {
  const [uploading, setUploading] = useState(false);
  const [senderIDError, setSenderIDError] = useState(false);
  const [payload, setPayload] = useState({});
  const displayNone = { display: "none" };
  const [loading, setLoading] = useState(true);
  const [SenderIDs, setSenderIDs] = useState([]);
  const senderNameError = false;

  //on component mount
  useEffect(() => {
    let gotten = JSON.parse(localStorage.getItem("smstequser"));
    let token = gotten.data.access;
    const headers = {
      'Content-Type': 'multipart/form-data',
      'Authorization': "Bearer " + token
    }

    setLoading(true);
    axios.get(Variables.apiURL + 'api/v1/sender_id/', { headers: headers })
      .then(response => {

        setLoading(false);
        // console.log(loading);
        // console.log(response);

        if (response.status == 200) {
          setSenderIDs(response.data);
        } else {
          $('#stk-success').addClass('d-none');
          $('#stk-error').removeClass('d-none');
        }
      })
      .catch(error => {
        console.log('error');
        console.log(error);
        // $('#EmailAbsentError').show();
        setLoading(false);
      })
  }, []);

  const closeApplySenderIdModal = () => {
    //toggle Sender ID Modal
    let chooser = document.getElementById("applySenderIdModalBtn");
    chooser.click();
  }

  const showApplySenderIdModal = () => {
    //toggle Sender ID Modal
    let chooser = document.getElementById("applySenderIdModalBtn");
    chooser.click();
  }

  const toggleMpesaModal = () => {
    //toggle Sender ID Modal 
    let chooser = document.getElementById("buySenderIdModalsideBtn");
    chooser.click();
  }

  //check sender id error
  const isNameValid = (name) => {
    if (name.length > 11) {
      return false;
    }
    var format = /[ `!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?~]/;
    if (/\s/.test(name)) {
      setSenderIDError("The name cannot contain spaces");
      document.getElementById("senderIdError").classList.remove('d-none');
      return false;
    } else if (format.test(name)) {
      setSenderIDError("The only special characters allowed is underscore (_) and dash (-)");
      document.getElementById("senderIdError").classList.remove('d-none');
      return false;
    } else if (name.length < 2) {
      setSenderIDError("That name is too short");
      document.getElementById("senderIdError").classList.remove('d-none');
      return false;
    }
    else {
      document.getElementById("senderIdError").classList.add('d-none');
      return true;
    }
  }


  const checkSenderId = () => {
    isNameValid(document.getElementById("senderNameInput").value)
  }

  //if usage select changed
  const usageChanged = () => {
    if (document.getElementById("describe_usage").value == "") {
      document.getElementById("usage_error").classList.remove('d-none');
      return;
    } else {
      document.getElementById("usage_error").classList.add('d-none');
    }
  }

  //if document was uploaded
  const documentChanged = () => {
    if (document.getElementById("document").files.length == 0) {
      document.getElementById("ApplicationLetterError").classList.remove('d-none');
      return;
    } else {
      document.getElementById("ApplicationLetterError").classList.add('d-none');
    }
  }

  const submitForm = (e) => {
    e.preventDefault();
    let gotten = JSON.parse(localStorage.getItem("smstequser"));
    let token = gotten.data.access;

    //sender id name check
    if (!isNameValid(document.getElementById("senderNameInput").value)) {
      return;
    }

    //usage select check
    usageChanged();

    //if document was uploaded
    documentChanged();

    setUploading(true);

    let payload = {
      "sender_id": document.getElementById("senderNameInput").value,
      "describe_usage": document.getElementById("describe_usage").value,
      "document": document.getElementById("document").files[0],
    }

    setPayload(payload);

    toggleMpesaModal();

    // axios.post(Variables.apiURL + 'api/v1/upload_contact/', payload, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //     'Authorization': "Bearer " + token
    //   }
    // })
    //   .then(response => {
    //     setUploading(false);
    //     //change loading status
    //     // setSendingMessages(false);
    //     // console.log("response");
    //     // console.log(response);
    //     // summaryCompRef.current.setSendMessageBtnLoading(false);

    //     // $('#EmailExistsError').hide();

    //     // setLoading(false);
    //     // console.log(loading);

    //     // if (response.status == 201) {
    //     let elm2 = document.getElementById("CsvNotUploaded");
    //     elm2.classList.add("d-none")
    //     let elm = document.getElementById("CsvUploaded");
    //     elm.classList.remove("d-none")

    //     setTimeout(function () {
    //       // navigate('/home');
    //       window.location.href = "/contacts";
    //     }, 1500);
    //   })
    //   .catch(error => {
    //     setUploading(false);
    //     let elm = document.getElementById("CsvNotUploaded");
    //     elm.classList.remove("d-none")
    //     // setSendingMessages(false);
    //     // summaryCompRef.current.setSendMessageBtnLoading(false);
    //     // console.log('error');
    //     // console.log(error);
    //     // $('#EmailAbsentError').show();
    //     // setLoading(false);
    //   })
  }

  return (
    <div>
      <Header title="Profile"></Header>
      <Sidebar></Sidebar>
      <BuySenderId payload={payload}></BuySenderId>
      <div class="content-body">
        {loading == true ?
          <div class="col-md-2 loader5 bg-blue-gradient">
            <div class="fingerprint-spinner">
              <div class="spinner-ring"></div>
              <div class="spinner-ring"></div>
              <div class="spinner-ring"></div>
              <div class="spinner-ring"></div>
              <div class="spinner-ring"></div>
              <div class="spinner-ring"></div>
              <div class="spinner-ring"></div>
              <div class="spinner-ring"></div>
              <div class="spinner-ring"></div>
            </div>
          </div>
          :
          <div class="container-fluid">


            {SenderIDs.length < 1 ?
              <div class="row">
                <div class="col-lg-12">
                  <div class="profile card text-center card-body p-5">
                    <h4 class="text-primary pl-4 mb-5">You do not have a sender ID In your account! </h4>
                    <h5>Sender IDs enable you to brand all outgoing Messages with your organisation's name.<br /><br /> This way your customers immediately know who the SMS is from.</h5>
                    <div className='pt-5'><button type="button" class="btn btn-info" onClick={showApplySenderIdModal}>Apply for Sender ID</button></div>
                  </div>
                </div>
              </div>
              :

              <div class="row">
                <div class="col-lg-12">

                  {SenderIDs.length > 0 ?
                    <div class="card">
                      <div class="card-header">
                        <h4 class="card-title"></h4>
                        <a href="javascript:void(0)" data-toggle="modal" data-target="#applySenderIdModal" type="button" class="btn btn-outline-primary text-nowrap btn-sm">New Sender ID</a>

                      </div>
                      <div class="card-body">
                        <div class="table-responsive col-12">
                          <table id="example3" class="table card-table display dataTablesCard" defaultPageSize={10}
                            showPaginationBottom >
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                SenderIDs
                                  .map((draft, index) =>
                                    <tr>
                                      <td class="pr-5" >{draft.sender_id}</td>
                                      <td class="pr-5" >
                                        {draft.is_approved == true ?
                                          <span className="text-green">Active</span>
                                          :
                                          <span className="text-red">Pending Approval</span>
                                        }
                                      </td>
                                      {/* <td>
                                    {<div class="d-flex ">
                                        <a onClick={() => this.getDraftEdit(index)} href="javascript:void(0)" data-toggle="modal" data-target="#editDraftModal"
                                            class="btn btn-primary shadow btn-xs sharp mr-1"><i class="fa fa-pencil"></i></a>
                                        <a onClick={e => this.getDraftDelete(index)} href="javascript:void(0)" class="btn btn-danger shadow btn-xs sharp" data-toggle="modal" data-target="#deleteDraftModal">
                                            <i class="fa fa-trash"></i></a>
                                    </div>}
                                </td> */}
                                    </tr>
                                  )
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    :
                    <div class="p-4">
                      You do not have any sender ID!!!.
                    </div>
                  }
                </div>
              </div>
            }
            {/* Apply Sender ID Modal  */}
            <div class="modal fade higherzindex background-opaque" id="applySenderIdModal">
              <div class="modal-dialog wider-contact-chooser" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h3 class="modal-title">SenderID Application</h3>
                    <button type="button" class="close" onClick={closeApplySenderIdModal}><span>&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <div class="row">
                      <div class="col-lg-12">
                        <div class="profile card px-3 pb-0">
                          {/* <p className='text-center'>Let your customers know who the SMS is From by branding it with your business name.</p> */}
                          <div class="profile-head">
                            <div class="profile-info">
                              <div class="profile-details">
                                <form onSubmit={submitForm} id="apply-senderid-form" class="full-width">
                                  <div class="form-group">
                                    <div class="col-md-12">
                                      <p><i className="fa fa-danger"></i>The senderid you chose should have some similarity to your business name.<span> Maximum 11 Characters.</span> </p>
                                      <label className='text-black'>Preffered SenderID *</label>
                                      <input onChange={checkSenderId} onKeyUp={checkSenderId} type="text" id='senderNameInput' maxLength="11" class="form-control border-darker" placeholder="Eg. UjumbePap" />
                                      <div className="alert d-none alert-danger mt-2" id='senderIdError' role="alert">
                                        <strong>Error! </strong> {senderIDError}
                                      </div>
                                    </div>
                                    <div class="col-md-12 mt-4">
                                      <label className='text-black'> Sender Id Type *</label>
                                      <select onChange={usageChanged} id="describe_usage" name="describe_usage" className="form-control border-darker">
                                        <option selected disabled value="">
                                          --Select One--
                                        </option>
                                        <option value="promotional">
                                          Promotional
                                        </option>
                                        <option value="transactional">
                                          Transactional
                                        </option>
                                      </select>
                                      <div className="alert d-none alert-danger mt-2" id='usage_error' role="alert">
                                        <strong>Error! </strong> Please select one
                                      </div>
                                    </div>
                                    <div className='col-md-12 mt-4'>
                                      <label className='text-black'>Download Sample Application Letter and Fill it Appropriately. </label>
                                      <a href="AuthorizationLetterSafaricom.docx">
                                        <button type="button" class="text-blacker btn btn-xxs btn-outline-dark">
                                          <span class="text-info mr-2"><i class="fa fa-download color-info"></i></span>Safaricom Sample Letter
                                        </button>
                                      </a>
                                    </div>
                                    <div className='col-md-12 mt-4'>
                                      <label className='text-black'>Upload Application Letter (PDF Only) *</label>
                                      <input onChange={documentChanged} type="file" id='document' name="document" class="form-control border-darker" placeholder="Eg. UjumbePap" accept=".pdf" />
                                      <div className="alert d-none alert-danger mt-2" id='ApplicationLetterError' role="alert">
                                        <strong> Error!</strong> Please Upload a Document
                                      </div>
                                    </div>
                                    <div className='col-md-12 mt-4'>
                                      <label className='text-black'><b>Cost</b>: 12,000 Kshs</label>
                                    </div>
                                    <div class="row mt-4">
                                      <div class="col-md-12">
                                        <button type="submit" class="btn w-100 btn-primary">
                                          <span>Submit</span></button>
                                      </div>
                                    </div>
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
              </div>
            </div>
            {/* Apply Sender ID Modal  */}
          </div>
        }
      </div>
    </div>
  );
};

SenderIds.propTypes = {};

SenderIds.defaultProps = {};

export default SenderIds;
