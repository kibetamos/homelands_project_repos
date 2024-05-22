import React, { useState, forwardRef, useRef, useImperativeHandle, useEffect } from "react";
import { Stepper, Step } from "react-form-stepper";
import { MdDescription } from "react-icons/md";
import StepWizard from "react-step-wizard";
import { Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import SweetAlert from 'react-bootstrap-sweetalert';
// import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import useForceUpdate from 'use-force-update';
import axios from 'axios';
import { Variables } from '../../_utils/GlobalVariables';
import { MDBDataTableV5 } from 'mdbreact';
import { useTable } from 'react-table'
import Table from "./contactsTable";
import { WithContext as ReactTagInput } from "react-tag-input";
import Collapsible from 'react-collapsible';
import 'animate.css';
import GroupSelectModal from "./MessageSteps/GroupSelectModal";
// import useStateWithCallback from 'use-state-with-callback';

const ActionButtons = forwardRef((props, ref) => {
  const [smssending, setSmssending] = useState(false);
  // const [scheduleMessage, setScheduleMessage] = useState(false);

  const handleBack = () => {
    props.previousStep();
  };

  const handleNext = () => {
    // console.log(props.currentStep);
    if (props.currentStep == 1) {

    }
    props.nextStep();
  };

  const handleFinish = () => {
    props.lastStep();
  };

  useImperativeHandle(ref, () => ({
    changeSMSLoadingStatus(boolvalue) {
      setSmssending(boolvalue);
    }
  }))

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
            <button onClick={handleNext} type="button" class="btn btn-primary pull-right">Next</button>
            // <Button className="btn-primary" onClick={handleNext}>Next</Button>
          )}
          {props.currentStep === props.totalSteps && (
            // <Button onClick={handleFinish}>Finish</Button>
            <div id="finalstepsbtns" className="">
              {props.scheduleMessage ?
                <button onClick={handleFinish} type="button" class="btn pull-right btn-primary">{smssending ? <span>Sending...</span> : <span>Send Message</span>} </button>
                :
                <button onClick={handleFinish} type="button" class="btn btn-primary-blue pull-right">{smssending ? <span>Sending...</span> : <span>Schedule</span>} </button>
              }
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
});

const One = forwardRef((props, ref) => {

  const [tablerows, setTablerows] = React.useState([

    {

      full_name: 'Hello',

      phone_number: 'World',

    },

    {

      full_name: 'react-table',

      phone_number: 'rocks',

    },

    {

      full_name: 'whatever',

      phone_number: 'you want',

    },

  ])
  const [tablecolumns, setTablecolumns] = React.useState([

    {

      Header: 'Full Name',

      accessor: 'full_name', // accessor is the "key" in the data

    },

    {

      Header: 'Phone Number',

      accessor: 'phone_number',

    },

  ])

  const [checkbox1, setCheckbox1] = React.useState([]);
  const [contacts, setContacts] = React.useState([]); //used by all contacts modal
  const [singlecontacts, setSinglecontacts] = React.useState([]); //contains single contacts from the tag editor
  const [finalcontacts, setFinalContacts] = React.useState([]);
  // const [tableContacts, setTableContacts] = React.useState([]);
  const [contactgroups, setContactgroups] = React.useState([]);
  const [contactArray, setContactArray] = React.useState({});

  const forceUpdate = useForceUpdate();
  const [tags, setTags] = useState([
  ])
  const [error, setError] = useState("");
  const [selectedContacts, setSelectedContacts] = useState("");
  let [groups, setGroups] = React.useState([]);

  let trial = [
    {
      full_name: 'Tiger Nixon',
      phone_number: '0702085724',
    },
    {
      full_name: 'Mister Nixon',
      phone_number: '0792085724',
    },
    {
      full_name: 'Mister Nixon',
      phone_number: '0792085724',
    }
  ]

  const [datatable, setDatatable] = React.useState({
    columns: [
      {
        label: 'Full Name',
        field: 'full_name',
      },
      {
        label: 'Phone Number',
        field: 'phone_number',
      }
    ],
    rows: trial

  });

  const [allOwnerContacts, setAllOwnerContacts] = useState([]);
  const [allOwnerContactsSuggestions, setAllOwnerContactsSuggestions] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [finalcontactsloading, setFinalcontactsloading] = useState(false);

  let gotten = JSON.parse(localStorage.getItem("smstequser"));
  if (!gotten) {
    let gotten = '';
  }
  let token = gotten.data.access;
  let userid = gotten.data.id;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': "Bearer " + token
  }
  //on component mount
  useEffect(() => {
    var myElementToCheckIfClicksAreInsideOf = document.querySelector('#addGroupModalInner');

    // Listen for click events on add Group Modal
    document.getElementById("addGroupModal").addEventListener('click', function (event) {
      if (myElementToCheckIfClicksAreInsideOf.contains(event.target)) {
        // console.log('clicked inside');
      } else {
        let closeBtn = document.getElementById("sendMessageWizardCloseBtn");
        if (closeBtn.classList.contains("hide")) {
          closeBtn.classList.remove("hide");
        }
        // console.log('clicked outside');
      }
    });

    // console.log("useeffect")
    //get all groups
    axios.get(Variables.apiURL + 'api/v1/api/v1/groups/', { headers: headers })
      .then(response => {
        // console.log(response);
        if (response.data.length < 1) {
          let elm = document.getElementById("noGroupError");
          elm.classList.remove("d-none")
          let elm2 = document.getElementById("all-contacts-group-div");
          elm2.classList.add("d-none")
        } else {
          let elm = document.getElementById("noGroupError");
          elm.classList.add("d-none")
          let elm2 = document.getElementById("all-contacts-group-div");
          elm2.classList.remove("d-none")

        }

        setContactgroups(response.data);
        // console.log(response.data)
      })


    //get all contacts from owner
    axios.get(Variables.apiURL + 'api/v1/contacts/?owner=' + userid, { headers: headers })
      .then(response => {
        let contactsstring = response.data;
        setAllOwnerContacts(response.data);
        // console.log(response.data)
        // formatSuggestions(response.data);
        setTableData(response.data)
      })

  }, []);

  const formatSuggestions = (data) => {
    let temp = data;
    for (let i = 0; i < temp.length; i++) {
      let strid = "" + temp[i].id + "";
      temp[i].id = strid;
      temp[i]['text'] = temp[i].full_name + " | " + temp[i].phone_number;
    }
    setAllOwnerContactsSuggestions(temp);
  }

  //on single contact change
  useEffect(() => {
    updateContacts()
  }, [singlecontacts]);

  //on groups update
  useEffect(() => {
    updateContacts()
  }, [contactArray]);

  const validate = () => {
    if (finalcontacts.length == 0) {
      // alert('invalid data')
      let elm = document.getElementById("noRecipientError");
      elm.classList.remove("d-none")
    }
    else {
      // console.log(tags);
      let elm = document.getElementById("noRecipientError");
      elm.classList.add("d-none")
      props.nextStep();
    }
  };

  //allow parent to access this function
  useImperativeHandle(ref, () => ({
    getRecipients() {
      return finalcontacts;
    }
  }))

  const displayNone = { display: "none" };

  const uploadbtnClick = (e) => {
    let btn = document.getElementById("uploadcontactsbtn");
    btn.click();
  };

  const showGroupChooser = () => {
    // hide close btn 
    let closeBtn = document.getElementById("sendMessageWizardCloseBtn");
    closeBtn.classList.add("hide");

    //toggle Group Modal
    let chooser = document.getElementById("showGroupModalBtn");
    chooser.click();
  }

  const closeContactGroup = () => {
    //toggle Individual Contact Modal
    let chooser = document.getElementById("showGroupModalBtn");
    chooser.click();

    let closeBtn = document.getElementById("sendMessageWizardCloseBtn");
    closeBtn.classList.remove("hide");
  }

  const showIndividualContactChooser = () => {
    //toggle Individual Contact Modal
    let chooser = document.getElementById("chooseIndividualContactModalBtn");
    chooser.click();
  }

  const closeIndividualContactChooser = () => {
    //toggle Individual Contact Modal
    let chooser = document.getElementById("chooseIndividualContactModalBtn");
    chooser.click();
  }

  //check if name exists in group name array
  const existsInGroup = (name) => {
    let varr = false;
    for (let p = 0; p < groups.length; p++) {
      if (groups[p] == name) {
        varr = true;
        break;
      } else {
        varr = false;
      }
    }
    // console.log(varr);
    return varr;
  }

  // Triggered on Add Groups submit button is clicked on the popup
  const addGroups = (event) => {
    event.preventDefault();
    let temparray = contactArray;
    let tempgroups = groups;
    let temptags = tags;

    let closeBtn = document.getElementById("sendMessageWizardCloseBtn");
    if (closeBtn.classList.contains("hide")) {
      closeBtn.classList.remove("hide");
    }

    // console.log(tempgroups);
    let groupname;
    setFinalcontactsloading(true);
    forceUpdate();
    // console.log(finalcontactsloading);

    //loop through the groups form 
    for (let i = 0; i < event.target.length; i++) {
      if (event.target[i].checked == true) {
        hideError()

        //if group id exists in groups array
        // if (groups.includes(event.target[i].id)) {
        if (existsInGroup(event.target[i].id)) {
          // console.log("exists")
        } else {
          // console.log("doesnt exists")
          tempgroups.push(event.target[i].id);

          groupname = event.target[i].value;
          // console.log(event.target[i].id);
          // console.log(groups);

          // if all contacts is selected
          if (event.target[i].value == "All Contacts") {
            temparray[event.target[i].id] = allOwnerContacts;
          } else {
            //get individual contacts from group
            axios.get(Variables.apiURL + 'api/v1/contacts/?group=' + event.target[i].id, { headers: headers })
              .then(response => {
                temparray[event.target[i].id] = response.data;
                updateContacts()
              })
          }

          let newtag = { "id": "group_" + event.target[i].id, "text": groupname };
          temptags.push(newtag);
          //Add tag to current tags
        }
      }
    };
    setFinalcontactsloading(false);
    // console.log(finalcontactsloading);
    // Update the contacts array and groups var
    setTags(temptags);
    setGroups(tempgroups);
    setContactArray(temparray);
    setSinglecontacts(singlecontacts);
    //force update of dom to allow for groups tags to be seen
    forceUpdate();
    let chooser = document.getElementById("showGroupModalBtn");
    chooser.click();
    updateContacts()
  }

  //tags delete
  const handleDelete = (i) => {
    let temparrr;
    if (temparrr = tags[i].id.split("_")) {
      //if the tag being deleted belongs to a groups
      if (temparrr[0] == "group") {
        let tempgroups = groups;
        // if ()
        tempgroups.splice(tempgroups.indexOf(temparrr[1]), 1);
        setGroups(tempgroups);

        //update groups array
        let tempcontactsarr = contactArray;
        delete tempcontactsarr[temparrr[1]];
        setContactArray(tempcontactsarr);
      } else {
        let tempsinglecontacts = singlecontacts;
        tempsinglecontacts.splice(tempsinglecontacts.indexOf(temparrr[0], 1));
      }
    }
    setTags(tags.filter((tag, index) => index !== i));
    updateContacts()
  };

  //called when a new contact is typed into tag editor
  const handleAddition = (tag) => {
    addContactToArrays(tag);
  };

  const handleInputFocusOut = (tag) => {
    let tagobj = {
      'id': tag,
      'text': tag
    }
    addContactToArrays(tagobj);
  }

  const addContactToArrays = (tag) => {
    let txt = tag.text;
    let newtxt = {};

    //if input is not text and is 10 characters long
    if ((!isNaN(tag.text) && tag.text.length == 10)) {
      let result = tag.text.indexOf("0");
      if (result == 0) {
        newtxt["text"] = "254" + txt.substring(1, 10);
        newtxt["id"] = tag.id;
      } else {
        newtxt["text"] = txt;
        newtxt["id"] = tag.id;
      }

      //set into singlecontacts array
      setSinglecontacts([...singlecontacts, newtxt]);

      //update value of finalcontacts
      setTags([...tags, newtxt]);
    } else if (!isNaN(tag.text) && tag.text.length == 12) {
      newtxt = tag;

      //set into singlecontacts array
      setSinglecontacts([...singlecontacts, newtxt]);

      //update value of finalcontacts
      setTags([...tags, newtxt]);
    }
  }

  //called when contact is added to tag or the groups change
  const updateContacts = () => {
    // console.log("called")
    let finalcontactstemp = [];
    // console.log("update contacts");
    for (let i = 0; i < singlecontacts.length; i++) {
      // console.log(singlecontacts[i]);
      // if (!finalcontacts.includes(singlecontacts)) {
      finalcontactstemp.push(singlecontacts[i].text)
      // }
    }

    Object.entries(contactArray).forEach(
      ([key, value]) => {
        for (let u = 0; u < value.length; u++) {
          // console.log("" + value[u].phone_number)
          // if (!finalcontacts.includes("" + value[u].phone_number)) {
          finalcontactstemp.push("" + value[u].phone_number)
          // }
        }
      }
    );
    // console.log("called")
    setFinalContacts(finalcontactstemp);
    hideError();
    forceUpdate();
    // console.log("finalcontacts from tag input")
    // console.log(finalcontacts)
  }

  const hideError = () => {
    let elm = document.getElementById("noRecipientError");
    elm.classList.add("d-none")
  }

  const setAllContacts = (e) => { //when all checkbox is clicked
    for (let i = 0; i < e.length; i++) {
      //if checkbox is checked
      if (e[i].checked == true) {
        // Find if the array contains the object by comparing the property value
        // if (!contacts.some(contact => contact.full_name === e[i].full_name)) {
        contacts.push(e[i]);
        // }
      } else {
        contacts.pop(e[i])
      }
    }
    forceUpdate();
  }

  const setSingleContact = (e) => { //if single checkbox is checked
    if (e.checked == true) {
      // Find if the array doesnt contains the object by comparing the property value
      // if (!contacts.some(contact => contact.full_name === e.full_name)) {
      contacts.push(e);
      // }
    } else {
      contacts.pop(e)
    }
    // console.log(contacts);
    forceUpdate();
  };

  const addContacts = (e) => {
    // console.log(contacts)
    let contacttags = tags;
    for (let i = 0; i < contacts.length; i++) {
      if (!tags.includes(contacts[i].phone_number)) {
        contacttags.push(contacts[i].phone_number);
      }
    }
    setTags(contacttags);
    hideError();
    forceUpdate();
    closeIndividualContactChooser();
  }

  const columns = React.useMemo(
    () => [
      {
        Header: 'Full Name',
        accessor: 'full_name',
      },
      {
        Header: 'Phone Number',
        accessor: 'phone_number',
      },
    ],
  )

  const data = [
    {
      "full_name": "Kevin Samuels",
      "phone_number": "0702085724",
    },
    {
      "full_name": "Masai Mkubwa",
      "phone_number": "0702085725",
    },
    {
      "full_name": "Nianm Mkubwa",
      "phone_number": "0732085725",
    },
    {
      "full_name": "Gres Mkubwa",
      "phone_number": "0732285725",
    },
    {
      "full_name": "SJQ Main",
      "phone_number": "0732685725",
    },
    {
      "full_name": "Kenya Mwass",
      "phone_number": "0792085725",
    },
    {
      "full_name": "Bright Nresn",
      "phone_number": "0732585725",
    },
    {
      "full_name": "Kenya Mwass",
      "phone_number": "0792085725",
    },
    {
      "full_name": "Bright Nresn",
      "phone_number": "0732585725",
    },
    {
      "full_name": "Kenya Mwass",
      "phone_number": "0792085725",
    },
    {
      "full_name": "Bright Nresn",
      "phone_number": "0732585725",
    },
    {
      "full_name": "Kenya Mwass",
      "phone_number": "0792085725",
    },
    {
      "full_name": "Bright Nresn",
      "phone_number": "0732585725",
    },
    {
      "full_name": "Kenya Mwass",
      "phone_number": "0792085725",
    },
    {
      "full_name": "Bright Nresn",
      "phone_number": "0732585725",
    },
    {
      "full_name": "Kenya Mwass",
      "phone_number": "0792085725",
    },
    {
      "full_name": "Bright Nresn",
      "phone_number": "0732585725",
    },
    {
      "full_name": "Kenya Mwass",
      "phone_number": "0792085725",
    },
    {
      "full_name": "Bright Nresn",
      "phone_number": "0732585725",
    },
    {
      "full_name": "Kenya Mwass",
      "phone_number": "0792085725",
    },
    {
      "full_name": "Bright Nresn",
      "phone_number": "0732585725",
    },
    {
      "full_name": "Kenya Mwass",
      "phone_number": "0792085725",
    },
    {
      "full_name": "Bright Nresn",
      "phone_number": "0732585725",
    },
  ]

  const Keys = {
    TAB: 9,
    SPACE: 32,
    COMMA: 188,
    enter: 13
  };

  return (
    <div>
      <div>
        <h4 className="mt-3">Add Contacts Below</h4>

        {/* Tags Chooser */}
        <div className="tags-max-height">
          {/* onChange={(newTags) => setNewTags(newTags)} */}
          {/* <ReactTagInput className="tags-max-height" delimiters={[Keys.TAB, Keys.SPACE, Keys.COMMA]}
          tags={tags} handleAddition={handleAddition}
          allowAdditionFromPaste={true} allowUnique={false} handleDelete={handleDelete} suggestions={allOwnerContactsSuggestions} placeholder="Type a Phone Number or Name and Press Enter" inputFieldPosition="bottom"
        /> */}
          <ReactTagInput className="tags-max-height" delimiters={[Keys.TAB, Keys.SPACE, Keys.COMMA, Keys.enter]}
            tags={tags} handleAddition={handleAddition} handleInputBlur={handleInputFocusOut}
            allowAdditionFromPaste={true} allowUnique={false} allowDragDrop={false} handleDelete={handleDelete} placeholder="Type a Phone Number or Name and Press Enter" inputFieldPosition="bottom"
          />
        </div>
        {/* Tags Chooser End */}
        <div className="mb-2"></div>
        <button onClick={showGroupChooser} type="button" class="btn btn-xxs btn-rounded btn-dark">
          <span class=" text-info mr-2">
            <i class="fa fa-plus color-info"></i>
          </span>   add group
        </button>

        {/* <button onClick={showIndividualContactChooser} type="button" class="ml-2 btn btn-xxs btn-rounded btn-dark">
        <span class=" text-info mr-2">
          <i class="fa fa-search color-info"></i>
        </span>   Search your contacts
      </button> */}

        <span style={{ color: "red" }}>{error}</span><br />
        <div className="mb-4"></div>

        <div className="alert alert-danger d-none" id="noRecipientError" role="alert">
          <span className="text-red"><strong>Error! </strong> Please add at least one recipient</span>
        </div>

        {finalcontactsloading ?
          <p> <span><div class="lds-ring"><div></div><div></div><div></div><div></div></div>
          </span></p>
          :
          <p>
            <span id="recipientsLength" class="text-red">{finalcontacts.length}
            </span> Contacts
          </p>
        }

        {finalcontactsloading ?
          <div></div>
          :
          <ActionButtons {...props} nextStep={validate} />
        }

        {/* Choose individual Contacts Modal */}
        <div class="modal fade higherzindex background-opaque" id="chooseIndividualContactModal">
          <div class="modal-dialog wider-contact-chooser" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">All Contacts</h5>
                <button type="button" class="close" onClick={closeIndividualContactChooser}><span>&times;</span>
                </button>
              </div>
              <div class="modal-body">
                {/* <table /> */}
                {/* <MDBDataTableV5
                hover
                entriesOptions={[10, 20, 30]}
                entries={10}
                pagesAmount={4}
                data={datatable}
                checkbox
                headCheckboxID='id6'
                bodyCheckboxID='checkboxes6'
                getValueCheckBox={(e) => {
                  setSingleContact(e);
                }}
                getValueAllCheckBoxes={(e) => {
                  setAllContacts(e);
                }} maxHeight='34vh'
                searchTop searchBottom={false}
                multipleCheckboxes
                pagingTop scrollX scrollY
              /> */}
                {/* 
              <Table data={tableData}
                col_labels={['phone_number', 'full_name']} /> */}

                <Table columns={columns} data={data} />

                <button type="submit" class="btn btn-primary" onClick={addContacts}>Add {contacts.length} Contacts</button>
              </div>
            </div>
          </div>
        </div>
        {/* Choose individual Contacts Group Modal End*/}
      </div>

      {/* Choose Contact Group Modal */}
      <GroupSelectModal contactgroups={contactgroups} addGroups={addGroups} closeContactGroup={closeContactGroup} />
      {/* Choose Contact Group Modal End*/}
    </div>
  );
});

