import React, { Component } from 'react';
import Header from '../_Layouts/Header/Header';
import Sidebar from '../_Layouts/Sidebar/Sidebar';
import axios from 'axios';

export class Payments extends Component {

    render() {
        return (
            <div>
                <Header title="Payments"></Header>
                <Sidebar></Sidebar>
                <div class="content-body">
                    <div class="container-fluid">
                        <div class="row ml-2 mr-0">
                            <div class="col-xl-12 pr-2 pt-4">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">Payments</h4>
                                        <a href="javascript:void(0)" type="button" class="btn btn-outline-primary text-nowrap btn-sm">Reports</a>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive col-12">
                                            <table id="example3" class="table card-table display dataTablesCard">
                                                <thead>
                                                    <tr>

                                                        <th>Payment Date</th>
                                                        <th  >Transaction Code</th>
                                                        <th>Amount Paid</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        <tr>
                                                            <td class="pr-2 " ></td>
                                                            <td class="pr-2" ></td>
                                                            <td class="pr-2" ></td>
                                                        </tr>

                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Payments.propTypes = {};

Payments.defaultProps = {};

export default Payments;