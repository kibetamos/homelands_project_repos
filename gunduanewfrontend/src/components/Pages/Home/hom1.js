import React, { useState, forwardRef, useRef, useImperativeHandle, useEffect } from "react";
import PropTypes from 'prop-types';

import styles from './Home.module.css';
import Header from '../../_layouts/Headers/Headers';
import Sidebar from '../../_layouts/Sidebar/Sidebar';
import Footer from '../../_layouts/Footers/Footers';
import $ from 'jquery';
import axios from 'axios';
import { Variables } from '../../_utils/GlobalVariables';
import Moment from 'moment';
let gotten = JSON.parse(localStorage.getItem("gunduauser"));

let UserDetails = gotten.data
// console.log (UserDetails.key)


const Home = () => {
 
  Moment.locale('en');
  const[items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const[isLoading, setIsLoading] = useState(true);

  //Retrieve cases from the database
  // useEffect(() => {
	// 	var axios = require("axios").default;

  //   const fetchItems = async () => {
	// 		var axios = require("axios").default;
  //     setIsLoading(true)
  //     // const result = await axios(`http://127.0.0.1:8000/fulltext/cases/${query}`)
  //     // const result = await axios(`http://192.168.10.12:5000/files/`)
	// 		var result = {
  //       method: 'GET',
  //       url: `http://192.168.10.12:5000/files/`,
  //       headers: {Authorization: 'Token ' +(UserDetails.key)}
  //     };
	// 		axios.request(result).then(function (result) {

  //     console.log(result.data);
	// 		setItems(result.data.results)
  //     // setItems(fullSearchUrl.data)
	// 	}).catch(function (error) {
	// 		console.error(error);
	// 	});
  //     setIsLoading(false)
  //   }
  //   fetchItems()
  // },[])
  return (
    
    <div className={styles.Home} data-testid="Home">

      <Header title="Dashboard"></Header>
      <Sidebar  ></Sidebar>

<div class="content-body">
		
			<div class="container-fluid">
				
				{/* <div class="modal fade" id="addOrderModalside">
					<div class="modal-dialog" role="document">
						<div class="modal-content">
							<div class="modal-header">
								<h5 class="modal-title">Add Event</h5>
								<button type="button" class="close" data-dismiss="modal"><span>&times;</span>
								</button>
							</div>
							<div class="modal-body">
				
							</div>
						</div>
					</div>
				</div> */}
				<div class="row">
					<div class="col-xl-3 col-xxl-4">
						<div class="row">
							
							<div class="col-xl-12 col-md-6">
								<div class="card">
									<div class="card-header border-0 pb-0">
										<h4 class="fs-20">Latest Docs Uploads</h4>
										<a href="http://localhost:3000/Docs">
                                    <button  type="button" class="btn btn-primary mb-2 raise_button" data-toggle="modal" data-target=".bd-example-modal-lg" >Upload</button></a>
                                    </div>

									
									<div class="card-body pb-0 dz-scroll height530 loadmore-content"
										id="latestSalesContent">
											{items.map((item) =>( 
										<div class="pb-3 mb-3 border-bottom">
										
											<p class="font-w600">
											{/* <a href={"/Case?id="+item._id} */}
												<a href={"/files?id="+item.id} class="text-black">{item.id}</a></p>
											<div class="d-flex align-items-end">
												{/* <img src="" alt="" width="42"
													class="rounded-circle mr-2"/> */}
												<div class="mr-auto">
													<h4 class="fs-14 mb-0"><a href="app-profile.html"
															class="text-black"dateFormat="DMY">{item.file.substr(40)}</a></h4>
													{/* <span class="fs-12">{item.timestamp}</span> */}
												</div>
												{/* <span class="badge badge-sm light badge-primary">4 Ticket</span> */}
											</div>
										</div>
										))}
									</div>
									  
								</div>
							</div>
						</div>
					</div>
					
					<div class="col-xl-9 col-xxl-8">
						<div class="row">
							<div class="card-body">
                                
							{/* <div class="col-xl-12">
								<div class="card">
									<div class="card-header border-0 pb-sm-0 pb-5">
										<div class="card-body">
										<h4 class="fs-20">Links to External Databases</h4>
                                coming soon
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
							</div> */}
                            </div>
														<div class="col-lg-4 col-sm-6">
								{/* <div class="card">
									<div class="card-body">
										<div class="media align-items-center">
											<span class="mr-4">
												<svg width="51" height="31" viewBox="0 0 51 31" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path fill-rule="evenodd" clip-rule="evenodd" d="M49.3228 0.840214C50.7496 2.08096 50.9005 4.24349 49.6597 5.67035L34.6786 22.8987C32.284 25.6525 28.1505 26.0444 25.281 23.7898L19.529 19.2704C18.751 18.6591 17.6431 18.7086 16.9226 19.3866L5.77023 29.883C4.3933 31.1789 2.22651 31.1133 0.930578 29.7363C-0.365358 28.3594 -0.299697 26.1926 1.07723 24.8967L13.4828 13.2209C15.9494 10.8993 19.7428 10.7301 22.4063 12.8229L28.0152 17.2299C28.8533 17.8884 30.0607 17.774 30.7601 16.9696L44.4926 1.1772C45.7334 -0.249661 47.8959 -0.400534 49.3228 0.840214Z" fill="#FE634E"/>
												</svg>
											</span>
											<div class="media-body ml-1">
												<p class="mb-2">Customer</p>
												<h3 class="mb-0 text-black font-w600">109,511</h3>
											</div>
										</div>
									</div>
								</div> */}
							</div>
							{/* <div class="col-xl-12">
								<div class="card">
									<div class="card-header border-0 pb-sm-0 pb-5">
										<h4 class="fs-20">Recent Event List</h4>
										
									</div>
									<div class="card-body">
										<div class="event-bx owl-carousel">
											
											
											
										</div>
									</div>
								</div>
							</div> */}
						</div>
					</div>
					
				</div>
			</div>
			
		</div>
		 <Footer></Footer>
    </div>
	
  )
};

Home.propTypes = {};

Home.defaultProps = {};

export default Home;