// step two
const Two = forwardRef((props, ref) => {
  const [charactersTotal, setcharactersTotal] = useState(0);
  const [smsTotal, setSmsTotal] = useState(0);
  const [error, setError] = useState("");
  const [drafts, setDrafts] = useState([]);

  useEffect(() => {
    let gotten = JSON.parse(localStorage.getItem("smstequser"));
    let token = gotten.data.access;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + token
    }
    axios.get(Variables.apiURL + 'api/v1/templates/', { headers: headers })
      .then(res => {
        const draftstemp = res.data;
        setDrafts(draftstemp);
        // console.log("drafts");
        // console.log(draftstemp);
        // this.forceUpdate();
      })
  }, []);

  const onInputChanged = (event) => {
    if (event.target.textLength > 0) {
      let err = document.getElementById("noMessageError");
      err.classList.add("d-none");
    }
    //set Length of the SMS Value
    setcharactersTotal(event.target.textLength);
    if (event.target.textLength % 160 != 0) {
      setSmsTotal(Math.floor(event.target.textLength / 160) + 1)
    } else {
      setSmsTotal(Math.floor(event.target.textLength / 160))
    }
  };

  const validate2 = () => {
    let textarea = document.getElementById("sendMessageBody");
    let err = document.getElementById("noMessageError");
    if (textarea.value == "") {
      err.classList.remove("d-none");
    } else {
      // setError("");
      err.classList.add("d-none");
      props.nextStep();
    }
  };

  const dropdownstyle = { maxHeight: "206px", overflow: "hidden", minHeight: "0px", position: "absolute", willChange: "transform", top: "0px", left: "0px", transform: "translate3d(0px, 44px, 0px)" }
  const dropdowninnerstyle = { maxHeight: "190px", overflowY: "auto", minHeight: "0px" }

  const closeDraftChooser = () => {

  }

  //on individual draft click
  const setCurrentDraft = (i) => {
    let rawid = i.target.id;
    let splitid = rawid.split('_');
    let currentid = splitid[1];
    let textarea = document.getElementById("sendMessageBody");
    textarea.value = drafts[currentid].message;
    showDraftChooser();

    //set Length of the SMS Value
    setcharactersTotal(drafts[currentid].message.length);
    if (drafts[currentid].message.length % 160 != 0) {
      setSmsTotal(Math.floor(drafts[currentid].message.length / 160) + 1)
    } else {
      setSmsTotal(Math.floor(drafts[currentid].message.length / 160))
    }
  }

  const addDraft = () => {

  }

  useImperativeHandle(ref, () => ({
    getLength() {
      return smsTotal;
    }
  }))

  const showDraftChooser = () => {
    let chooser = document.getElementById("showDraftsModalBtn");
    chooser.click();
  }

  return (
    <div>
      <h3 className="mt-3 mb-4">Type or paste your Message Below</h3>
      <div class="card">
        <textarea id="sendMessageBody" onChange={onInputChanged} className="form-control dull-border " rows="5">

        </textarea>
        <div class="pl-4 pr-4 pt-2 pb-2">{charactersTotal} characters <span className="pull-right">{smsTotal} SMS</span></div>
      </div>
      <div class="text-center">
        <button type="button" onClick={showDraftChooser} class="btn text-center mt-n3 mb-3 btn-xxs  btn-dark"><span class=" text-info mr-2"><i class="fa fa-plus color-info"></i></span>Add Draft</button>
      </div>


      <span className="text-red mb-3 d-none" id="noMessageError"><strong>Error! </strong> The Message cannot be blank</span>
      <span style={{ color: "red" }}>{error}</span>
      <br />
      <ActionButtons  {...props} nextStep={validate2} />

      {/* Choose Template Modal */}
      <div class="modal fade higherzindex background-opaque" id="addDraftsModal">
        <div class="modal-dialog" id="addDraftModalinner" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Choose Draft</h5>
              <button type="button" id="addDraftModalBtn" class="close" onClick={showDraftChooser} ><span>&times;</span>
              </button>
            </div>

            {drafts.length > 0 ?

              <div class="modal-body">
                {drafts.map((draft, index) =>
                  <Collapsible trigger={draft.title}>
                    <p>
                      {draft.message}
                    </p>
                    <div class="col-md-4">
                      <button id={"draft_" + index} onClick={setCurrentDraft} className="btn btn-sm bg-primary text-white btn-block">
                        Use </button>
                    </div>
                  </Collapsible>
                )}
              </div>
              :
              <div class="p-4">
                You have not created any drafts.
              </div>
            }
          </div>
        </div>
      </div>
      {/* Choose Template Modal End */}
    </div>
  );
});

