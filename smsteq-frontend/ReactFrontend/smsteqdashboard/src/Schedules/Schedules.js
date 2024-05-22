import React, { Component } from 'react';
import Header from '../_Layouts/Header/Header';
import Sidebar from '../_Layouts/Sidebar/Sidebar';
import axios from 'axios';
import { MDBDataTableV5 } from 'mdbreact';
import { Variables } from '../_utils/GlobalVariables';

export class Schedules extends Component {
    state = { sms: [], message: '', date: '', clients_count: '', status: '', smsLoading: true, datatable: {}, deleteScheduleLoading: false, deletingScheduleId: '', deletingScheduleMessage: '', deletingScheduleTime: '', editingScheduleId: '', editScheduleError: '', editScheduleLoading: false, }

    componentDidMount() {
        let self = this;
        self.getSchedule();
        setInterval(function () {
            self.getSchedule();
        }, 30000)
    }

    //load schedule list 
    getSchedule() {
        let gotten = JSON.parse(localStorage.getItem("smstequser"));
        let token = gotten.data.access;
        let id = gotten.data.id;
        //console.log(id)
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }
        axios.get(Variables.apiURL + 'api/v1/api/v1/schedule_sms/', { headers: headers })
            .then(res => {
                // console.log(res);
                let sms = res.data;
                this.setState({ smsLoading: false });
                this.setState({ sms: sms });
                this.formatDatatableData(sms);
            }, error => {
                this.setState({ smsLoading: false });
            })
    }

    formatDatatableData(res) {
        let rowobject = res;

        //Add edit buttons
        for (let i = 0; i < rowobject.length; i++) {
            rowobject[i]['action'] = <div> <a onClick={() => this.showEditSchedule(i)} href="javascript:void(0)" data-toggle="modal" data-target="#editScheduleModal"
                class="btn btn-primary shadow btn-xs sharp mr-1"><i class="fa fa-pencil"></i></a>
                <a onClick={e => this.showDeleteSchedule(i)} href="javascript:void(0)" class="btn btn-danger shadow btn-xs sharp" data-toggle="modal" data-target="#deleteScheduleModal">
                    <i class="fa fa-trash"></i></a></div>
        }
        // console.log(rowobject);

        this.setState({
            datatable:
            {
                columns: [
                    {
                        label: 'Date',
                        field: 'time',
                        width: 100,
                    },
                    {
                        label: 'Message',
                        field: 'sms',
                        width: 100,
                    },
                    {
                        label: 'Phone Numbers',
                        field: 'phone_numbers',
                        width: 100,
                    },
                    {
                        label: 'Action',
                        field: 'action',
                        width: 100,
                    },
                ],
                rows: rowobject
            }
        })

        this.setState({ smsLoading: false });
    }


    closeDeleteScheduleModal() {
        document.getElementById("closedeleteSchedule").click();
    }

    closeEditScheduleModal() {
        document.getElementById("closeEditSchedule").click();
    }

    //delete schedule
    deleteSchedule = () => {
        let gotten = JSON.parse(localStorage.getItem("smstequser"));
        let token = gotten.data.access;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }

        let self = this;
        let draftid = this.state.sms[this.state.deletingScheduleId].id;

        //hide errors
        document.getElementById('createGroupFail').classList.add('d-none');
        document.getElementById('createGroupSuccess').classList.add('d-none');

        //show loading status
        this.setState({ deleteScheduleLoading: true })
        axios.delete(Variables.apiURL + 'api/v1/api/v1/schedule_sms/' + draftid, { headers: headers })
            .then(response => {
                // console.log(response);
                this.setState({ deleteScheduleLoading: false });
                if (response.status == 204) {
                    this.setState({ deletingSchedules: response.data });
                    document.getElementById('createGroupFail').classList.add('d-none');
                    document.getElementById('createGroupSuccess').classList.remove('d-none');
                    this.getSchedule();
                    setTimeout(function () {
                        self.closeDeleteScheduleModal();
                    }, 1500);

                    // window.location.href = "/schedules";
                } else {
                    document.getElementById('createGroupSuccess').classList.add('d-none');
                    document.getElementById('createGroupFail').classList.remove('d-none');
                }
            }, error => {
                this.setState({ deleteScheduleLoading: false });
                document.getElementById('createGroupSuccess').classList.add('d-none');
                document.getElementById('createGroupFail').classList.remove('d-none');
            })
    }

    //edit schedule
    submitEditedSchedule = (e) => {
        e.preventDefault();
        let gotten = JSON.parse(localStorage.getItem("smstequser"));
        let token = gotten.data.access;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }

        let self = this;
        let scheduleid = this.state.sms[this.state.editingScheduleId].id;

        //hide errors
        document.getElementById('editScheduleError').classList.add('d-none');
        document.getElementById('editScheduleSuccess').classList.add('d-none');

        let schedule_date = document.getElementById("edit-schedule-date").value;
        let schedule_time = document.getElementById("edit-schedule-time").value;

        var selected_date = new Date(schedule_date + " " + schedule_time);
        var current_date = new Date();

        //if no complete date is selected
        if (schedule_date == "" || schedule_time == "") {
            this.setState({ editScheduleError: "Enter a valid date" })
            document.getElementById("editScheduleError").classList.remove("d-none");
            return;
        } else {
            document.getElementById("editScheduleError").classList.add("d-none");
        }

        //if selected time has passed
        if (selected_date.getTime() < current_date.getTime()) {
            this.setState({ editScheduleError: "The time you selected has already passed" })
            document.getElementById("editScheduleError").classList.remove("d-none");
            return;
        } else {
            document.getElementById("editScheduleError").classList.add("d-none");
        }

        //show loading status
        this.setState({ editScheduleLoading: true });

        let payload = this.state.sms[this.state.editingScheduleId];
        payload['time'] = schedule_date + "T" + schedule_time;

        // console.log(payload);

        axios.put(Variables.apiURL + 'api/v1/schedule_sms/' + scheduleid + '/', payload, { headers: headers })
            .then(response => {
                // console.log(response);
                this.setState({ editScheduleLoading: false });
                if (response.status == 200) {
                    this.setState({ deletingSchedules: response.data });
                    document.getElementById('editScheduleError').classList.add('d-none');
                    document.getElementById('editScheduleSuccess').classList.remove('d-none');
                    this.getSchedule();
                    setTimeout(function () {
                        self.closeEditScheduleModal();
                    }, 1500);

                    // window.location.href = "/schedules";
                } else {
                    document.getElementById('editScheduleSuccess').classList.add('d-none');
                    this.setState({ editScheduleError: "Something went wrong. Please try again" });
                    document.getElementById('editScheduleError').classList.remove('d-none');
                }
            }, error => {
                console.log(error);
                this.setState({ editScheduleLoading: false });
                this.setState({ editScheduleError: "Something went wrong. Please try again" })
                document.getElementById('editScheduleSuccess').classList.add('d-none');
                document.getElementById('editScheduleError').classList.remove('d-none');
            })
    }

    showDeleteSchedule = (i) => {
        let txt = this.state.sms[i].sms;
        let time = this.state.sms[i].time;
        this.setState({ deletingScheduleId: i });
        this.setState({ deletingScheduleMessage: txt });
        this.setState({ deletingScheduleTime: time });
    }

    showEditSchedule = (i) => {
        let txt = this.state.sms[i].sms;
        let time = this.state.sms[i].time;
        this.setState({ editingScheduleId: i });
        this.setState({ deletingScheduleMessage: txt });
        this.setState({ deletingScheduleTime: time });
    }

    render() {
        let smsLoading = this.state.smsLoading;
        let deletingScheduleMessage = this.state.deletingScheduleMessage;
        let deleteScheduleLoading = this.state.deleteScheduleLoading;
        let deletingScheduleTime = this.state.deletingScheduleTime;

        return (
            <div>
                <Header title="Messages"></Header>
                <Sidebar></Sidebar>

                {/* Edit Schedule Modal */}
                <div class="modal fade" id="editScheduleModal">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Edit Schedule</h5>
                                <button id='closeEditSchedule' type="button" class="close" data-dismiss="modal"><span>&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form id='editScheduleSms' onSubmit={this.submitEditedSchedule}>
                                    <div class="form-group">
                                        <div class="card background-dark">
                                            <label className="pt-3 pl-3 pr-3 text-warning">You are editing this SMS Schedule:
                                            </label>
                                            <label className="pt-3 pl-3 pr-3 text-Black"> <strong class="input-text"><span>Message: </span></strong>{deletingScheduleMessage}
                                            </label>
                                            <label className="p-3 text-Black"> <strong class="input-text"><span>Date: </span></strong>{deletingScheduleTime}
                                            </label>
                                        </div>
                                    </div>
                                    <div id="schedule-selector-wrapper" className="row mb-4">
                                        <div className="col-md-6">
                                            <label className="schedule-txt">Date</label>
                                            <input class="form-control" type="date" id="edit-schedule-date" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="schedule-txt">Time</label>
                                            {/* <input class="form-control" type="time" /> */}
                                            <select className="form-control" id="edit-schedule-time">
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

                                    <div className="alert d-none alert-danger" id='editScheduleError' role="alert">{this.state.editScheduleError}
                                    </div>
                                    <div id='editScheduleSuccess' className="alert alert-success d-none" role="alert">
                                        <strong>Success! </strong> The schedule was edited successfully.
                                    </div>
                                    <div class="form-group">
                                        <div class="text-center mt-4">
                                            <button type="submit" class="btn bg-primary text-white btn-block">
                                                {this.state.editScheduleLoading ?
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
                {/* Edit Schedule End*/}


                {/* Delete Schedule Modal */}
                <div class="modal fade " id="deleteScheduleModal">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header p-4">
                                <h5 class="modal-title">Delete Schedule</h5>
                                <button id='closedeleteSchedule' type="button" class="close" data-dismiss="modal">
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="form-group">
                                        <div class="card background-dark">
                                            <label className="p-3 mb-1  text-warning">You are about to delete this SMS Schedule
                                            </label>
                                            <label className="p-3 mb-1 text-Black"><strong class="input-text"><span>Message: </span> </strong>{deletingScheduleMessage}
                                            </label>
                                            <label className="p-3 mb-1 text-Black"><strong class="input-text"><span>Date: </span> </strong>{deletingScheduleTime}
                                            </label>
                                        </div>
                                    </div>
                                    <div className="alert alert-danger d-none" id='createGroupFail' role="alert">
                                        Failed, Try again
                                    </div>
                                    <div id='createGroupSuccess' className="alert alert-success d-none" role="alert">
                                        <strong>Success! </strong>Schedule Deleted Successfully.
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6" onClick={this.closeDeleteScheduleModal}>
                                            <div class="form-group">
                                                <div class="text-center mt-4">
                                                    <button type="button" class="btn btn-dark btn-block">Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6" onClick={this.deleteSchedule}>
                                            <p id='deleteScheduleid' class="d-none"></p>
                                            <div class="form-group">
                                                <div class="text-center mt-4">
                                                    <button type="button" class="btn bg-primary text-white btn-block">
                                                        {
                                                            deleteScheduleLoading ?
                                                                <span>Deleting...</span>
                                                                :
                                                                <span>Delete</span>
                                                        }
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
                {/*  Delete Schedule End */}

                <div class="content-body">
                    <div class="container-fluid">
                        {/*    <div class="row ml-2 mr-0">
                            <div class="col-xl-12 pr-2 pt-4">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">SMS</h4>
                                        <a href="javascript:void(0)" type="button" class="btn btn-primary text-nowrap btn-sm">Reports</a>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive col-12">
                                            <table id="example3" class="table card-table display dataTablesCard">
                                                <thead>
                                                    <tr>

                                                        <th>Date</th>
                                                        <th  >Message</th>
                                                        <th>Clients Count</th>
                                                        <th>Delivery Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.sms
                                                            .map((sms, index) =>
                                                                <tr>
                                                                    <td class="pr-2 " >{sms.date}</td>
                                                                    <td class="pr-2" >{sms.message}</td>
                                                                    <td class="pr-2" >{sms.clients_count}</td>
                                                                    <td class="pr-2" >{sms.status}</td>
                                                                </tr>
                                                            )
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* SMS List */}
                        <div class="col-12 pr-2 pt-4">

                            <div class="card">
                                {/* <div class="card-header">
                                    <h4 class="card-title">Messages </h4>
                                    <a href="javascript:void(0)" data-toggle="modal" data-target="#newContactModalside" type="button" class="btn btn-outline-primary text-nowrap btn-sm">Reports</a>
                                </div> */}
                                <div class="card-body">


                                    <div class="table-responsive col-12">
                                        {smsLoading ?
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


                                                {this.state.sms.length > 0 ?

                                                    <MDBDataTableV5 hover entriesOptions={[5, 20, 25]} entries={20} pagesAmount={4} data={this.state.datatable} searchTop searchBottom={false} />
                                                    :
                                                    <div>
                                                        You have not sent any messages yet!!!
                                                    </div>
                                                }
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* SMS List */}
                    </div>
                </div>
            </div>
        );
    }
}

Schedules.propTypes = {};

Schedules.defaultProps = {};

export default Schedules;