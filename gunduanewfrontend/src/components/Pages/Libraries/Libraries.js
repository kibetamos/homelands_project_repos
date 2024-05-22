import React, { useState, forwardRef, useRef, useImperativeHandle, useEffect } from "react";
import PropTypes from 'prop-types';
import styles from '../../Pages/Home/Home.module.css';

import Header from '../../_layouts/Headers/Headers';
import Sidebar from '../../_layouts/Sidebar/Sidebar';
import Footer from '../../_layouts/Footers/Footers';
import $ from 'jquery';
import axios from 'axios';
import { Variables } from '../../_utils/GlobalVariables';
import Moment from 'moment';

const Library = ({ item }) => {
    const[query, setQuery] = useState("");
  const [result, setResult] = useState([])
  

  async function getResult(){
    
    let query = document.getElementById('search').value;
    // console.log(query)
    const url = `http://192.168.10.12:5000/cases/text_search/`+query;
    var result = await axios.get(url);

    setResult(result.data.hits)
    console.log(result);
  }
    const onSubmit = (e) => {
      e.preventDefault();
      getResult();
    }
  Moment.locale('en');
  return (
    
    <div className={styles.Home} data-testid="Home">

      <Header title="Libraries"></Header>
      <Sidebar  ></Sidebar>

<div class="content-body">
		
			<div class="container-fluid">
				<div class="row">
					<div class="col-xl-12 col-xxl-12">
						<div class="row">
	
							<div class="col-xl-12">
								<div class="card">
									<div class="card-header border-0 pb-sm-0 pb-5">
										<div class="card-body">
                                
                                <div class="custom-tab-1">
                                    <ul class="nav nav-tabs">
                                        <li class="nav-item">
                                            <a class="nav-link active" data-toggle="tab" href="#home1"><i class="la la-home mr-2"></i> CommonWealth</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" data-toggle="tab" href="#profile1"><i class="la la-user mr-2"></i> African Library</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" data-toggle="tab" href="#contact1"><i class="la la-phone mr-2"></i>  World Library</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" data-toggle="tab" href="#message1"><i class="la la-envelope mr-2"></i> bailii.org</a>
                                        </li>
                                    </ul>
                                    <div class="tab-content">
                                        <div class="tab-pane fade show active" id="home1" role="tabpanel">
                                            <div class="pt-4">
                                                <h4>CommonWealth</h4>
                                                <p>
                                                    <b><a href="http://www.worldlii.org/" target="www.worldlii.org">CommonWealth</a></b>
                                                    </p>
                                            </div>
                                        </div>
                                        <div class="tab-pane fade" id="profile1">
                                            <div class="pt-4">
                                                <h4>African Library</h4>
                                                <p>
                                                    <b><a href="http://www.africanlii.org/" target="www.worldlii.org">African Library</a></b>
                                                    </p>
                                                
                                                
                                                
                                            </div>
                                        </div>
                                        <div class="tab-pane fade" id="contact1">
                                            <div class="pt-4">
                                                <h4>World Library</h4>
                                                <p>
                                                    <b><a href="http://www.worldlii.org/" target="www.worldlii.org">World Library</a></b>
                                                    </p>
                                            </div>
                                        </div>
                                        <div class="tab-pane fade" id="message1">
                                            <div class="pt-4">
                                                <h4>bailii.org</h4>
                                                <p>
                                                <p>
                                                </p>
                                                    <b><a href="http://www.bailii.org/form/search_cases.html" target="www.worldlii.org">bailii.org</a></b>
                                                    </p>
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
				</div>
			</div>
		</div>
    </div>
  )
};

Library.propTypes = {};

Library.defaultProps = {};

export default Library;