const Three = (props) => {
  const [info1, setInfo1] = useState({});

  const hideError = (e) => {
    // console.log(e)
    if (e.target[0].selected != true) {
      let elm = document.getElementById("noSenderIDError");
      elm.classList.add("d-none")
    }
  }

  const validate = () => {
    let elm = document.getElementById("chooseSenderId");
    if (elm.value == "") {
      let err = document.getElementById("noSenderIDError");
      // alert('invalid data')
      err.classList.remove("d-none")
    }
    else {
      // console.log(tags);
      let err = document.getElementById("noSenderIDError");
      err.classList.add("d-none")
      props.nextStep();
      // props.userCallback(info1);
    }
  }

  return (
    <div>


      <h3 className="mt-3 mb-4">Choose Sender ID</h3>
      <div class="card">
        <select id="chooseSenderId" onChange={hideError} class="form-control form-control-lg default-select" tabIndex="-98">
          {/* <option selected></option> */}
          <option selected value="smsteq">UjumbePap</option>
        </select>
      </div>
      <span className="text-red d-none" id="noSenderIDError"><strong>Error! </strong> Please Choose a sender ID</span>
      <br />
      <ActionButtons {...props} nextStep={validate} />
    </div>
  )
}

const Four = forwardRef((props, ref) => {
  // console.log("step3 receive user object");
  // console.log(props.user);
  const actionsButtonsRef = useRef()
  const [scheduleMessage, setScheduleMessage] = useState(true);

  const handleLastStep = () => {
    props.lastStep();
    props.completeCallback();
  };

  useImperativeHandle(ref, () => ({
    setSendMessageBtnLoading(boolvalue) {
      actionsButtonsRef.current.changeSMSLoadingStatus(boolvalue)
    }
  }))

  const scheduleToggleChange = () => {
    // let checkbox = document.getElementById("scheduleToggle")
    if (document.getElementById('scheduleToggle').checked) {
      document.getElementById('schedule-selector-wrapper').classList.remove("d-none")
      setScheduleMessage(false);
    } else {
      document.getElementById('schedule-selector-wrapper').classList.add("d-none")
      setScheduleMessage(true);
    }
  }

  return (
    <div>
      <h2 className="text-center">Summary</h2>
      <h4>Sender ID</h4>
      <p> {props.payload.sender_id_name}</p>
      <h4>Recipients</h4>
      <p>{props.payload.phone_numbers_length} Contacts</p>
      <h4>Message</h4>

      <textarea readOnly value={props.payload.message} rows={4} className="form-control dull-border" >
      </textarea>
      <br />

      <div>
        <label class="switch">
          <input onChange={scheduleToggleChange} id="scheduleToggle" type="checkbox" />
          <span class="slider round"></span>
        </label>
        <span class="schedule-txt"> Schedule Message</span>
      </div>

      <div id="schedule-selector-wrapper" className="row d-none mb-4">
        <div className="col-md-6">
          <label className="schedule-txt">Date</label>
          <input class="form-control" type="date" id="schedule-date" />
        </div>
        <div className="col-md-6">
          <label className="schedule-txt">Time</label>
          {/* <input class="form-control" type="time" /> */}
          <select className="form-control" id="schedule-time">
            <option value="">-- Select Time --</option>
            <option value="01:00">01:00 AM</option>
            <option value="02:00">02:00 AM</option>
            <option value="03:00">03:00 AM</option>
            <option value="04:00">04:00 AM</option>
            <option value="05:00">05:00 AM</option>
            <option value="06:00">06:00 AM</option>
            <option value="07:00">07:00 AM</option>
            <option value="08:00">08:00 AM</option>
            <option value="09:00">09:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="12:00">12:00 AM</option>
            <option value="13:00">01:00 PM</option>
            <option value="14:00">02:00 PM</option>
            <option value="15:00">03:00 PM</option>
            <option value="16:00">04:00 PM</option>
            <option value="17:00">05:00 PM</option>
            <option value="18:00">06:00 PM</option>
            <option value="19:00">07:00 PM</option>
            <option value="20:00">08:00 PM</option>
            <option value="21:00">09:00 PM</option>
            <option value="22:00">10:00 PM</option>
            <option value="23:00">11:00 PM</option>
            <option value="00:00">12:00 PM</option>
          </select>
        </div>
      </div>

      <div id='MessagesScheduledSuccess' className="alert alert-success d-none" role="alert">
        <strong>Success! </strong>Your Messages were scheduled successfully.
      </div>
      <div className="alert d-none alert-danger mt-2" id='MessagesScheduledDateError' role="alert">
        The time you selected has already passed.
      </div>
      <div className="alert d-none alert-danger mt-2" id='MessagesScheduleNoDateError' role="alert">
        Kindly select a date above.
      </div>
      <div className="alert d-none alert-danger mt-2" id='MessagesNotEnoughError' role="alert">
        Your sms balance is not enough to send <strong>{props.smsbalance}</strong> sms. <button data-toggle="modal" data-target="#buyCreditsModalside" type="button" class="btn btn-primary btn-sm">top up</button>
      </div>
      <div className="alert d-none alert-danger mt-2" id='MessagesNotSentError' role="alert">
        Something went wrong. Please try again.
      </div>
      <div id='MessagesSentSuccess' className="alert alert-success d-none" role="alert">
        <strong>Success! </strong>Your Messages were sent
      </div>
      <ActionButtons ref={actionsButtonsRef} {...props} lastStep={handleLastStep} scheduleMessage={scheduleMessage} />
    </div>
  );
});

