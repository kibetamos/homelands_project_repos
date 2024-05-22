import React, { Component, useState } from 'react';
import Header from '../_Layouts/Header/Header';
import Sidebar from '../_Layouts/Sidebar/Sidebar';
import axios from 'axios';
import $ from 'jquery';
import useForceUpdate from 'use-force-update';
import UploadContactsWizard from '../_Layouts/Wizard/UploadContactsWizard';
import { Variables } from '../_utils/GlobalVariables';
import { getgroups } from 'process';
import { isTemplateExpression } from 'typescript';
import { MDBDataTableV5 } from 'mdbreact';

export class Contacts extends Component {

    state = {
        groups: [], contacts: [], full_name: '', phone_number: '', group_name: '', group: [], oneGroup: [], editingGroupName: '', editingContact: '', deletingGroupContacts: '', deletingGroup: [], oneContact: [], deleteGroupLoading: false, deleteContactsLoading: false, newGroupLoading: false, editGroupLoading: false, editGroupError: '', newGroupError: '', CurrentGroupShowing: '', contactsLoading: true,
        datatable: {}, groupsLoading: true, CurrentGroup: {}, newContactLoading: false, editContactLoading: false, showingGroupId: ''
    }

    //create a new group
    handleSubmitGroup = event => {
        event.preventDefault();

        if (document.getElementById("newGroupInput").value == "") { //if name is blank
            this.setState({ newGroupError: 'Group Name cannot be blank' });
            document.getElementById('createGroupFail').style.display = "block";
            return;
        } else {
            if (this.nameInGroup(document.getElementById("newGroupInput").value)) { //if typed name is in existing group names
                this.setState({ newGroupError: 'There is already a group with that name' });
                document.getElementById('createGroupFail').style.display = "block";
                return;
            } else {
                this.setState({ newGroupError: '' });
                document.getElementById('createGroupFail').style.display = "none";

                let gotten = JSON.parse(localStorage.getItem("smstequser"));
                let token = gotten.data.access;
                let id = gotten.data.id;
                const group = {
                    "group_name": this.state.group_name,
                    "owner": id
                }
                // console.log(id)
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + token
                }
                this.setState({ newGroupLoading: true });

                axios.post(Variables.apiURL + 'api/v1/api/v1/groups/', group, { headers: headers })
                    .then(res => {
                        this.setState({ newGroupLoading: false });
                        // console.log(res);
                        // console.log(res.data);
                        if (res.status == 201) {
                            $('#createGroupFail').hide();
                            $('#createGroupSuccess').show();
                            setTimeout(function () {
                                window.location.href = "/contacts";
                            }, 1000);
                            this.forceUpdate();
                        }
                        else {
                            $('#createGroupSuccess').hide();
                            this.setState({ newGroupError: 'Something went wrong, Please try again' });
                            $('#createGroupFail').show();
                            console.log('error');
                        }
                    })
            }
        }
    }

    //Edit group Name
    handleSubmitUpdateGroup = event => {
        event.preventDefault();

        if (document.getElementById("editGroupInput").value == "") { //if name is blank
            this.setState({ editGroupError: 'Group Name cannot be blank' });
            document.getElementById('editGroupFail').style.display = "block";
            return;
        } else {
            if (this.nameInGroup(document.getElementById("editGroupInput").value)) { //if typed name is in existing group names
                this.setState({ editGroupError: 'There is already a group with that name' });
                document.getElementById('editGroupFail').style.display = "block";
                return;
            } else {
                this.setState({ editGroupError: '' });
                document.getElementById('editGroupFail').style.display = "none";
                let id = this.state.oneGroup.id;
                let gotten = JSON.parse(localStorage.getItem("smstequser"));
                let token = gotten.data.access;
                let userid = gotten.data.id;
                const updatedGroup = {
                    "group_name": document.getElementById("editGroupInput").value,
                    "owner": userid,
                    "id": id
                }
                // console.log(userid)
                // console.log(id)
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + token
                }
                this.setState({ editGroupLoading: true });
                axios.put(Variables.apiURL + 'api/v1/api/v1/groups/' + id, updatedGroup, { headers: headers })
                    .then(res => {
                        this.setState({ editGroupLoading: false });
                        // console.log(res);
                        // console.log(res.data);
                        if (res.status == 200) {
                            document.getElementById('editGroupFail').style.display = "none";
                            document.getElementById('editGroupSuccess').style.display = "block";
                            setTimeout(function () {
                                window.location.href = "/contacts";
                            }, 1000);
                        }
                        else {
                            document.getElementById('editGroupSuccess').style.display = "none";
                            this.setState({ editGroupError: 'Somthing went wrong, Please try again' });
                            document.getElementById('editGroupFail').style.display = "block";
                        }
                    })
            }
        }
    }

    nameInGroup = (groupname) => {
        let status = false;
        for (let i = 0; i < this.state.groups.length; i++) {
            if (this.state.groups[i].group_name.toLowerCase() == groupname.toLowerCase()) {
                status = true;
                break;
            }
        }
        return status;
    }

    //create a new contact
    handleCreateContact = event => {
        event.preventDefault();

        let grouping = document.getElementById('groupidselect').value;
        // console.log(grouping)
        let gotten = JSON.parse(localStorage.getItem("smstequser"));
        let token = gotten.data.access;
        let id = gotten.data.id;
        const contact = {
            "full_name": this.state.full_name,
            "phone_number": "254" + this.state.phone_number,
            "group": [grouping],
            "owner": id
        }
        // console.log(contact)
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }
        this.setState({ newContactLoading: true });

        $('#createContactFail').hide();
        axios.post(Variables.apiURL + 'api/v1/api/v1/contacts/', contact, { headers: headers })
            .then(res => {
                this.setState({ newContactLoading: false });
                // console.log(res);
                // console.log(res.data);
                if (res.status == 201) {
                    $('#createContactFail').hide();
                    $('#createContactSuccess').show();
                    setTimeout(function () {
                        window.location.href = "/contacts";
                    }, 1000);
                    this.forceUpdate();
                }
                else {
                    $('#createContactSuccess').hide();
                    $('#createContactFail').show();
                    console.log('error');
                }
            }, err => {
                $('#createContactFail').show();
                this.setState({ newContactLoading: false });
            }
            )
    }

    //edit contact
    handleSubmitUpdateContact = event => {
        event.preventDefault();
        let id = this.state.oneContact.id;
        let gotten = JSON.parse(localStorage.getItem("smstequser"));
        let token = gotten.data.access;
        let userid = gotten.data.id;
        let grouping = document.getElementById("displayGroup").value;
        // console.log(grouping);
        const updatedContact = {
            "group": [grouping],
            "full_name": document.getElementById("editContactInput").value,
            "phone_number": document.getElementById("editPhoneNumber").value,
            "owner": userid,
            "id": id
        }
        // console.log(userid)
        // console.log(id)
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }
        let self = this;
        this.setState({ editContactLoading: true });
        axios.put(Variables.apiURL + 'api/v1/api/v1/contacts/' + id, updatedContact, { headers: headers })
            .then(res => {
                this.setState({ editContactLoading: false });
                // console.log(res);
                // console.log(res.data);
                if (res.status == 200) {
                    $('#editContactFail').hide();
                    $('#editContactSuccess').show();
                    setTimeout(function () {
                        self.getContactsByGroup(self.state.showingGroupId);
                        $('#editContactSuccess').hide();
                        document.getElementById('showEditContactModal').click();
                    }, 1000);
                    this.forceUpdate();
                }
                else {
                    $('#editContactSuccess').hide();
                    $('#editContactFail').show();
                    console.log('error');
                }
            }, err => {
                $('#editContactFail').show();
                this.setState({ editContactLoading: false });
            })
    }

    //populate group by id
    handleGetGroup(id) {
        console.log(this.state.groups[id])
        let gotten = JSON.parse(localStorage.getItem("smstequser"));
        // let token = gotten.data.access;

        this.setState({ editingGroupName: this.state.groups[id].group_name });
        this.setState({ oneGroup: this.state.groups[id] });

        document.getElementById("editGroupInput").value = this.state.groups[id].group_name;

        // const headers = {
        //     'Content-Type': 'application/json',
        //     'Authorization': "Bearer " + token
        // }
        // axios.get(Variables.apiURL + 'api/v1/api/v1/groups/'+id, { headers: headers })
        //     .then(res => {
        //         const oneGroup = res.data;
        //         // this.setState({ oneGroup: oneGroup });
        //         document.getElementById("editGroupInput").value = oneGroup.group_name;
        //         console.log(oneGroup);
        //     })
    }

    handleGetContact(id) {
        // console.log(this.state.contacts[id])
        let gotten = JSON.parse(localStorage.getItem("smstequser"));
        // let token = gotten.data.access;
        this.setState({ editingContact: this.state.contacts[id].full_name });
        this.setState({ oneContact: this.state.contacts[id] });

        document.getElementById("editContactInput").value = this.state.contacts[id].full_name;
        document.getElementById("displayGroup").value = this.state.groups[id].id;
        document.getElementById("editPhoneNumber").value = this.state.contacts[id].phone_number;
        // const headers = {
        //     'Content-Type': 'application/json',
        //     'Authorization': "Bearer " + token
        // }
        // axios.get(Variables.apiURL + 'api/v1/api/v1/groups/'+id, { headers: headers })
        //     .then(res => {
        //         const oneGroup = res.data;
        //         // this.setState({ oneGroup: oneGroup });
        //         document.getElementById("editGroupInput").value = oneGroup.group_name;
        //         console.log(oneGroup);
        //     })
    }

    handleChangeContact = event => {
        this.setState({ phone_number: event.target.value });
    }

    handleChangeFullName = event => {
        this.setState({ full_name: event.target.value });
    }

    handleSetGroupName = event => {
        this.setState({ group_name: event.target.value });
    }

    handleChangeGroup = event => {
        this.setState({ id: event.target.value })
        this.setState({ group_name: event.target.value });
    }

    //called when create new group input changes
    handleNewGroupInputChange = event => {
        if (event.target.value != "") { //if name isnt blank
            if (this.nameInGroup(event.target.value)) { //if typed name is in existing group names
                this.setState({ newGroupError: 'There is already a group with that name' });
                document.getElementById('createGroupFail').style.display = "block";
            } else {
                this.setState({ newGroupError: '' });
                document.getElementById('createGroupFail').style.display = "none";
                this.setState({ id: event.target.value })
                this.setState({ group_name: event.target.value });
                this.forceUpdate();
            }
        } else {
            this.setState({ newGroupError: 'Group Name cannot be blank' });
            document.getElementById('createGroupFail').style.display = "block";
        }

    }

    //called when edit group input changes
    handleUpdateGroup = event => {
        if (event != "") { //if name isnt blank
            if (this.nameInGroup(event)) { //if typed name is in existing group names
                this.setState({ editGroupError: 'There is already a group with that name' });
                document.getElementById('editGroupFail').style.display = "block";
            } else {
                this.setState({ editGroupError: '' });
                document.getElementById('editGroupFail').style.display = "none";
                this.setState({ group_name: event });
                this.forceUpdate();
            }
        } else {
            this.setState({ editGroupError: 'Group Name cannot be blank' });
            document.getElementById('editGroupFail').style.display = "block";
        }
    }

    handleUpdateContact = event => {
        this.setState({ phone_number: event.target.value });
        this.forceUpdate();
    }

    // load all groups
    getGroups() {
        let gotten = JSON.parse(localStorage.getItem("smstequser"));
        let token = gotten.data.access;
        let id = gotten.data.id;
        // console.log(id)
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }
        axios.get(Variables.apiURL + 'api/v1/api/v1/groups/', { headers: headers })
            .then(res => {
                this.state.groupsLoading = false;
                this.setState({ contactsLoading: false });
                const groups = res.data;
                this.setState({ groups: groups });
                // set current group to the first on list
                this.changeActiveGroup(0);
                this.forceUpdate();
            })
    }

    //load all contacts
    getContacts() {
        let gotten = JSON.parse(localStorage.getItem("smstequser"));
        let token = gotten.data.access;
        let id = gotten.data.id;
        // console.log(gotten)
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }
        axios.get(Variables.apiURL + 'api/v1/api/v1/contacts/?owner=' + id, { headers: headers })
            .then(res => {
                // console.log(res.data);
                this.formatDatatableData(res.data);
                const contacts = res.data;
                this.setState({ contacts: contacts });
            })
    }

    formatDatatableData(res) {
        let rowobject = res;
        for (let i = 0; i < rowobject.length; i++) {
            rowobject[i]["action"] = [
                <div class="d-flex">
                    <a onClick={() => this.handleGetContact(i)} href="javascript:void(0)" data-toggle="modal" data-target="#editContactModalside"
                        class="btn btn-primary shadow btn-xs sharp mr-1"><i class="fa fa-pencil"></i></a>
                    <a href="#" onClick={e => this.showDeleteContactModal(i)} data-toggle="modal" data-target="#deleteContactModal" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
                </div>, ""];
        }

        // console.log(rowobject);
        this.setState({
            datatable:
            {
                columns: [
                    {
                        label: 'Name',
                        field: 'full_name',
                        width: 150,
                        attributes: {
                            'aria-controls': 'DataTable',
                            'aria-label': 'full_name',
                        },
                    },
                    {
                        label: 'Mobile',
                        field: 'phone_number',
                        width: 270,
                    },
                    {
                        label: 'action',
                        field: 'action',
                        width: 200,
                    }
                ],
                rows: rowobject
            }
        })

        this.setState({ contactsLoading: false });

        // let elm = document.getElementById('all-contact-list-section').scrollTop;
        // elm.scrollTop = 10;
    }

    //on individual group click
    getContactsByGroup(group_id) {
        let gotten = JSON.parse(localStorage.getItem("smstequser"));
        let token = gotten.data.access;
        let id = gotten.data.id;
        this.setState({ showingGroupId: group_id });
        // console.log(token)
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }

        this.setState({ contactsLoading: true });
        this.setState({ contacts: [] });
        axios.get(Variables.apiURL + 'api/v1/contacts/?group=' + group_id, { headers: headers })
            .then(response => {
                this.setState({ contactsLoading: false });
                // console.log(response)
                this.setState({ contacts: response.data });
                this.formatDatatableData(response.data);
            })
    }

    handleButtonClick(e) {
        console.log("e");
        this.setState({ visible: true });
    };

    //show modal
    showDeleteGroupModal(group) {
        let gotten = JSON.parse(localStorage.getItem("smstequser"));
        let token = gotten.data.access;
        let id = gotten.data.id;
        const selectedItem = this.state.id;

        // open modal
        document.getElementById("confirmDeleteGroupModalBtn").click();

        this.setState({ deletingGroupName: this.state.groups[group].group_name });
        document.getElementById("deletinggroupid").innerHTML = this.state.groups[group].id;
        this.setState({ deletingGroup: this.state.groups[group] });
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }

        //reset deleting contacts length
        this.setState({ deletingGroupContacts: [] });

        //get individual contacts from group
        axios.get(Variables.apiURL + 'api/v1/contacts/?group=' + this.state.groups[group].id, { headers: headers })
            .then(response => {
                if (response.status == 200) {
                    this.setState({ deletingGroupContacts: response.data });
                }
            })
    }

    //delete individual group
    deleteGroup = () => {
        let confirmName = document.getElementById("confirmGroupNameDelete").value;
        if (Symbol(this.state.deletingGroupName).toString().toLowerCase() == Symbol(confirmName).toString().toLowerCase()) {
            let gotten = JSON.parse(localStorage.getItem("smstequser"));
            let token = gotten.data.access;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            }

            let groupid = document.getElementById("deletinggroupid").innerHTML;
            document.getElementById('deleteGroupFail').style.display = "none";
            document.getElementById('deleteGroupNameNotMatch').style.display = "none";
            document.getElementById('deleteGroupSuccess').style.display = "none";
            this.setState({ deleteGroupLoading: true });

            axios.delete(Variables.apiURL + 'api/v1/api/v1/groups/' + groupid, { headers: headers })
                .then(response => {
                    this.setState({ deleteGroupLoading: false });
                    if (response.status == 204) {
                        // this.setState({ deletingGroupContacts: response.data });
                        document.getElementById('deleteGroupSuccess').style.display = "block";
                        setTimeout(function () {
                            window.location.href = "/contacts";
                        }, 1000);
                    } else {
                        document.getElementById('deleteGroupFail').style.display = "block";
                    }
                }, error => {
                    this.setState({ deleteGroupLoading: false });
                    document.getElementById('deleteGroupFail').style.display = "block";
                })
        } else {
            document.getElementById('deleteGroupSuccess').style.display = "none";
            document.getElementById('deleteGroupFail').style.display = "none";
            document.getElementById('deleteGroupNameNotMatch').style.display = "block";
        }
    }
    //display delete contact modal
    showDeleteContactModal(contact) {
        document.getElementById("deletingContactsId").innerHTML = this.state.contacts[contact].id;
        document.getElementById("deletingContactsName").innerHTML = this.state.contacts[contact].full_name;
    }

    //delete individual contact
    deleteContact = (id) => {
        let gotten = JSON.parse(localStorage.getItem("smstequser"));
        let token = gotten.data.access;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }

        let thisid = document.getElementById("deletingContactsId").innerHTML;
        // console.log(thisid);
        this.setState({ deleteContactsLoading: true });
        let self = this;
        $("#deleteContactFail").hide();
        axios.delete(Variables.apiURL + 'api/v1/api/v1/contacts/' + thisid, { headers: headers })
            .then(response => {
                this.setState({ deleteContactsLoading: false });
                if (response.status == 204) {
                    $("#deleteContactSuccess").show();

                    setTimeout(function () {
                        self.getContactsByGroup(self.state.showingGroupId);
                        document.getElementById("showDeleteContactModalBtn").click();
                        $("#deleteContactFail").hide();
                        $("#deleteContactSuccess").hide();
                    }, 1000);

                } else {
                    $("#deleteContactFail").show();
                }
            }, error => {
                $("#deleteContactFail").show();
                this.setState({ deleteContactsLoading: false });
            })
    }

    componentDidMount() {
        this.getGroups();
        // this.getContacts();
    }

    closeDeleteGroupModal() {
        if (document.getElementById("closedeletegroup")) {
            document.getElementById("closedeletegroup").click();
        }
    }

    closeDeleteContactModal() {
        if (document.getElementById("closedeletecontact")) {
            document.getElementById("closedeletecontact").click();
        }
    }

    changeActiveGroup = (e) => {
        let element2 = document.querySelectorAll("#contact-groups-list > tbody > tr");
        for (let i = 0; i < element2.length; i++) {
            element2[i].classList.remove("active");
        }
        // this.setState(contacts);
        let elm = document.getElementById('all-contact-list-section').scrollIntoView(true);
        this.setState({ CurrentGroup: this.state.groups[e] });
        this.setState({ CurrentGroupShowing: this.state.groups[e].group_name });
        this.getContactsByGroup(this.state.groups[e].id);
        let element = document.querySelector("#contact-groups-list tbody tr:nth-child(" + (e + 1) + ")");
        element.classList.add("active");
    }

    render() {
        const displayNone = { display: 'none' };
        let editingGroupName = this.state.editingGroupName;
        let editingContact = this.state.editingContact;
        let deletingGroupName = this.state.deletingGroupName;
        let deletingContactsName = this.state.deletingContactsName;
        let deleteGroupLoading = this.state.deleteGroupLoading;
        let deleteContactsLoading = this.state.deleteContactsLoading;
        let newGroupLoading = this.state.newGroupLoading;
        let editGroupLoading = this.state.editGroupLoading;
        let editGroupError = this.state.editGroupError;
        let newGroupError = this.state.newGroupError;
        let closeDeleteGroupModal = this.closeDeleteGroupModal;
        let closeDeleteContactModal = this.closeDeleteContactModal;
        let CurrentGroupShowing = this.state.CurrentGroupShowing;
        let contactsLoading = this.state.contactsLoading;
        return (
            <div>
                <Header title="Contacts"></Header>
                <Sidebar></Sidebar>
                <div class="content-body">
                    <div class="container-fluid">
                        {/* <div class="text-center container-fluid">
                        <UploadContactsWizard></UploadContactsWizard>
                    </div> */}
                        <div class="row pl-5 m-2">
                            <a href="javascript:void(0)" data-toggle="modal" data-target="#upload-contacts-modal" class="btn btn-primary upload-contacts-btn text-nowrap btn-sm">Upload Contacts</a>
                        </div>

                        <div class="row ml-2 mr-0">
                            {/* contact groups */}
                            <div class="col-md-5 col-sm-12 col-xs-12 pt-4 ">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">Contact Groups</h4>
                                        <a href="javascript:void(0)" data-toggle="modal" data-target="#newGroupModalside" class="btn btn-outline-primary light text-nowrap btn-sm">New Group</a>
                                    </div>

                                    {this.state.groupsLoading ?
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

                                        <div>

                                            {this.state.groups.length > 0 ?
                                                <div class="pt-4">
                                                    <div class="table-responsive col-12">
                                                        <table id="contact-groups-list" class="table card-table display dataTablesCard" defaultPageSize={10}
                                                            showPaginationBottom >
                                                            {/* <thead>
                                                                <tr>
                                                                    <th>Name</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead> */}
                                                            <tbody>
                                                                {
                                                                    this.state.groups
                                                                        .map((group, index) =>
                                                                            <tr class="single-group " onClick={e => this.changeActiveGroup(index)}>
                                                                                <td class="pr-5" >{group.group_name}</td>
                                                                                <td>
                                                                                    <div class="d-flex ">
                                                                                        <a onClick={() => this.handleGetGroup(index)} href="javascript:void(0)" data-toggle="modal" data-target="#editGroupModalside"
                                                                                            class="btn btn-primary shadow btn-xs sharp mr-1"><i class="fa fa-pencil"></i></a>
                                                                                        <a onClick={e => this.showDeleteGroupModal(index)} class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                :
                                                <div class="p-4">
                                                    You have not created any contact groups
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                            {/* contact groups end */}

                            {/* Contacts List */}
                            <div id='all-contact-list-section' class="col-md-7 col-sm-12 col-xs-12 pr-2 pt-4">

                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">{CurrentGroupShowing}
                                            {
                                                this.state.contacts.length > 0 ? <span>({this.state.contacts.length})</span>
                                                    : <span></span>
                                            }
                                        </h4>

                                        <div>
                                            {this.state.groups.length > 0 ?

                                                <a href="javascript:void(0)" data-toggle="modal" data-target="#newContactModalside" type="button" class="btn btn-outline-primary text-nowrap btn-sm">
                                                    New Contact</a>
                                                :
                                                <div>
                                                </div>
                                            }
                                        </div>
                                        {/* <a href="javascript:void(0)" data-toggle="modal" data-target="#newContactModalside" type="button" class="btn btn-primary text-nowrap btn-sm">New Contact</a> */}
                                    </div>
                                    <div class="card-body">


                                        <div class="table-responsive col-12">
                                            {contactsLoading ?
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
                                                <div>
                                                    {this.state.contacts.length > 0 ?

                                                        <MDBDataTableV5 hover entriesOptions={[5, 20, 25]} entries={25} pagesAmount={4} data={this.state.datatable} searchTop searchBottom={false} />
                                                        :
                                                        <div>
                                                            There are no contacts here.
                                                        </div>
                                                    }
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Contacts List */}
                        </div>

                    </div>
                </div>

                {/* Upload Contacts Modal*/}
                <div class="modal fade  background-opaque" id="upload-contacts-modal">
                    <div class="modal-dialog upload-contacts-modal-body justify-center" role="document">
                        <div class="modal-content upload-contacts-modal-body-inner">
                            <div class="modal-header">
                                <h5 class="modal-title p-2"></h5>
                                <button type="button" class="close" data-dismiss="modal"><span>&times;</span>
                                </button>
                            </div>
                            <div class="text-center overflow-hidden-tag modal-body">
                                <UploadContactsWizard></UploadContactsWizard>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Upload Contacts Modal End*/}

                {/* New Contact Modal */}
                <div class="modal" id="newContactModalside">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">New Contact</h5>
                                <button type="button" class="close" data-dismiss="modal"><span>&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form id='createContactForm' onSubmit={this.handleCreateContact}>
                                    <div class="form-group">
                                        <div class="card">
                                            <label className="mb-1 text-Black">
                                                <strong>Group</strong>
                                            </label>
                                            <div class="input mb-3 input-warning-o">
                                                <select class="form-control dull-border mr-3" id='groupidselect' name="group_name" onChange={() => this.handleChangeGroup()} options={this.state.groups} >
                                                    <option value="⬇️ Select a Group ⬇️"> -- Select a Group -- </option>
                                                    {this.state.groups
                                                        .map((group) => <option value={group.id}>{group.group_name}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div class="card">
                                            <label className="mb-1 text-Black">
                                                <strong>Name</strong>
                                            </label>
                                            <div class="input mb-3 input-warning-o">
                                                <div class="input">
                                                    <span class="input-text"></span>
                                                </div>
                                                <input type="text" maxLength="20" class="form-control dull-border" id='full_name' name="full_name" placeholder="Full Name" onChange={this.handleChangeFullName} />
                                            </div>
                                        </div>
                                        <div class="card">
                                            <label className="mb-1 text-Black mb-3"><strong>Number</strong></label>
                                            <div class="input-group mb-3 input-warning-o">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text">+254</span>
                                                </div>
                                                <input type="text" maxLength="9" class="form-control dull-border" id='phone_number' name="phone_number" placeholder="7xx xxx xxx" onChange={this.handleChangeContact} />
                                            </div>
                                        </div>

                                    </div>
                                    <div class="form-group">
                                        <div class="text-center mt-4">
                                            <button type="submit" class="btn bg-primary text-white btn-block">{
                                                this.state.newContactLoading ?
                                                    <span>Loading... </span>
                                                    :
                                                    <span>Submit</span>
                                            } </button>
                                        </div>
                                    </div>
                                    <div className="alert alert-danger" id='createContactFail' style={displayNone} role="alert">
                                        Failed, Try again
                                    </div>
                                    <div id='createContactSuccess' className="alert alert-success" style={displayNone} role="alert">
                                        <strong>Success! </strong>Contact Created Successfully.
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* New Contact Modal End */}

                {/* Edit Contact Modal */}
                <div class="modal" id="editContactModalside">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Edit Contact</h5>
                                <button type="button" class="close" data-dismiss="modal"><span>&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form id='editContactForm' onSubmit={this.handleSubmitUpdateContact}>
                                    <div class="form-group">
                                        <div class="card background-dark">
                                            <label className="p-3  text-warning">You are about to edit the contact <strong class="input-text text-black">"{editingContact}"</strong>

                                            </label>
                                        </div>

                                        <input type="hidden" maxLength="20" class="form-control dull-border " id='displayGroup' name="Group" onChange={this.handleSetGroupName}></input>



                                        <div class="card">
                                            <label className="mb-1 text-Black">
                                                <strong>Name</strong>
                                            </label>
                                            <div class="input mb-3 input-warning-o">
                                                <div class="input">
                                                    <span class="input-text"></span>
                                                </div>
                                                <input type="text" maxLength="20" class="form-control dull-border" id='editContactInput' name="full_name" placeholder="Full Name" onChange={this.handleChangeFullName} />
                                            </div>
                                        </div>
                                        <div class="card">
                                            <label className="mb-1 text-Black mb-3"><strong>Number</strong></label>
                                            <div class="input-group mb-3 input-warning-o">
                                                {/* <div class="input-group-prepend">
                                                    <span class="input-group-text">+254</span>
                                                </div> */}
                                                <input type="text" class="form-control dull-border" id='editPhoneNumber' name="phone_number" placeholder="7xx xxx xxx" onChange={e => this.handleUpdateContact(e.target.value)} />
                                            </div>
                                        </div>

                                    </div>
                                    <div className="alert alert-danger" id='editContactFail' style={displayNone} role="alert">
                                        Failed, Try again
                                    </div>
                                    <div id='editContactSuccess' className="alert alert-success" style={displayNone} role="alert">
                                        <strong>Success! </strong>Contact Edited Successfully.
                                    </div>
                                    <div class="form-group">
                                        <div class="text-center mt-4">
                                            <button type="submit" class="btn bg-primary text-white btn-block">{this.state.editContactLoading ?
                                                <span>Loading...</span>
                                                :
                                                <span>Submit</span>
                                            }
                                            </button>
                                        </div>
                                    </div>
                                    <div className="alert alert-danger" id='createContactFail' style={displayNone} role="alert">
                                        Failed, Try again
                                    </div>
                                    <div id='createContactSuccess' className="alert alert-success" style={displayNone} role="alert">
                                        <strong>Success! </strong>Group Created Successfully.
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Edit Contact Modal End */}

                {/* New Group Modal */}
                <div class="modal" id="newGroupModalside">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">New Group</h5>
                                <button type="button" class="close" data-dismiss="modal"><span>&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form id='newGroup' onSubmit={this.handleSubmitGroup}>
                                    <div class="form-group">
                                        <div class="card">
                                            <label className="mb-1 text-Black">
                                                <strong>Name</strong>
                                            </label>
                                            <div class="input mb-3 input-warning-o">
                                                <div class="input">
                                                    <span class="input-text"></span>
                                                </div>
                                                <input type="text" maxLength="20" class="form-control dull-border" id='newGroupInput' name="group_name" onChange={this.handleNewGroupInputChange} placeholder="Group Name" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="alert alert-danger" id='createGroupFail' style={displayNone} role="alert">
                                        {newGroupError}
                                    </div>
                                    <div id='createGroupSuccess' className="alert alert-success" style={displayNone} role="alert">
                                        <strong>Success! </strong>Group Created Successfully.
                                    </div>
                                    <div class="form-group">
                                        <div class="text-center mt-4">
                                            <button type="submit" class="btn bg-primary text-white btn-block">    {newGroupLoading ? <span>Loading...</span> : <span>Submit</span>}</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* New Group Modal End */}

                {/* Edit Group Modal */}
                <div class="modal" id="editGroupModalside">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Edit Group</h5>
                                <button type="button" class="close" data-dismiss="modal"><span>&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form id='editGroup' onSubmit={this.handleSubmitUpdateGroup}>
                                    <div class="form-group">
                                        <div class="card">
                                            <label className="p-3 mb-5 background-dark text-warning">You are about to edit the group <strong class="input-text text-black">"{editingGroupName}"</strong>

                                            </label>

                                            <label className="mb-1 text-Black">
                                                <strong>Name</strong>
                                            </label>

                                            <div class="input mb-3 input-warning-o">
                                                <div class="input">

                                                    <span class="input-text"></span>

                                                </div>
                                                <input type="text" maxLength="20" class="form-control dull-border" id='editGroupInput' name="group_name" placeholder="Group Name" onChange={e => this.handleUpdateGroup(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="alert alert-danger" id='editGroupFail' style={displayNone} role="alert">
                                        {editGroupError}
                                    </div>
                                    <div id='editGroupSuccess' className="alert alert-success" style={displayNone} role="alert">
                                        <strong>Success! </strong>Group Updated Successfully.
                                    </div>
                                    <div class="form-group">
                                        <div class="text-center mt-4">
                                            <button type="submit" class="btn bg-primary text-white btn-block">
                                                {this.state.editGroupLoading ? <span>Loading...</span> : <span>Submit</span>}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Edit Group Modal End */}

                {/* Confirm Delete Group Modal */}
                <div class="modal fade" id="confirmDeleteGroupModal">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header p-4">
                                <h5 class="modal-title">Delete Group</h5>
                                <button id='closedeletegroup' type="button" class="close" data-dismiss="modal">
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="form-group">
                                        <div class="card">
                                            <label className="p-3 mb-5 background-dark text-Black">You are about to delete the group <strong class="input-text">"{deletingGroupName}"</strong>
                                                <div class="mt-1 text-warning">
                                                    {this.state.deletingGroupContacts.length} Contacts
                                                </div>
                                            </label>
                                            <div class="input mb-3 input-warning-o">
                                                <div class="input mb-2">To confirm, type the name                                                     <strong class="input-text"> {deletingGroupName}</strong> Below
                                                </div>

                                                <input type="text" maxLength="20" id='confirmGroupNameDelete' class="form-control dull-border" name="group_name" placeholder="Group Name" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="alert alert-danger" id='deleteGroupNameNotMatch' style={displayNone} role="alert"> The Name Above Must Match The Group Name You Want To Delete.
                                    </div>
                                    <div className="alert alert-danger" id='deleteGroupFail' style={displayNone} role="alert">
                                        Something Went Wrong, Please Try Again.
                                    </div>
                                    <div id='deleteGroupSuccess' className="alert alert-success" style={displayNone} role="alert">
                                        <strong>Success! </strong>Group Deleted Successfully.
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6" onClick={closeDeleteGroupModal}>
                                            <div class="form-group">
                                                <div class="text-center mt-4">
                                                    <button type="button" class="btn btn-dark btn-block">Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6" onClick={this.deleteGroup}>
                                            <p id='deletinggroupid' class="d-none"></p>
                                            <div class="form-group">
                                                <div class="text-center mt-4">
                                                    <button type="button" class="btn bg-primary text-white btn-block">
                                                        {deleteGroupLoading ? <span>Deleting Group....</span> : <span>Delete</span>}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Confirm Delete Group End */}

                {/* Confirm Delete Contact Modal */}
                <div class="modal fade" id="deleteContactModal">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header p-4">
                                <h5 class="modal-title">Delete Contact</h5>
                                <button id='closedeletecontact' type="button" class="close" data-dismiss="modal">
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="form-group">
                                        <div class="card">
                                            <label id="deletingContactsId" className="d-none"></label>
                                            <label className="p-3 mb-5 background-dark text-Black">You are about to delete this Contact "<strong class="input-text text-warning" id="deletingContactsName"></strong>"
                                            </label>
                                        </div>
                                    </div>
                                    <div id='deleteContactSuccess' className="alert alert-success" style={displayNone} role="alert">
                                        <strong>Success! </strong>Contact Deleted Successfully.
                                    </div>
                                    <div className="alert alert-danger" id='deleteContactFail' style={displayNone} role="alert">
                                        Failed, Try again
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6" onClick={closeDeleteContactModal}>
                                            <div class="form-group">
                                                <div class="text-center mt-4">
                                                    <button type="button" class="btn btn-dark btn-block">Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6" onClick={this.deleteContact}>
                                            <p id='deletingcontactid' class="d-none"></p>
                                            <div class="form-group">
                                                <div class="text-center mt-4">
                                                    <button type="button" class="btn bg-primary text-white btn-block">
                                                        {deleteContactsLoading ? <span>Deleting Contact....</span> : <span>Delete</span>}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Confirm Delete Contact End */}
            </div >
        );
    }
}


Contacts.propTypes = {};

Contacts.defaultProps = {};

export default Contacts;