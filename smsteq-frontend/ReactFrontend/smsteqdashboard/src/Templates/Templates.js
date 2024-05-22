import React, { Component } from 'react';
import Header from '../_Layouts/Header/Header';
import Sidebar from '../_Layouts/Sidebar/Sidebar';
import axios from 'axios';
import { Variables } from '../_utils/GlobalVariables';
import $ from 'jquery';


////  AKA Drafts  ////
export class Templates extends Component {
    state = { drafts: [], title: '', message: '', draftId: '', editName: '', editMessage: '', deletingDraft: [], deletingDraftTitle: '', deletingDraftTitle: '', deletingDraftId: '', editcharactersTotal: 0, editsmsTotal: 0, newcharactersTotal: 0, newsmsTotal: 0, draftsLoading: true, newDraftLoading: false, newDraftError: '', deleteDraftLoading: false, editDraftLoading: false, editDraftError: '' }

    // load all drafts
    getDrafts() {
        let gotten = JSON.parse(localStorage.getItem("smstequser"));
        let token = gotten.data.access;
        let id = gotten.data.id;
        // console.log(id)
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }
        axios.get(Variables.apiURL + 'api/v1/templates/', { headers: headers })
            .then(res => {
                const drafts = res.data;
                this.setState({ drafts: drafts });
                this.setState({ draftsLoading: false });
                // console.log(drafts);
                this.forceUpdate();
            })
    }
    //end load all drafts

    //load single draft by id for edit

    getDraftEdit(id) {
        // console.log(this.state.drafts[id])
        let gotten = JSON.parse(localStorage.getItem("smstequser"));
        // let token = gotten.data.access;
        this.setState({ editcharactersTotal: this.state.drafts[id].message.length });
        if (this.state.drafts[id].message.length % 160 != 0) {
            this.setState({ editsmsTotal: Math.floor(this.state.drafts[id].message.length / 160) + 1 })
        } else {
            this.setState({ editsmsTotal: Math.floor(this.state.drafts[id].message.length / 160) })
        }
        this.setState({ editName: this.state.drafts[id].title });
        this.setState({ editMessage: this.state.drafts[id].message });
        this.setState({ draftId: this.state.drafts[id].id });

        document.getElementById("editName").value = this.state.drafts[id].title;
        document.getElementById("editMessage").value = this.state.drafts[id].message;
        document.getElementById("draftId").value = this.state.drafts[id].id;

    }
    //end load single draft for edit

    //load single draft by id for delete

    getDraftDelete(id) {
        console.log(this.state.drafts[id].id)
        let gotten = JSON.parse(localStorage.getItem("smstequser"));
        // let token = gotten.data.access;
        this.setState({ deletingDraftTitle: this.state.drafts[id].title });
        this.setState({ deletingDraftMessage: this.state.drafts[id].message });
        this.setState({ deletingDraftId: this.state.drafts[id].id });

        // document.getElementById("deletingDraftTitle").value = this.state.drafts[id].title;
        // document.getElementById("deletingDraftMessage").value = this.state.drafts[id].message;
        // document.getElementById("deletingDraftId").value = this.state.drafts[id].id;

    }
    //end load single draft for delete


    handleChangeName = event => {
        this.setState({ title: event.target.value });
    }

    handleChangeMessage = event => {
        this.setState({ newcharactersTotal: event.target.textLength });
        if (event.target.textLength % 160 != 0) {
            this.setState({ newsmsTotal: Math.floor(event.target.textLength / 160) + 1 })
        } else {
            this.setState({ newsmsTotal: Math.floor(event.target.textLength / 160) })
        }
        this.setState({ message: event.target.value });
    }

    handleEditChangeName = event => {
        this.setState({ title: event.target.value });
        this.forceUpdate();
    }

    handleEditChangeMessage = event => {
        // if (event.target.textLength > 0) {
        //     let err = document.getElementById("noMessageError");
        //     err.classList.add("d-none");
        //   }
        //set Length of the SMS Value
        this.setState({ editcharactersTotal: event.target.textLength });
        if (event.target.textLength % 160 != 0) {
            this.setState({ editsmsTotal: Math.floor(event.target.textLength / 160) + 1 })
        } else {
            this.setState({ editsmsTotal: Math.floor(event.target.textLength / 160) })
        }

        this.setState({ message: event.target.value });
        this.forceUpdate();
    }

    handleSetDraftId = event => {
        this.setState({ draftId: event.target.value });
        this.forceUpdate();
    }
    //create a new Draft
    submitNewDraft = event => {
        event.preventDefault();

        let gotten = JSON.parse(localStorage.getItem("smstequser"));
        let token = gotten.data.access;
        let id = gotten.data.id;
        const draft = {
            "title": this.state.title,
            "message": this.state.message,
            "owner": id
        }
        // console.log(id)
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }
        this.setState({ newDraftLoading: true });

        $('#newDraftError').fadeOut();
        axios.post(Variables.apiURL + 'api/v1/templates/', draft, { headers: headers })
            .then(res => {
                // console.log(res);
                // console.log(res.data);
                this.setState({ newDraftLoading: false });
                if (res.status == 201) {
                    $('#newDraftSuccess').fadeIn();
                    setTimeout(function () {
                        window.location.href = "/templates";
                    }, 1500);
                    this.forceUpdate();
                }
                else {
                    this.setState({ newDraftError: "Something went wrong, Please try again" });
                    $('#newDraftError').fadeIn();
                    console.log('error');
                }
            },
                error => {
                    this.setState({ newDraftError: "Something went wrong, Please try again" });
                    $('#newDraftError').fadeIn();
                    this.setState({ newDraftLoading: false });
                }
            )
    }
    // create new draft end

    // submit edited draft
    submitEditedDraft = event => {
        event.preventDefault();
        //let id = this.state.oneContact.id;
        let gotten = JSON.parse(localStorage.getItem("smstequser"));
        let token = gotten.data.access;
        let userid = gotten.data.id;
        // console.log(gotten.data);
        let draftId = document.getElementById("draftId").value;
        // console.log(draftId);
        const updatedDraft = {
            "title": document.getElementById("editName").value,
            "message": document.getElementById("editMessage").value,
            "owner": userid,
        }
        // console.log(userid)
        // console.log(draftId)
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }
        $('#editDraftError').hide();
        this.setState({ editDraftLoading: true });
        axios.put(Variables.apiURL + 'api/v1/api/v1/templates/' + draftId, updatedDraft, { headers: headers })
            .then(res => {
                this.setState({ editDraftLoading: false });
                // console.log(res);
                // console.log(res.data);
                if (res.status == 200) {
                    $('#editDraftSuccess').show();
                    setTimeout(function () {
                        window.location.href = "/templates";
                    }, 1000);
                    this.forceUpdate();
                }
                else {
                    this.setState({ editDraftError: "Something went wrong, Please try again" });
                    $('#editDraftError').show();
                    // console.log('error');
                }
            }, error => {
                this.setState({ editDraftLoading: false });
                this.setState({ editDraftError: "Something went wrong, Please try again" });
                $('#editDraftError').show();
            })
    }

    deleteDraft = event => {
        event.preventDefault();
        let gotten = JSON.parse(localStorage.getItem("smstequser"));
        let token = gotten.data.access;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }

        let draftid = this.state.deletingDraftId;
        this.setState({ deleteDraftLoading: true })
        axios.delete(Variables.apiURL + 'api/v1/api/v1/templates/' + draftid, { headers: headers })
            .then(response => {
                // console.log(response);
                this.setState({ deleteDraftLoading: false });
                if (response.status == 204) {
                    this.setState({ deletingDrafts: response.data });
                    window.location.href = "/templates";
                }
            })
    }

    componentDidMount() {
        this.getDrafts();
    }

    closeDeleteDraftModal = () => {
        document.getElementById("closedeleteDraft").click();
    }

    render() {
        const displayNone = { display: 'none' };
        let closeDeleteDraftModal = this.closeDeleteDraftModal;
        let deletingDraftTitle = this.state.deletingDraftTitle;
        let deletingDraftMessage = this.state.deletingDraftMessage;
        let newcharactersTotal = this.state.newcharactersTotal;
        let newsmsTotal = this.state.newsmsTotal;
        let editcharactersTotal = this.state.editcharactersTotal;
        let editsmsTotal = this.state.editsmsTotal;

        return (
            <div>
                <Header title="SMS Drafts"></Header>
                <Sidebar></Sidebar>
                <div class="content-body">
                    <div class="container-fluid">
                        <div class="row ml-2 mr-0">
                            <div class="col-12 pr-2 pt-4">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title"></h4>
                                        <a href="javascript:void(0)" data-toggle="modal" data-target="#newDraftModal" type="button" class="btn btn-outline-primary text-nowrap btn-sm">New Draft</a>
                                    </div>
                                    {this.state.draftsLoading ?
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

                                            {this.state.drafts.length > 0 ?

                                                <div class="card-body">
                                                    <div class="table-responsive col-12">
                                                        <table id="example3" class="table card-table display dataTablesCard" defaultPageSize={10}
                                                            showPaginationBottom >
                                                            <thead>
                                                                <tr>
                                                                    <th>Name</th>
                                                                    <th>Message</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    this.state.drafts
                                                                        .map((draft, index) =>
                                                                            <tr>
                                                                                <td class="pr-5" >{draft.title}</td>
                                                                                <td class="pr-5" >{draft.message}</td>
                                                                                <td>
                                                                                    {<div class="d-flex ">
                                                                                        <a onClick={() => this.getDraftEdit(index)} href="javascript:void(0)" data-toggle="modal" data-target="#editDraftModal"
                                                                                            class="btn btn-primary shadow btn-xs sharp mr-1"><i class="fa fa-pencil"></i></a>
                                                                                        <a onClick={e => this.getDraftDelete(index)} href="javascript:void(0)" class="btn btn-danger shadow btn-xs sharp" data-toggle="modal" data-target="#deleteDraftModal">
                                                                                            <i class="fa fa-trash"></i></a>
                                                                                    </div>}
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
                                                    You do not have any saved drafts!!!.
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* New Draft Modal */}
                <div class="modal fade " id="newDraftModal">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">New Draft SMS</h5>
                                <button type="button" class="close" data-dismiss="modal"><span>&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form id='newDraftSms' onSubmit={this.submitNewDraft}>
                                    <div class="form-group">
                                        <div class="card">
                                            <label className="mb-1 text-Black">
                                                <strong>Name</strong>
                                            </label>
                                            <div class="input mb-3 input-warning-o ">
                                                <div class="input ">
                                                    <span class="input-text"></span>
                                                </div>
                                                <input type="text" maxLength="20" class="form-control dull-border" id='name' onChange={this.handleChangeName} />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mt-3 mb-4"><strong>Type your Message Below</strong></label>
                                        <div class="card">
                                            <textarea id="draftMessageBody" className="form-control dull-border" rows="5" onChange={this.handleChangeMessage}>

                                            </textarea>
                                        </div>
                                        <div>{newcharactersTotal} characters <span className="pull-right">{newsmsTotal} SMS</span></div>


                                        <span style={{ color: "red" }}></span>
                                        <br />
                                    </div>
                                    <div className="alert alert-danger" id='newDraftError' style={displayNone} role="alert">{this.state.newDraftError}
                                    </div>
                                    <div id='newDraftSuccess' className="alert alert-success" style={displayNone} role="alert">
                                        <strong>Success! </strong> The draft was created.
                                    </div>
                                    <div class="form-group">
                                        <div class="text-center mt-4">
                                            <button type="submit" class="btn bg-primary text-white btn-block"> {this.state.newDraftLoading ?
                                                <span>Loading...</span>
                                                :
                                                <span>Submit</span>
                                            }</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* New Draft End */}

                {/* Edit Draft Modal */}
                <div class="modal fade" id="editDraftModal">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Edit Draft SMS</h5>
                                <button type="button" class="close" data-dismiss="modal"><span>&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form id='editDraftSms' onSubmit={this.submitEditedDraft}>
                                    <div class="form-group">
                                        <div class="card">
                                            <input type="hidden" maxLength="20" class="form-control dull-border " id='draftId' onChange={this.handleSetDraftId}></input>
                                            <label className="mb-1 text-Black">
                                                <strong>Name</strong>
                                            </label>
                                            <div class="input mb-3 input-warning-o ">
                                                <div class="input ">
                                                    <span class="input-text"></span>
                                                </div>
                                                <input type="text" maxLength="20" class="form-control dull-border" id='editName' onChange={this.handleEditChangeName} />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mt-3 mb-4"><strong>Type your Message Below</strong></label>
                                        <div class="card">
                                            <textarea id="editMessage" className="form-control dull-border" rows="5" onChange={this.handleEditChangeMessage}>

                                            </textarea>
                                        </div>
                                        <div>{editcharactersTotal} characters <span className="pull-right">{editsmsTotal} SMS</span></div>
                                        <span className="text-red d-none" id="noMessageError"><strong>Error! </strong> The Message cannot be blank</span>
                                        <span style={{ color: "red" }}></span>
                                        <br />
                                    </div>
                                    <div className="alert alert-danger" id='editDraftError' style={displayNone} role="alert">{this.state.editDraftError}
                                    </div>
                                    <div id='editDraftSuccess' className="alert alert-success" style={displayNone} role="alert">
                                        <strong>Success! </strong> The draft was edited successfully.
                                    </div>
                                    <div class="form-group">
                                        <div class="text-center mt-4">
                                            <button type="submit" class="btn bg-primary text-white btn-block">
                                                {this.state.editDraftLoading ?
                                                    <span>Editing...</span>
                                                    :
                                                    <span>Submit</span>
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Edit Draft End*/}

                {/* Delete Draft Modal */}
                <div class="modal fade " id="deleteDraftModal">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header p-4">
                                <h5 class="modal-title">Delete Draft</h5>
                                <button id='closedeleteDraft' type="button" class="close" data-dismiss="modal">
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="form-group">
                                        <div class="card background-dark">
                                            <label className="p-3 mb-1  text-warning">You are about to delete this draft <strong class="input-text">"{deletingDraftTitle}"</strong>

                                            </label>
                                            <label className="p-3 mb-1 text-Black">Message: <strong class="input-text">"{deletingDraftMessage}"</strong>

                                            </label>

                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6" onClick={closeDeleteDraftModal}>
                                            <div class="form-group">
                                                <div class="text-center mt-4">
                                                    <button type="button" class="btn btn-dark btn-block">Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6" onClick={this.deleteDraft}>
                                            <p id='deleteDraftid' class="d-none"></p>
                                            <div class="form-group">
                                                <div class="text-center mt-4">
                                                    <button type="button" class="btn bg-primary text-white btn-block">
                                                        {
                                                            this.state.deleteDraftLoading ?
                                                                <span>Deleting...</span>
                                                                :
                                                                <span>Delete</span>
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="alert alert-danger" id='createGroupFail' style={displayNone} role="alert">
                                        Failed, Try again
                                    </div>
                                    <div id='createGroupSuccess' className="alert alert-success" style={displayNone} role="alert">
                                        <strong>Success! </strong>Group Created Successfully.
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/*  Delete Draft End */}
            </div >

        );
    }
}

Templates.propTypes = {};

Templates.defaultProps = {};

export default Templates;