const SendMessageWizard = () => {
  const forceUpdate = useForceUpdate();
  const childCompRef = useRef()
  const summaryCompRef = useRef()
  const messageCompRef = useRef()
  const [stepWizard, setStepWizard] = useState(null);
  const [user, setUser] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [credit, setCredit] = useState(0);
  const [payload, setPayload] = useState({});
  const [totalMessages, setTotalMessages] = useState(0);
  const [sendingMessages, setSendingMessages] = useState(false);

  //on component mount
  useEffect(() => {
    creditBalance();
  }, []);

  const creditBalance = () => {
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
        setCredit(response.data);
      })
  }


  const assignStepWizard = (instance) => {
    setStepWizard(instance);
  };

  const assignUser = (val) => {
    // console.log("parent receive user callback");
    // console.log(val);
    setUser((user) => ({
      ...user,
      ...val
    }));
  };

  const handleStepChange = (e) => {
    // console.log("step change");
    // console.log(e);
    if (e.activeStep == 4) {
      let elm = document.getElementById("MessagesNotEnoughError");
      elm.classList.add("d-none")
      let recipients = childCompRef.current.getRecipients();
      let recipientsString = "";
      //change array to csv
      // for (let p = 0; p < recipients.length; p++) {
      //   recipientsString += recipients[p];
      //   recipientsString += ",";
      // }
      recipientsString = recipients.join(",")
      let message = document.getElementById("sendMessageBody");
      message = message.value;

      // if the default sender id is chosen then make the payload an empty string
      let sender_id = document.getElementById("chooseSenderId");
      let sender_id_name = "";
      if (sender_id.value == "smsteq") {
        sender_id = "";
        sender_id_name = "UjumbePap";
      } else {
        sender_id = sender_id.value;
        sender_id_name = sender_id.value;
      }

      let smslength = messageCompRef.current.getLength();
      let gotten = JSON.parse(localStorage.getItem("smstequser"));
      let owner = gotten.data.id;
      let payload = {
        "owner": owner,
        "phone_numbers": recipientsString,
        "message": message,
        "sender_id": sender_id,
        "sender_id_name": sender_id_name,
        // "sender_id": "",
        "phone_numbers_length": recipients.length,
        "smslength": smslength
      }
      setPayload(payload);
      // console.log(payload);
      // forceUpdate();
    }
    setActiveStep(e.activeStep - 1);
  };

  const handleComplete = () => {
    if (sendingMessages == false) {
      let gotten = JSON.parse(localStorage.getItem("smstequser"));
      let token = gotten.data.access;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      }

      // console.log(token)
      if (document.getElementById('scheduleToggle').checked) { //schedule message
        let elm2 = document.getElementById("MessagesNotEnoughError");
        elm2.classList.add("d-none");
        let elm = document.getElementById("MessagesNotSentError");
        elm.classList.add("d-none")

        let schedule_date = document.getElementById("schedule-date").value;
        let schedule_time = document.getElementById("schedule-time").value;

        var selected_date = new Date(schedule_date + " " + schedule_time);
        var current_date = new Date();

        //if no complete date is selected
        if (schedule_date == "" || schedule_time == "") {
          document.getElementById("MessagesScheduleNoDateError").classList.remove("d-none");
          return;
        } else {
          document.getElementById("MessagesScheduleNoDateError").classList.add("d-none");
        }

        //if selected time has passed
        if (selected_date.getTime() < current_date.getTime()) {
          document.getElementById("MessagesScheduledDateError").classList.remove("d-none");
          return;
        } else {
          document.getElementById("MessagesScheduledDateError").classList.add("d-none");
        }

        payload['time'] = selected_date;
        payload['sms'] = payload.message;

        summaryCompRef.current.setSendMessageBtnLoading(true);
        let final_payload = JSON.stringify(payload);
        // console.log(final_payload);

        axios.post(Variables.apiURL + 'api/v1/api/v1/schedule_sms/', final_payload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
          }
        })
          .then(response => {
            // console.log(response);

            //change loading status
            setSendingMessages(false);
            summaryCompRef.current.setSendMessageBtnLoading(false);

            if (response.status == 201) {
              let elm = document.getElementById("MessagesScheduledSuccess");
              elm.classList.remove("d-none")

              setTimeout(function () {
                // navigate('/home');
                window.location.href = "/schedules";
              }, 2000);
            } else {
              console.log(response);
              let elm = document.getElementById("MessagesNotSentError");
              elm.classList.remove("d-none")
            }
          })
          .catch(error => {
            let elm = document.getElementById("MessagesNotSentError");
            elm.classList.remove("d-none")
            setSendingMessages(false);
            summaryCompRef.current.setSendMessageBtnLoading(false);
            console.log('error');
            console.log(error);
            // $('#EmailAbsentError').show();
            // setLoading(false);
          })

      }
      else {//send messages now
        if ((messageCompRef.current.getLength() * payload.phone_numbers_length) > credit.balance) {//if the current balance is less than sms being sent
          setTotalMessages(messageCompRef.current.getLength() * payload.phone_numbers_length);
          let elm = document.getElementById("MessagesNotEnoughError");
          elm.classList.remove("d-none");
        } else {
          let elm2 = document.getElementById("MessagesNotEnoughError");
          elm2.classList.add("d-none");
          let elm = document.getElementById("MessagesNotSentError");
          elm.classList.add("d-none")

          //set loading status to true
          summaryCompRef.current.setSendMessageBtnLoading(true);
          setSendingMessages(true);

          // console.log(JSON.stringify(payload)
          let final_payload = JSON.stringify(payload);
          // console.log(final_payload);
          // console.log(token);

          axios.post(Variables.apiURL + 'bulk_send', final_payload, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': "Bearer " + token
            }
          })
            .then(response => {
              //change loading status
              setSendingMessages(false);
              // console.log(response);
              summaryCompRef.current.setSendMessageBtnLoading(false);

              // $('#EmailExistsError').hide();

              // setLoading(false);
              // console.log(loading);

              if (response.status == 201) {
                let elm = document.getElementById("MessagesSentSuccess");
                elm.classList.remove("d-none")

                setTimeout(function () {
                  // navigate('/home');
                  window.location.href = "/bulksms";
                }, 1500);
              } else {
                console.log(response);
                let elm = document.getElementById("MessagesNotSentError");
                elm.classList.remove("d-none")
              }
            })
            .catch(error => {
              let elm = document.getElementById("MessagesNotSentError");
              elm.classList.remove("d-none")
              setSendingMessages(false);
              summaryCompRef.current.setSendMessageBtnLoading(false);
              console.log('error');
              console.log(error);
              // $('#EmailAbsentError').show();
              // setLoading(false);
            })
        }
      }
    }
  }

  let noTransitions = {
    enterRight: 'step-transition animated animate__fadeInRight',
    enterLeft: 'step-transition animated animate__fadeInLeft',
    exitRight: 'step-transition animated animate__fadeOutRight',
    exitLeft: 'step-transition animated animate__fadeOutLeft'
  };

  return (
    <div>
      <Stepper activeStep={activeStep}>
        {/* <Step label="" children={<MdDescription />} /> */}
        <Step label="" />
        {/* <Step label="Format Contacts" /> */}
        <Step label="" />
        <Step label="" />
        <Step label="" />
      </Stepper>
      {/* NOTE: IMPORTANT !! StepWizard must contains at least 2 children components, else got error */}
      <StepWizard instance={assignStepWizard} onStepChange={handleStepChange} transitions={noTransitions}>
        <One ref={childCompRef} userCallback={assignUser} />
        <Two user={user} ref={messageCompRef} userCallback={assignUser} />
        <Three />
        <Four ref={summaryCompRef} smsbalance={totalMessages} payload={payload} user={user} completeCallback={handleComplete} />
      </StepWizard>
    </div>
  );
};

export default SendMessageWizard;
