import React, { useState, forwardRef, useRef, useImperativeHandle, useEffect } from "react";
import { Stepper, Step } from "react-form-stepper";
import { MdDescription, MdGroup } from "react-icons/md";
import StepWizard from "react-step-wizard";
import { Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import SweetAlert from 'react-bootstrap-sweetalert';
import { Variables } from '../../_utils/GlobalVariables';
import { FirstRender } from '../../_utils/FirstRender';
import axios from 'axios';
import useForceUpdate from 'use-force-update';

const ActionButtons = (props) => {
  const handleBack = () => {
    props.previousStep();
  };

  const handleNext = () => {
    props.nextStep();
  };

  const handleFinish = () => {
    props.lastStep();
  };

  return (
    <div>
      <Row>
        {props.currentStep > 1 && (
          <Col>
            <button onClick={handleBack} type="button" class="btn btn-primary">Back</button>
            {/* <Button onClick={handleBack}>Back</Button> */}
          </Col>
        )}
        <Col>
          {props.currentStep < props.totalSteps && (
            <button onClick={handleNext} type="button" class="btn btn-primary">Next</button>
            // <Button className="btn-primary" onClick={handleNext}>Next</Button>
          )}
          {props.currentStep === props.totalSteps && (
            // <Button onClick={handleFinish}>Finish</Button>
            <button onClick={handleFinish} type="button" class="btn btn-primary">{props.uploading ? <span>Uploading Contacts...</span> : <span>Upload Contacts</span>}</button>
          )}
        </Col>
      </Row>
    </div>
  );
};

const One = forwardRef((props, ref) => {
  const [info1, setInfo1] = useState({});
  const [CsvFile, setCsvFile] = useState();
  const [error, setError] = useState("");

  const onInputChanged = (event) => {
    const targetName = event.target.name;
    const targetValue = event.target.value;

    setInfo1((info1) => ({
      ...info1,
      [targetName]: targetValue
    }));
  };

  //allow parent to access this function
  useImperativeHandle(ref, () => ({
    getCsv() {
      return CsvFile;
    },
    validate() {
      if (!CsvFile) {
        showError();
        return false;
      } else {
        hideError();
        return true;
        // props.nextStep();
      }
    }
  }))

  const showError = () => {
    let elm = document.getElementById("noUploadError");
    elm.classList.remove("d-none")
  }

  const hideError = () => {
    let elm = document.getElementById("noUploadError");
    elm.classList.add("d-none")
  }

  const displayNone = { display: "none" };

  const uploadbtnClick = (e) => {
    let btn = document.getElementById("uploadcontactsbtn");
    btn.click();
  };

  const handleCsvChange = (e) => {
    setCsvFile(e.target.files[0]);
    hideError();
  }

  return (
    <div>
      <h3 className="mb-4">Upload your contacts.</h3>
      <div className="justify-center">
        <div className="col-md-8 col-sm-12 mb-1">
          {/* <a type="button" onClick={uploadbtnClick} class="btn btn-rounded btn-success ">
          <span class="btn-icon-left text-success"><i class="fa fa-upload color-success"></i>
          </span>
          Upload
        </a> */}
          <form id="csv-upload-form">
            <div class="input-group">
              <div class="custom-file">
                <input id="csv-upload-input" onChange={handleCsvChange}
                  type="file" accept=".csv, text/csv" class="custom-file-input" />
                <label class="custom-file-label text-left selected">Choose file</label>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* <br /> */}
      {/* <span style={{ fontSize: "11px", color: "#db9702" }} className="text-grey">CSV files only!</span> */}
      {/* <br /> */}
      <div className="d-none alert alert-danger" id="noUploadError"><span className="mb-3 text-red " ><strong>Error! </strong> Please Upload a file to continue</span></div>
      <a href="contact.csv">
        <button type="button" class="mt-2 text-blacker btn btn-xxs btn-outline-dark">
          <span class=" text-info mr-2">
            <i class="fa fa-download color-info"></i>
          </span>   Download Sample File
        </button>
      </a>
      <br /> <br /><br />
      {/* <span style={{ color: "red" }}>{error}</span> */}
      {/* <ActionButtons {...props} nextStep={validate} /> */}
    </div>
  );
});

