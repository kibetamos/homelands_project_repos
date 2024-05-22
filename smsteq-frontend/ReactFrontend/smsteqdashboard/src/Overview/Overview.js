import React, { Component } from 'react';
import Header from '../_Layouts/Header/Header';
import Sidebar from '../_Layouts/Sidebar/Sidebar';

export class Overview extends Component {
    render() {

        return (
            <div>
                <Header title="Overview"></Header>
                <Sidebar></Sidebar>
                <div class="content-body">
                    <div class="container-fluid">
                        <body className="h-100 mt-5">
                            <div class="row justify-content-center h-100 align-items-center">
                                <div class="col-xl-6 col-lg-6">
                                    <div class="card">
                                        <div class="card-header">
                                            <h4 class="card-title"> I am Under Construction!!!</h4>
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

Overview.propTypes = {};

Overview.defaultProps = {};

export default Overview;