import React, { useState, forwardRef, useRef, useImperativeHandle, useEffect } from "react";
import PropTypes from 'prop-types';
import Header from '../../_layouts/Headers/Headers';
import Sidebar from '../../_layouts/Sidebar/Sidebar';
import Footer from '../../_layouts/Footers/Footers';
import $ from 'jquery';
import axios from 'axios';
import { Variables } from '../../_utils/GlobalVariables';
import Moment from 'moment';


const Case1 = () => {
  const [posts, setPosts] = useState([]);
  const[items, setItems] = useState([]);
  const[metas, setMetas] = useState([]);
  const[keys, setKeys] = useState([]);
  const[values, setValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const[isLoading, setIsLoading] = useState(true);
  const[query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const[itemsPerPage] = useState(6);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true)
      // const result = await axios(`http://127.0.0.1:8000/fulltext/cases/${query}`)

    let params = new URLSearchParams(window.location.search);
    let id = params.get('id');
    const result = await axios('http://192.168.10.12:5000/files/'+id)
    //  console.log(result.data)
    //  console.log(result.data.meta_info)
           setItems(result.data)
        //    setMetas(result.data.meta_info)
        //    setKeys(Object.keys(metas))
        //    setValues(Object.values(metas))
          //  items 
          // let entries= Object.entries(metas);
          // console.log(keys.length);
      // setItems(fullSearchUrl.data)
      setIsLoading(false)
  //     i=0;
  // for (i = 0; i < keys.length; i++)
  // {
  //     console.log(keys);
  // }
    }
    fetchItems()
//     for (const [key, value] of Object.entries(meta_info)) {
//       console.log(key + ": " + value)
// }
let keys = Object.keys(metas);
// console.log('Keys ', keys);

  let vals  = Object.values(metas);
  // console.log('Vals ', vals);

  })   
// const fruits = entries;
// let fLen = entries.length;