const Two = forwardRef((props, ref) => {
  const [info2, setInfo2] = useState({});
  const [error, setError] = useState("");
  const [group, setGroup] = useState("");
  const [showingError, setShowingError] = useState(false);
  const [contactgroups, setContactgroups] = React.useState([]);
  const forceUpdate = useForceUpdate();
  // const [activeTab, setActiveTab] = useState("");

  let gotten = JSON.parse(localStorage.getItem("smstequser"));
  let token = gotten.data.access;
  let userid = gotten.data.id;
  const theFirstRender = FirstRender();

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': "Bearer " + token
  }

  useImperativeHandle(ref, () => ({
    getGroup() {
      return group;
    }
  }));

  useEffect(() => {
    //get all groups
    axios.get(Variables.apiURL + 'api/v1/api/v1/groups/', { headers: headers })
      .then(response => {
        // console.log(response);
        if (response.status == 200) {
          if (response.data.length < 1) { //if no groups, show error
            let elm = document.getElementById("noUploadGroupError");
            elm.classList.remove("d-none")
            let elm2 = document.getElementById("all-upload-contacts-group-div");
            elm2.classList.add("d-none")
          } else {
            setContactgroups(response.data);
          }
        }
      })
  }, []);

  //triggered when group name changes on submit
  useEffect(() => {
    //call parent method
    if (!theFirstRender) {
      props.handleComplete()
    }
  }, [group]);

  const onInputChanged = (event) => {
    const targetName = event.target.name;
    const targetValue = event.target.value;

    setInfo2((info2) => ({
      ...info2,
      [targetName]: targetValue
    }));
  };

  const activeTab = () => {
    let elm = document.getElementById("uploadcontacts-newgroup");
    if (elm.classList.contains("active")) {
      return ("uploadcontacts-newgroup");
    } else {
      return ("uploadcontacts-groupchooser");
    }
  }

  const showError = () => {
    let elm = document.getElementById("noGroupError");
    elm.classList.remove("d-none")
    // console.log(elm);
    forceUpdate()
  }

  const hideError = () => {
    let elm = document.getElementById("noGroupError");
    elm.classList.add("d-none")
    forceUpdate()
  }

  const validate2 = () => {
    // console.log("validating");
    let groupname = '';
    //if the active tab is the new group
    if (activeTab() == "uploadcontacts-newgroup") {
      let elm = document.getElementById("newgroup-input");
      groupname = elm.value;
      if (groupname == "") { //if name is blank
        setError("Please Input a Name")
        showError()
        setShowingError(true);
        return;
      } else {
        if (nameInGroup(groupname)) { //if typed name is in existing group names
          setError("There is already a group with that name");
          setShowingError(true)
          return;
        } else {
          // console.log("new group");
          setShowingError(false)
          hideError()
          setGroup(groupname);
          // props.handleComplete()
        }
      }
    } else { //if the active tab is the existing group
      let elm = document.getElementById("existinggroup-select");
      groupname = elm.value;
      if (groupname == "") {
        setError("Please Select a Group From The Options Above");
        showError()
        setShowingError(true);
        return;
      } else {
        // console.log("existing group");
        hideError()
        setGroup(groupname);
        setShowingError(false)
        // props.handleComplete()
      }
    }
  };

  const changeTab = () => {
    setShowingError(false);
  }

  //group selector on change
  const groupSelected = () => {
    // console.log("asda")
    let groupname = '';
    let elm = document.getElementById("existinggroup-select");
    groupname = elm.value;
    if (groupname != "") {
      setShowingError(false)
    } else {
      setError("Please Select a Group From The Options Above");
      setShowingError(true)
    }
  }

  //new group name on change
  const groupNameChanged = () => {
    let groupname = '';
    let elm = document.getElementById("newgroup-input");
    groupname = elm.value;
    if (groupname != "") {
      //if name already exists in owner groups
      if (nameInGroup(groupname)) {
        setError("There is already a group with that name");
        setShowingError(true)
        // console.log("exists");
      } else {
        setShowingError(false)
      }
    } else {
      setError("Please Input a Name")
      setShowingError(true)
    }
  }

  const nameInGroup = (groupname) => {
    let status = false;
    for (let i = 0; i < contactgroups.length; i++) {
      if (contactgroups[i].group_name.toLowerCase() == groupname.toLowerCase()) {
        status = true;
        break;
      }
    }
    return status;
  }

  const dropdownstyle = { maxHeight: "206px", overflow: "hidden", minHeight: "0px", position: "absolute", willChange: "transform", top: "0px", left: "0px", transform: "translate3d(0px, 44px, 0px)" }
  const dropdowninnerstyle = { maxHeight: "190px", overflowY: "auto", minHeight: "0px" }
  return (
    <div><div class="card">
      {/* <div class="card-header">
        </div> */}
      <h3 className="mt-3 ">Where should we save the contacts?</h3>
      <div class="card-body">
        {/* <p class="">Groups organise your contacts into one list for easier management</p> */}
        <div class="default-tab">
          <ul class="nav justify-center nav-tabs" role="tablist">
            <li class="nav-item" onClick={changeTab}>
              <a class="nav-link active" data-toggle="tab" href="#uploadcontacts-groupchooser"><i class="la la-user mr-2"></i>Existing Group</a>
            </li>
            <li class="nav-item" onClick={changeTab}>
              <a class="nav-link " data-toggle="tab" href="#uploadcontacts-newgroup"><i class="la la-plus mr-2"></i> New Group</a>
            </li>
          </ul>
          <div class="tab-content">
            <div class="tab-pane fade " id="uploadcontacts-newgroup" role="tabpanel">
              <div class="pt-4">
                <div class="">
                  <h4 className="text-left mb-2">Name:</h4>
                  <div class="basic-form">
                    <form>
                      <div class="form-group">
                        <input type="text" onChange={groupNameChanged} id="newgroup-input" class="form-control input-default border-secondary" placeholder="...." />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-pane fade show active" id="uploadcontacts-groupchooser">
              <div class="pt-4">
                <span class="d-none" id="noUploadGroupError">
                  You have not created any Groups. <br /> Please create one.
                </span>
                <div id="all-upload-contacts-group-div">
                  <p className="text-left mb-4">Select a group from the options below.</p>
                  <div class="form-group">
                    <div class="">
                      <select onChange={groupSelected} id="existinggroup-select" class="text-black form-control" tabIndex="-98">
                        <option selected value="">-- Select a Group --</option>
                        {contactgroups.map((contact, index) =>
                          <option value={contact.group_name}>{contact.group_name}</option>
                        )}
                        {/* <option>Group 1</option>
                          <option>Group 2</option>
                          <option>Group 3</option> */}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {showingError ?
              <div className="alert alert-danger" role="alert">
                <span className="mb-3 text-red " ><strong>Error! </strong> {error}</span>
              </div> : <span></span>}
            {/* <div id="noGroupError" className=" d-none" >
              <span className="mb-3 text-red " ><strong>Error! </strong> {error}</span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
      {/* <span style={{ color: "red" }}>{error}</span> */}
      {/* <br /> */}
      <div className="alert d-none alert-danger" id='CsvNotUploaded' role="alert">
        <strong>Error! </strong>Something went wrong. Please try again
      </div>
      <div id='CsvUploaded' className="alert alert-success d-none" role="alert">
        <strong>Success! </strong>Your Contacts were Uploaded
      </div>
      <ActionButtons {...props} lastStep={validate2} />
    </div>
  );
});

