import React, { useState, forwardRef, useRef, useImperativeHandle, useEffect } from "react";
import PropTypes from 'prop-types';
import styles from '../../Pages/Home/Home.module.css';
import Header from '../../_layouts/Headers/Headers';
import Sidebar from '../../_layouts/Sidebar/Sidebar';
import Footer from '../../_layouts/Footers/Footers';
import $ from 'jquery';
import axios from "axios";
import { Variables } from '../../_utils/GlobalVariables';
import Spinner from "./Spinner";
import * as ReactBoostrap from 'react-bootstrap';
import Moment from 'moment';


const Summaries = ( {isLoading} ) => {
  const[query, setQuery] = useState("");
  // const [results, setResults] = useState([])
  const[items, setItems] = useState([]);
  const[categories, setCategories] = useState([]);
  const[item, setItem] = useState([]);
  const[files, setFiles] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);



  let gotten = JSON.parse(localStorage.getItem("gunduauser"));
  let token = gotten.data.access;
  // let id = gotten.data.id;
  //       console.log(id)


async function getResult(){
 
    var axios = require("axios").default;

      var options = {
        method: 'GET',
        url: `http://192.168.10.12:5000/cases/similar/`+selectedFile.summary +"/",
        
        headers: {
          'Authorization': "Bearer " + token,
        }
      };
      console.log(options);
      axios.request(options).then(function (options) {
        console.log(options.data);
        setItems(options.data)
      }).catch(function (error) {
        console.error(error);
      });
  }
    const onButton = (e) => {
      e.preventDefault();
      getResult();
    }


    async function search_by_category(itemname){
 
      var axios = require("axios").default;
  
        var cats = {
          method: 'GET',
          url: `http://192.168.10.12:5000/cases/category/`+itemname +"/",
          headers: {
            'Authorization': "Bearer " + token,
          }
        };
        // console.log(options);
        axios.request(cats).then(function (cats) {
          console.log(cats.data);
          setCategories(cats.data)  
        }).catch(function (error) {
          console.error(error);
        });
    }
const [id, setid]= useState("") 
const [summary, setSummary] = useState("")

// const url = `http://192.168.10.12:5000/summary/${id}`;

var axios = require("axios").default;

async function getSummary(){
  // console.log(url)
  var axios = require("axios").default;

  var result = 
            {
              method: 'GET',
              url:`http://192.168.10.12:5000/summary/${id}`,
              headers: {'Authorization': "Bearer " + token}
            };

  axios.request(result).then(function (result) {
        console.log(result.data);
        setSummary(result.data.summary)
        
      }).catch(function (error) {
        console.error(error);
      });
    
  setSummary(result.data.summary)
  // console.log(result);
}
  const onSubmit = (e) => {
    e.preventDefault();
    getSummary();
  }


  async function getSummary1(id){
    // console.log(url)
    var axios = require("axios").default;
  
    var result = 
    {
      method: 'GET',
      url:`http://192.168.10.12:5000/summary/${id}/`,
      headers: {'Authorization': "Bearer " + token}
    };
  
    axios.request(result).then(function (result) {
          console.log(result.data);
          setSummary(result.data.summary)
        }).catch(function (error) {
          console.error(error);
        });
      
    // setSummary(result.data.summary)
    // console.log(result);
  }
    //load single draft by id for edit

  const getSummaryEdit = (id, f) => {

      // Get the form fields and bind the data to be edited
  const summaryId = document.getElementById("summaryId");
  summaryId.value = f.id;

  const summaryName = document.getElementById("summaryName");
  summaryName.value = f.name;

  const editSummary = document.getElementById("editSummary");
  editSummary.value = f.summary;
  
  document.getElementById("editSummarybtn").addEventListener("submit", (event) => {
    event.preventDefault();

     // Get the updated data from the form fields
     const updatedSummary = {
      id: summaryId,
      name : summaryName.value,
      summary: editSummary.value
    
    };

    // Validate the data
if (!updatedSummary.message) {
  document.getElementById("noMessageError").classList.remove("d-none");
  return;
}
document.getElementById("noMessageError").classList.add("d-none");



});
};

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
        fetch('http://192.168.10.12:5000/files/'+ id +"/",
            {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'content-Type': 'application/json',
                    'Authorization': "Bearer " + token,
                }
            })
            .then(response => {
              if (!response.ok) {
                throw new Error(response.statusText);
            } else if (response.status === 204) {
                setFiles(files.filter(f => f.id !== id));
                alert("Deleted successfully");
                // return response.json();
            } else {
              return response.json();
          }
          // )
          //   .then(responseData => {
          //     setFiles(files.filter(f => f.id !== id));
          //     alert("Deleted successfully");
          })
          .catch(err => {
            console.log(err);
            alert("Error deleting data: " + err);
        });
    }
};