// let text = "<ul>";
// for (let i = 0; i < fLen; i++) {
//   text += "<li>" + fruits[i] + "</li>";
// }
// text += "</ul>";
  return (
    <div>
       
     <Header title="Overview"></Header>
      <Sidebar  ></Sidebar>
      <div class="header">
            <div class="header-content">
                <nav class="navbar navbar-expand">
                    <div class="collapse navbar-collapse justify-content-between">
                        <div class="header-left">
                            <div class="dashboard_bar">
								Case Details
                            </div>
                        </div>
                        
                    </div>
                </nav>
            </div>
        </div>
      <div class="content-body">
            <div class="container-fluid">
      <div class="modal fade" id="addOrderModalside">
					<div class="modal-dialog" role="document">
						<div class="modal-content">
							<div class="modal-header">
								<h5 class="modal-title">Add Event</h5>
								<button type="button" class="close" data-dismiss="modal"><span>&times;</span>
								</button>
							</div>
							<div class="modal-body">
								<form>
									<div class="form-group">
										<label class="text-black font-w500">Event Name</label>
										<input type="text" class="form-control"/>
									</div>
									<div class="form-group">
										<label class="text-black font-w500">Event Date</label>
										<input type="date" class="form-control"/>
									</div>
									<div class="form-group">
										<label class="text-black font-w500">Description</label>
										<input type="text" class="form-control"/>
									</div>
									<div class="form-group">
										<button type="button" class="btn btn-primary">Create</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
    <div class="row">
    <div class="page-titles">
					<ol class="breadcrumb">
						<li class="breadcrumb-item"><a href="javascript:void(0)">Layout</a></li>
						<li class="breadcrumb-item active"><a href="javascript:void(0)">CaseDetails</a></li>
					</ol>
                </div>
    <div class="col-lg-12">
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-xl-3 col-lg-6  col-md-6 col-xxl-5 ">
                        
                    </div>
                    
                    <div class="col-xl-9 col-lg-6  col-md-6 col-xxl-7 col-sm-6">
                        <div class="product-detail-content">
                            
                            <div class="new-arrival-content pr">
                                {/* <h4>{key[0]}</h4> */}
                                {/* <div class="comment-review star-rating">
          <ul>
            <li><i class="fa fa-star"></i></li>
            <li><i class="fa fa-star"></i></li>
            <li><i class="fa fa-star"></i></li>
            <li><i class="fa fa-star-half-empty"></i></li>
            <li><i class="fa fa-star-half-empty"></i></li>
          </ul>
          <span class="review-text">(34 reviews) / </span><a class="product-review" href=""  data-toggle="modal" data-target="#reviewModal">Write a review?</a>
        </div> */}
        <div>
        <div>
             
    </div>

</div>
        <div class="d-table mb-2">
        {/* {metas.map( () => (
            {metas}
          ))
        } */}
          {/* <p class="price float-left d-block">$325.00</p> */}
                                </div>
                                {/* <p> CAT: <span class="item"> {items.resolved_charges} &nbsp;&nbsp; {items.resolved_acts} <i
                                            class="fa fa-shopping-basket"></i></span>
                                </p> */}
                                {/* <p>Product code: <span class="item">0405689</span> </p>
                                <p>Brand: <span class="item">Lee</span></p> */}
                                {/* <p>Tags:&nbsp;&nbsp; */}
                                    {/* <span class="badge badge-success light">{items.resolved_charges}</span> */}
                                    {/* <span class="badge badge-success light">{items.resolved_charges} </span>
                                    <span class="badge badge-success light">{items.resolved_acts}</span> */}
                                    {/* <span class="badge badge-success light">clothes</span>
                                    <span class="badge badge-success light">shoes</span>
                                    <span class="badge badge-success light">dresses</span> */}
                                {/* </p> */}
                            {/* <td>May 27,2018</td> */}
                            <div class="col-lg-12">
                        <div class="card">
                        <div class="card-header">
                                <h4 class="card-title" align="center">METAINFO</h4>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-bordered table-responsive-sm">
                                        {/* <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                                <th>Price</th>
                                            </tr>
                                        </thead> */}
                                        <tbody>
                                            <tr>
                                                <td>{keys[0]}</td>
                                                <td>{values[0]}</td>
                                            </tr>
                                            <tr>
                                                <td>{keys[1]}</td>
                                                <td>{values[1]}</td>
                                            </tr>
                                            <tr>
                                                <td>{keys[2]}</td>
                                                <td>{values[2]}</td>
                                            </tr>
                                            <tr>
                                                <td>{keys[3]}</td>
                                                <td>{values[3]}</td>
                                            </tr>
                                            <tr>
                                                <td>{keys[4]}</td>
                                                <td>{values[4]}</td>
                                            </tr>
                                            <tr>
                                                <td>{keys[5]}</td>
                                                <td>{values[5]}</td>
                                            </tr>
                                            <tr>
                                                <td>{keys[6]}</td>
                                                <td>{values[6]}</td>
                                            </tr>
                                            <tr>
                                                <td>{keys[7]}</td>
                                                <td>{values[7]}</td>
                                            </tr>
                                            <tr>
                                                <td>{keys[8]}</td>
                                                <td>{values[8]}</td>
                                            </tr>
                                            <tr>
                                                <td>{keys[9]}</td>
                                                <td>{values[9]}</td>
                                            </tr>
                                            <tr>
                                                <td>{keys[10]}</td>
                                                <td>{values[10]}</td>
                                            </tr>
                                            <tr>
                                                <td>{keys[11]}</td>
                                                <td>{values[11]}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                             {/* <p class="text-content">{keys[0]}:{values[0]}</p>
                             <p class="text-content">{keys[1]}:{values[1]}</p>
                             <p class="text-content">{keys[2]}:{values[2]}</p>
                             <p class="text-content">{keys[3]}:{values[3]}</p>
                             <p class="text-content">{keys[4]}:{values[4]}</p> */}
                            </div>
                            
                            <p class="text-content">
                            <div class="card-header">
                                <h4 class="card-title">JUDGEMENT</h4>
                            </div>
                              {items.judgement}</p>
                        </div>
                        <p>Product code: <span class="item">0405689</span> </p>
                                <p>Related: <span class="item">{items.related_cases}</span></p> 
                                <p>Categories:&nbsp;&nbsp;
                                    <span class="badge badge-success light">{items.resolved_charges}</span>
                                    <span class="badge badge-success light">{items.resolved_charges} </span>
                                    <span class="badge badge-success light">{items.resolved_acts}</span> 
                                     {/* <span class="badge badge-success light">clothes</span>
                                    <span class="badge badge-success light">shoes</span>
                                    <span class="badge badge-success light">dresses</span>  */}
                                </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

{/* <div class="modal fade" id="reviewModal">
<div class="modal-dialog" role="document">
<div class="modal-content">
<div class="modal-header">
  <h5 class="modal-title">Review</h5>
  <button type="button" class="close" data-dismiss="modal"><span>&times;</span>
  </button>
</div>
<div class="modal-body">
  
</div>
</div>
</div>
</div> */}
</div>
</div>
</div>
</div>
  )
}

export default Case1