const UploadContactsWizard = () => {
  const [stepWizard, setStepWizard] = useState(null);
  const [user, setUser] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [payload, setPayload] = useState();
  const [uploading, setUploading] = useState(false);
  const childCompRef = useRef()
  const childGroupRef = useRef()
  const forceUpdate = useForceUpdate()
  const theFirstRender = FirstRender();

  //when payload changes
  useEffect(() => {
    if (!theFirstRender) {
      // console.log("payload change");
      submitPayload();
    }
  }, [payload]);

  const assignStepWizard = (instance) => {
    setStepWizard(instance);
  };

  const handleStepChange = (e) => {
    // console.log("step change");
    if (e.activeStep == 3) {
      // console.log(formData);
    }
    setActiveStep(e.activeStep - 1);
  };

  const setNewPayload = () => {
    let formData = new FormData();
    let file = childCompRef.current.getCsv()
    let groupname = childGroupRef.current.getGroup();
    formData.append('group', groupname);
    formData.append('file', file);
    formData.append('fileName', file.name);
    setPayload(formData);
  }

  const handleComplete = () => {
    // console.log("groupname");
    let uploadvalidate = childCompRef.current.validate();
    if (uploadvalidate == false) { //if no upload
      return;
    }
    setNewPayload();
  };

  const submitPayload = () => {
    let gotten = JSON.parse(localStorage.getItem("smstequser"));
    let token = gotten.data.access;
    console.log(gotten)
    // for (let [key, value] of payload) {
    //   console.log(`${key}: ${value}`)
    // }

    setUploading(true);
    forceUpdate()
    axios.post(Variables.apiURL + 'api/v1/upload_contact/', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': "Bearer " + token
      }
    })
      .then(response => {
        setUploading(false);
        forceUpdate()
        //change loading status
        // setSendingMessages(false);
        // console.log("response");
        // console.log(response);
        // summaryCompRef.current.setSendMessageBtnLoading(false);

        // $('#EmailExistsError').hide();

        // setLoading(false);
        // console.log(loading);

        // if (response.status == 201) {
        let elm2 = document.getElementById("CsvNotUploaded");
        elm2.classList.add("d-none")
        let elm = document.getElementById("CsvUploaded");
        elm.classList.remove("d-none")

        setTimeout(function () {
          // navigate('/home');
          window.location.href = "/contacts";
        }, 1500);
      })
      .catch(error => {
        setUploading(false);
        forceUpdate()
        let elm = document.getElementById("CsvNotUploaded");
        elm.classList.remove("d-none")
        // setSendingMessages(false);
        // summaryCompRef.current.setSendMessageBtnLoading(false);
        // console.log('error');
        // console.log(error);
        // $('#EmailAbsentError').show();
        // setLoading(false);
      })
  }

  return (
    <div>
      {/* <Stepper activeStep={activeStep}>
        <Step label="" />
        <Step label="" />
        <Step label="" />
      </Stepper> */}
      {/* NOTE: IMPORTANT !! StepWizard must contains at least 2 children components, else got error */}
      {/* <StepWizard instance={assignStepWizard} onStepChange={handleStepChange}> */}
      <One ref={childCompRef} />
      <Two handleComplete={handleComplete} uploading={uploading} ref={childGroupRef} />
      {/* </StepWizard> */}
    </div>
  );
};

export default UploadContactsWizard;
