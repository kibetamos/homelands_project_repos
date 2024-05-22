import React, { Component } from 'react';
import Header from '../_Layouts/Header/Header';
import Sidebar from '../_Layouts/Sidebar/Sidebar';

export class SendMessage extends Component {
    render() {

        return (
            <div>
                <Header title="Send Message"></Header>
                <Sidebar></Sidebar>
                <div class="content-body">
                    <div class="container-fluid">
                        <body className="h-100 mt-5">
                            <div class="row justify-content-center h-100 align-items-center">
                                <div class="col-xl-6 col-lg-6">
                                    <div class="card">
                                        <div class="card-header">
                                            <h4 class="card-title">Send SMS</h4>
                                        </div>
                                        <div class="card-body">
                                            <div class="basic-form">
                                                <form>
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
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </body>
                    </div>
                </div>
            </div >
        );
    }
}

SendMessage.propTypes = {};

SendMessage.defaultProps = {};

export default SendMessage;