//Retrieve cases from the database
useEffect(() => {
  
  const fetchFiles = async () => {
    var axios = require("axios").default;
    // setIsLoading(true)
    const files = {
      method: 'GET',
      url: 'http://192.168.10.12:5000/files/',
      headers: {
        'Authorization': "Bearer " + token}    
    
    };
    console.log(files)
    axios.request(files).then(function (files) {
    // const result = await axios(`http://127.0.0.1:8000/fulltext/cases/${query}`)
    // const files = await axios(`http://192.168.10.12:5000/files/`)
    console.log(files.data.results)
    setFiles(files.data.results)
    // setItems(fullSearchUrl.data)
    setLoading(false);
  }).catch(function (error) {
    console.error(error);
  });
}
  fetchFiles()
},[] )

const handleViewSummary = (file) => {
  setSelectedFile(file);
  setShowModal(true);
};

const handleClose = () => {
  setShowModal(false);
};

// const { files } = props;

Moment.locale('en');

  return isLoading ? (<Spinner />) :(
    <div className={styles.Summaries} data-testid="Summaries">

      <Header title="Summaries"></Header>
      <Sidebar  ></Sidebar>
        <div class="container-fluid">
      <div class="content-body">
     
          
          <div class=" ">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="javascript:void(0)">Summaries</a></li>
              {/* <li class="breadcrumb-item active"><a href="javascript:void(0)">Blank</a></li> */}
              
            </ol>
            
          </div>
                                    {/* <!-- Large modal --> */}
                                    {/* <div class="raise_button">
                                    <button type="button" class="btn btn-primary mb-2 raise_button" data-toggle="modal" data-target=".bd-example-modal-lg">Summarize Text</button>&ensp;&ensp;&ensp;&ensp; 
                                    <a href="http://localhost:3000/Docs">
                                      <button  type="button" class="btn btn-primary mb-2 raise_button" data-toggle="modal" data-target=".bd-example-modal-lg" >See Documents</button></a>

                                    </div> */}
                                    <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true">
                                        <div class="modal-dialog modal-lg">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title">Summarize Text</h5>
                                                    <button type="button" class="close" data-dismiss="modal"><span>&times;</span>
                                                    </button>
                                                </div>
                                                <div class="modal-body">
                                                <div class="basic-form">
                                    <form onSubmit={onSubmit}>
                                    <div class="input-group mb-3" >
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">ID</span>
                                            </div>
                                            <input type="text"
                                            placeholder="Enter ID" 
                                            autoComplete="Off" value={id}
                                            onChange={(e) => setid(e.target.value)} 
                                            class="form-control"/>
                                            <button type="submit" class="btn btn-primary">Summary</button>
                                        </div>
                                        
                                        <div class="card">
                                            {/* <textarea className="form-control dull-border" rows="5"> */}
                                            {summary}
                                            {/* </textarea> */}
                                        </div>
								
                 {/* <input type="text"  value={summary}/> */}
                
                  
									<div class="input-group-append">
                  <div class="modal-footer">
                                                    {/* <button type="button" class="btn btn-danger light" data-dismiss="modal">Close</button> */}
                                                    <button type="button" class="btn btn-primary" onClick={getResult}>Similar cases</button>
                                                </div>
                                 
							</div>

                                    </form>
                                </div>
                                                  </div>
                                                
//////////////////START//////////////////////////////////////////
//////////////////////////////////////////////////////////////////END////////////////////
<div class="row">
          {items.map((item) => (
            // <Case1 key={item._id} item={item}></Case1>
            // <p> {item.meta_info['Date Delivered']}</p>
            <div class="col-xl-6">
              <div class="card">
                <div class="card-body">
                  <div class="row m-b-30">
                    <div class="col-md-12 col-xx l-12">
                      <div class="new-arrival-content position-relative">
                      <div class="card-header">
                      <h4>
                        <a href={"/Case?id="+item._id}>
                          {/* {item.meta_info['Parties']} */}
                { item.meta_info['Parties '].substring(0,70) ? `${item.meta_info['Parties ']}` : 
                `${item.meta_info['Parties '].substring(0,70)}...`} 
                </a>
                </h4> 
                </div>
                <div class="card-body">
                        <p class="card-title">Judge(s): <span class="item">{item.meta_info['Judge(s) ']}<i class="fa fa-check-circle text-success"></i></span></p>
                        <p class="card-title">Citation: <span class="item">{item.meta_info['Citation']}</span> </p>
                        <p class="card-title">County: <span class="item">{item.meta_info['County']}</span></p>
                        <p class="card-title">Date: <span class="item">{item.meta_info['Date Delivered ']}</span></p>
                        {/* <p class="text-content"></p> */}
                        <p class="card-text">Category(s):&nbsp;&nbsp;
                                    <span class="badge badge-success light">{ }</span>
                                    <span class="badge badge-success light">{item.resolved_acts}</span>
                                    <span class="badge badge-success light">{item.resolved_charges}</span>
                                </p>
                                </div>
                                <div class="card-footer border-0 pt-0">
                                {/* <p class="card-text d-inline">Date: <span class="item">{item.meta_info['Date Delivered ']}</span></p> */}
                                <a class="card-link float-right">Judge(s): {item.meta_info['Judge(s) ']}</a>
                            </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>

        ))}
            
        
            <div class="modal fade" id="reviewModal">
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
            </div>
          </div>
                                                  
                                                <div class="modal-footer">
                                                    {/* <button type="button" class="btn btn-danger light" data-dismiss="modal">Close</button> */}
                                                    <button type="button" class="btn btn-danger light" data-dismiss="modal">Close</button>
                                                    <button type="button" class="btn btn-primary">Save changes</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
 {/* // EDit summary modal  */}
 <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true">
                                        <div class="modal-dialog modal-lg">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title">Summarize Text</h5>
                                                    <button type="button" class="close" data-dismiss="modal"><span>&times;</span>
                                                    </button>
                                                </div>
                                                <div class="modal-body">
                                                <div class="basic-form">
                                    <form onSubmit={onSubmit}>
                                    <div class="input-group mb-3" >
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">ID</span>
                                            </div>
                                            <input type="text"
                                            placeholder="Enter ID" 
                                            autoComplete="Off" value={id}
                                            onChange={(e) => setid(e.target.value)} 
                                            class="form-control"/>
                                            <button type="submit" class="btn btn-primary">Summary</button>
                                        </div>
                                    
                
								
                 <input type="text"  value={summary}/>
                
                  
									<div class="input-group-append">
                  <div class="modal-footer">
                                                    {/* <button type="button" class="btn btn-danger light" data-dismiss="modal">Close</button> */}
                                                    <button type="button" class="btn btn-primary" onClick={getResult}>Similar cases</button>
                                                </div>
                                 
							</div>

                                    </form>
                                </div>
                                                  </div>
                                                

<div class="row">
          {items.map((item) => (
            // <Case1 key={item._id} item={item}></Case1>
            // <p> {item.meta_info['Date Delivered']}</p>
            <div class="col-xl-6">
              <div class="card">
                <div class="card-body">
                  <div class="row m-b-30">
                    <div class="col-md-12 col-xx l-12">
                      <div class="new-arrival-content position-relative">
                      <div class="card-header">
                      <h4>
                        <a href={"/Case?id="+item._id}>
                          {/* {item.meta_info['Parties']} */}
                { item.meta_info['Parties '].substring(0,70) ? `${item.meta_info['Parties ']}` : 
                `${item.meta_info['Parties '].substring(0,70)}...`} 
                </a>
                </h4> 
                </div>
                <div class="card-body">
                        <p class="card-title">Judge(s): <span class="item">{item.meta_info['Judge(s) ']}<i class="fa fa-check-circle text-success"></i></span></p>
                        <p class="card-title">Citation: <span class="item">{item.meta_info['Citation']}</span> </p>
                        <p class="card-title">County: <span class="item">{item.meta_info['County']}</span></p>
                        <p class="card-title">Date: <span class="item">{item.meta_info['Date Delivered ']}</span></p>
                        {/* <p class="text-content"></p> */}
                        <p class="card-text">Category(s):&nbsp;&nbsp;
                                    <span class="badge badge-success light">{item.related_cases}</span>
                                    <span class="badge badge-success light">{item.resolved_acts}</span>
                                    <span class="badge badge-success light">{item.resolved_charges}</span>
                                </p>
                                </div>
                                <div class="card-footer border-0 pt-0">
                                {/* <p class="card-text d-inline">Date: <span class="item">{item.meta_info['Date Delivered ']}</span></p> */}
                                <a class="card-link float-right">Judge(s): {item.meta_info['Judge(s) ']}</a>
                            </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>

        ))}
            
        
            <div class="modal fade" id="reviewModal">
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
            </div>
          </div>
                                                  
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-danger light" data-dismiss="modal">Close</button>
                                                    <button type="button" class="btn btn-primary">Save changes</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

  {/* edit draft modal */}
                                    <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true" id="editSummaryModal">
                                        <div class="modal-dialog modal-lg">
                                            <div class="modal-content">
                                            <div class="modal-header">
                                <h5 class="modal-title">Edit Summary</h5>
                                
                                <button type="button" class="close" data-dismiss="modal"><span>&times;</span>
                                </button>
                            </div>
                                                <div class="modal-body">
                                                <div class="basic-form">
                                                <form id='editDraftSms' >
                                    <div class="form-group">
                                        <div class="card">
                                            <input type="hidden" maxLength="20" class="form-control dull-border "id='summaryId'></input>
                                            <label className="mb-1 text-Black">
                                                <strong>Name</strong>
                                            </label>
                                            <div class="input mb-3 input-warning-o ">
                                              
                                                <div class="input ">
                                                    <span class="input-text"></span>
                                                </div>
                                                <input type="text" maxLength="20" class="form-control dull-border" id='editSummary'/>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mt-3 mb-4"><strong>Edit Summary Below</strong></label>
                                        <div class="card">
                                            <textarea id="editMessage" className="form-control dull-border" rows="5">
                                            {/* {f.name} */}
                                            </textarea>
                                        </div>
                                        <div> characters <span className="pull-right"> SUMMARY</span></div>
                                        <span className="text-red d-none" id="noMessageError"><strong>Error! </strong> The Message cannot be blank</span>
                                        <span style={{ color: "red" }}></span>
                                        <br />
                                    </div>
                                    {/* <div className="alert alert-danger" id='editDraftError'  role="alert">
                                    </div> */}
                                    {/* <div id='editDraftSuccess' className="alert alert-success"role="alert">
                                        <strong>Success! </strong> The draft was edited successfully.
                                    </div> */}
                                    <div class="form-group">
                                        <div class="text-center mt-4">
                                            {/* <button type="submit" class="btn bg-primary text-white btn-block">
                                                {this.state.editDraftLoading ?
                                                    <span>Editing...</span>
                                                    :
                                                    <span>Submit</span>
                                                }
                                            </button> */}
                                        </div>
                                    </div>
                                </form>
                                </div>
                                                  </div>
                                                <div class="modal-footer">
                                                    {/* <button type="button" class="btn btn-danger light" data-dismiss="modal">Close</button> */}
                                                    <button type="button" class="btn btn-primary">Save changes</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>  
                                                    
          {/* end of edit moadal */}

          {/* view summary modal*/}
          {/* {files.map((f =>(
          <tr key={f.id} >
             
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true" id="viewSummaryModal" onHide={handleClose}>
                                        <div class="modal-dialog modal-lg">
                                            <div class="modal-content">
                                            <div class="modal-header">
                                <h5 class="modal-title"> View Summary</h5>
                                <button type="button" class="close" data-dismiss="modal"><span>&times;</span>
                                </button>
                            </div>
                                                <div class="modal-body">
                                                <div class="basic-form">
                                                <form>
                                    <div class="form-group">
                                        <div class="card background-dark">
                                            <label className="p-3 mb-1 text-Black">This is the Summary<strong class="input-text"></strong>
                                            <td>{f.summary}</td>
                                            </label>
                                            {/* <label className="">Message:<strong class="input-text"></strong>
                                            
                                            </label> */}

                                        {/* </div>
                                    </div>
                                </form>
                                </div>
                                                  </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-danger light" onClick={handleClose} data-dismiss="modal">Close</button>
                                                    <button type="button" class="btn btn-primary">Save changes</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>                   
          {/* end of view summay  moadal */}


          {/* View summary modal */}
      {selectedFile && (
        <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true" id="viewSummaryModal" onHide={handleClose}>
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">View Summary</h5>
                <button type="button" class="close" data-dismiss="modal" onClick={handleClose}>
                  <span>&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div class="basic-form">
                  <form>
                    <div class="form-group">
                      <div class="card background-dark">
                        <label className="p-3 mb-1 text-Black">
                          This is the Summary
                          <strong class="input-text"></strong>
                        </label>
                        <p>{selectedFile.summary}</p>
                      </div>


                      {/* <textarea
                    className="form-control"
                    value={selectedFile.text}
                    onChange={(event) => {
                      const newText = event.target.value;
                      <p>{selectedFile.summary}</p>
                    }}
                    rows={8} // set the number of rows to 8
                    cols={60}
                  /> */}



                    </div>
                  </form>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger light" onClick={handleClose}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

{selectedFile && (
        <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true" id="viewSummaryModal1" onHide={handleClose}>
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">View Summary</h5>
                <button type="button" class="close" data-dismiss="modal" onClick={handleClose}>
                  <span>&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div class="basic-form">
                  <form>
                    <div class="form-group">
                      <div class="card background-dark">
                        <label className="p-3 mb-1 text-Black">
                          This is the Summary
                          <strong class="input-text"></strong>
                        </label>
                        <p>{selectedFile.summary}</p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div class="modal-footer">
                {/* <button type="button" class="btn btn-danger light" onClick={handleClose}>
                  Close
                </button>
                <button type="button" class="btn btn-danger light" onClick={handleClose}>
                  Close
                </button>
                <button type="button" class="btn btn-danger light" onClick={handleClose}>
                  Close
                </button> */}
                <div class="d-flex justify-content-center">

                <button type="button" class="btn btn-primary" onClick={getResult}>Similar cases</button>
                </div>
              </div>
              <div >
              <p>About : {items.length} results</p>
              <div class="row">
          {items.map((item) => (
            // <Case1 key={item._id} item={item}></Case1>
            // <p> {item.meta_info['Date Delivered']}</p>
            <div class="col-xl-6">
              <div class="card">
                <div class="card-body">
                  <div class="row m-b-30">
                    <div class="col-md-12 col-xx l-12">
                      <div class="new-arrival-content position-relative">
                      <div class="card-header">
                      <h4>
                        <a href={"/Case?id="+item._id}>
                          {/* {item.meta_info['Parties']} */}
                { item.meta_info['Parties '].substring(0,70) ? `${item.meta_info['Parties ']}` : 
                `${item.meta_info['Parties '].substring(0,70)}...`} 
                </a>
                </h4> 
                </div>
                <div class="card-body">
                        <p class="card-title">Judge(s): <span class="item">{item.meta_info['Judge(s) ']}<i class="fa fa-check-circle text-success"></i></span></p>
                        <p class="card-title">Citation: <span class="item">{item.meta_info['Citation']}</span> </p>
                        <p class="card-title">County: <span class="item">{item.meta_info['County']}</span></p>
                        <p class="card-title">Date: <span class="item">{item.meta_info['Date Delivered ']}</span></p>
                        {/* <p class="text-content"></p> */}
                        
                        <p class="card-text">Category(s):
                                  <button onClick={() => search_by_category(item.related_cases)}><span class="badge badge-success light">{item.related_cases}</span></button>
                                  <button onClick={() => search_by_category(item.resolved_acts)}><span class="badge badge-success light">{item.resolved_acts}</span></button>
                                  <button onClick={() => search_by_category(item.resolved_charges)}><span class="badge badge-success light">{item.resolved_charges}</span></button>
                                </p>
                                </div>
                                <div class="card-footer border-0 pt-0">
                                {/* <p class="card-text d-inline">Date: <span class="item">{item.meta_info['Date Delivered ']}</span></p> */}
                                <a class="card-link float-right">Judge(s): {item.meta_info['Judge(s) ']}</a>
                            </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>

        ))}
            
        
            <div class="modal fade" id="reviewModal">
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
            </div>
          </div>
          </div>
            </div>
          </div>
        </div>
      )}

                                    {loading && 
  <div class="spinner-border text-primary" role="status">
    <span class="sr-only">Loading...</span>
  </div>
}
{!loading && 
  <div class="card">
    <table class="table table-responsive-md">
      <thead>
        <tr>
          {/* <th class="width80">ID</th> */}
          <th>NAME</th>
          <th>FILE</th>
          <th>SUMMARY</th>
          <th>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {files.map((f =>(
          <tr key={f.id} >
            {/* <td><strong>{f.id}</strong></td> */}
            <td>{f.remark}</td>
            <td>{f.file.slice(39)}</td>
            
            {f.summary ? (
    f.summary.length > 200 ? (
      <>
        {f.summary.substring(0, 200)}...
        <button
    className="btn btn-link p-0 m-0 ml-1"
    data-toggle="modal" 
    data-target="#viewSummaryModal" 
    onClick={() => handleViewSummary(f)}
  >
    View More
  </button>
      </>
    ) : (
      f.summary
    )
  ) : (
    <div style={{textAlign: 'center', fontWeight: 'bold'}}>
    No summary available.
  </div>
  )}
            <td>
              {/* <div class="dropdown">
                <button type="button" class="btn btn-success light sharp" data-toggle="dropdown">
                  <svg width="20px" height="20px" viewBox="0 0 24 24" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><rect x="0" y="0" width="24" height="24"/><circle fill="#000000" cx="5" cy="12" r="2"/><circle fill="#000000" cx="12" cy="12" r="2"/><circle fill="#000000" cx="19" cy="12" r="2"/></g></svg>
                </button> */}
                  
                <div class="d-flex ">
                <a data-toggle="modal" 
                onClick={() => getSummary1(f.id)}
                // title="Delete"
                class="btn btn-primary shadow btn-xs sharp mr-1"
                data-placement="top"
                  title="Get Summary">
                  <i class="fa fa-book"></i>
                  </a>
                <a data-toggle="modal" 
                data-target="#viewSummaryModal1" 
                onClick={() => handleViewSummary(f)}
                class="btn btn-primary shadow btn-xs sharp mr-1"
                title="More Actions">
                <i class="flaticon-381-eye-1"></i>
                </a>
                <a data-toggle="modal"
                data-target="#editSummaryModal"
                title="Edit"            
                  class="btn btn-primary shadow btn-xs sharp mr-1">
                    <i class="fa fa-pencil"></i>
                    </a>
                    <a onClick={() => handleDelete(f.id)} class="btn btn-danger shadow btn-xs sharp" data-toggle="modal"
                    title="Delete">
                    <i class="fa fa-trash"></i></a> 
                          </div>
            </td>
          </tr>
        )))} 
      </tbody>
    </table>
  </div>
}

                                    
      </div>
    </div>
    </div>
    
  )
};


Summaries.propTypes = {};

Summaries.defaultProps = {};

export default Summaries;