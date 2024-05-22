import React, { Component } from 'react';
import Header from '../_Layouts/Header/Header';
import Sidebar from '../_Layouts/Sidebar/Sidebar';
import axios from 'axios';
import { MDBDataTableV5 } from 'mdbreact';
import { Variables } from '../_utils/GlobalVariables';
import $ from 'jquery';

export class BulkSms extends Component {
    state = { sms: [], message: '', date: '', clients_count: '', status: '', smsLoading: true, datatable: {}, showing_messages_list: {}, showing_messages_list: '', smsListLoading: false }

    //load all status 
    getSms() {
        let gotten = JSON.parse(localStorage.getItem("smstequser"));
        let token = gotten.data.access;
        let id = gotten.data.id;
        // console.log(token)
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }
        axios.get(Variables.apiURL + 'api/v1/api/v1/sms_status_summary/', { headers: headers })
            .then(res => {
                const sms = res.data.data;
                // console.log(sms);
                this.setState({ sms: sms });
                this.formatDatatableData(sms);
                // this.setState({ smsLoading: false });
            }, error => {
                this.setState({ smsLoading: false });
            })
    }

    handleRowClick = (i) => {
        // this.setState({ showing_messages_list: this.state.sms[i] }); 
        this.setState({ smsListLoading: true });
        document.getElementById("messagesGroupsList").classList.add("d-none");
        document.getElementById("messagesIndividualList").classList.remove("d-none");
        this.formatMessageListData(this.state.sms[i].data);
        var myDiv = document.getElementById('messagesIndividualList');
        // myDiv.scrollTop(0);
        $('body #messagesIndividualList').scrollTop(0);
    }

    //format list of individual messages
    formatMessageListData = (res) => {
        let rowobject = res;
        let listarray = []

        for (let i = 0; i < rowobject.length; i++) {
            let listobject = {}
            listobject['status'] = rowobject[i][4];
            listobject['sms'] = rowobject[i][2];
            listobject['number'] = rowobject[i][1];
            listarray.push(listobject);
        }

        this.setState({
            showing_messages_list:
            {
                columns: [
                    {
                        label: 'Message',
                        field: 'sms',
                        width: 100,
                    },
                    {
                        label: 'Phone Number',
                        field: 'number',
                        width: 100,
                    },
                    {
                        label: 'Status',
                        field: 'status',
                        width: 100,
                    }
                ],
                rows: listarray
            }
        })

        this.setState({ smsListLoading: false });
    }

    //format grouped messages
    formatDatatableData(res) {
        let rowobject = res;
        for (let i = 0; i < rowobject.length; i++) {
            let delivered = rowobject[i].delivered;
            let total = rowobject[i].data.length;
            rowobject[i].clickEvent = () => this.handleRowClick(i);
            rowobject[i]['status'] = delivered + ' of ' + total + ' delivered';
            rowobject[i]['action'] = <div>
                <a onClick={() => this.handleRowClick(i)} href="javascript:void(0)" data-toggle="modal" data-target="#editScheduleModal"
                    class="btn btn-primary shadow btn-sm sharp mr-1">
                    View
                </a>
            </div>
        }

        this.setState({
            datatable:
            {
                columns: [
                    {
                        label: 'Date',
                        field: 'Date',
                        width: 100,
                        attributes: {
                            'aria-controls': 'DataTable',
                            'aria-label': 'date',
                        },
                    },
                    {
                        label: 'Message',
                        field: 'Message',
                        width: 100,
                    },
                    {
                        label: 'Delivery Status',
                        field: 'status',
                        width: 100,
                    },
                    {
                        label: 'Action',
                        field: 'action',
                        width: 100,
                    }
                ],
                rows: rowobject
            }
        })

        this.setState({ smsLoading: false });
    }

    backBtnClick = () => {
        document.getElementById("messagesGroupsList").classList.remove("d-none");
        document.getElementById("messagesIndividualList").classList.add("d-none");
    }

    componentDidMount() {
        let self = this;
        self.getSms();
        setInterval(function () {
            self.getSms();
        }, 60000)
    }

    render() {
        let smsLoading = this.state.smsLoading;

        return (
            <div>
                <Header title="Messages"></Header>
                <Sidebar></Sidebar>
                <div class="content-body">
                    <div class="container-fluid">
                        {/* SMS List */}
                        <div class="col-12 pr-2 pt-4">

                            <div id="messagesGroupsList" class="card">
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
                                            <div class="bulk-sms-list">
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

                            <div id="messagesIndividualList" class="card d-none">
                                <div class="card-header">
                                    <h5 onClick={this.backBtnClick} class="card-title cursor-pointer"><i class="fa fa-arrow-left"></i> Back</h5>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive col-12">
                                        {this.state.smsListLoading ?
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
                                                    <MDBDataTableV5 hover entriesOptions={[5, 20, 25]} entries={5} pagesAmount={4} data={this.state.showing_messages_list} searchTop searchBottom={false} />
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

BulkSms.propTypes = {};

BulkSms.defaultProps = {};

export default BulkSms;