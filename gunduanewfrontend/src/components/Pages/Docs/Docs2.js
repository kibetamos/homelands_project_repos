import React, {useState,useEffect} from 'react';
import styles from '../../Pages/Home/Home.module.css';
import Header from '../../_layouts/Headers/Headers';
import Sidebar from '../../_layouts/Sidebar/Sidebar';
import axios from 'axios';

const Docs2 = (event) => {
  const [file, setFile] = useState();
  const[files, setFiles] = useState([]);
  const [remark, setRemark] = useState("");
  const [posts, setPosts] = useState([]);
  const[items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const[isLoading, setIsLoading] = useState(true);
  // const[query, setQuery] = useState('');
  const [query, setquery] = useState("") 
  const [currentPage, setCurrentPage] = useState(1);
  const[itemsPerPage] = useState(6);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFile, setCurrentFile] = useState({});
  // console.log("-------------------------------")

  let gotten = JSON.parse(localStorage.getItem("gunduauser"));
  let token = gotten.data.access;
  let id = gotten.data.id;
        console.log(id)
  // let gotten = JSON.parse(localStorage.getItem("gunduauser"));

  // let UserDetails = gotten.data
  // console.log (UserDetails.key)
  // const [id, setid]= useState("") 
  const [summary, setSummary] = useState("")


// This is to post a new doc to the databse
  // const newDoc =() => {

  //   var axios = require("axios").default;

  //   const uploadData = new FormData();
  //   uploadData.append('remark',remark);
  //   uploadData.append('file',file, file.name);
  //   console.log(remark);
  //   console.log(file);
  //   axios.post('http://192.168.10.12:5000/files/', uploadData, {
  //     headers: {
  //       'Authorization': "Bearer " + token,
  //       "Content-Type": "multipart/form-data"
  //     }
  //   })
  //   .then(res => console.log(res))
  //   .catch(error => console.log(error))
  // }

  const newDoc = () => {
    var axios = require("axios").default;
  
    // Check if the remark field has been changed
    if (!remark) {
      console.log("Remark field is empty");
      return;
    }
  
    const uniqueRemark = remark + "_" + Date.now();
  
    const uploadData = new FormData();
    uploadData.append("remark", uniqueRemark);
    uploadData.append("file", file, file.name);
    console.log(uniqueRemark);
    console.log(file);
    axios
      .post("http://192.168.10.12:5000/files/", uploadData, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => console.log(res))
      .catch((error) => console.log(error));
  };
  
  

  ////////////////////////////////////////////////////////////////


const fetchItems = async () => {    
  try {
    const result = await axios({
      method: 'GET',
      url: 'http://192.168.10.12:5000/files/',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log(result.data.results);
    setItems(result.data.results);
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  fetchItems();
}, []);

  async function getSummary(id){
    
    // console.log(url)
    var axios = require("axios").default;
  
    var result = 
    {
      method: 'GET',
      url:`http://192.168.10.12:5000/summary/${id}/`,
      'Authorization': "Bearer " + token
    };
  
    axios.request(result).then(function (result) {
          console.log(result.data);
          // setSummary(result.data.summary)
        }).catch(function (error) {
          console.error(error);
        });
      
    setSummary(result.data.summary)
    // console.log(result);
  }

  //  Do a summary of each document
const url = `http://192.168.10.12:5000/files/summary/${query}`;

async function getCases(){
  var result = await axios.get(url);
  // setCases(result.data.hits)
  console.log(result.data);
}
  const onSubmit = (e) => {
    e.preventDefault();
    getCases();
  }
  const handleUpdate = (id) => {
    const file = document.getElementById("file").file[0];
    const remark = document.getElementById("remark").value;

    let formData = new FormData();
    formData.append("file", file);
    formData.append("remark", remark);

    fetch(`http://192.168.10.12:5000/files/${id}`, {
        method: 'PUT',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .then(responseData => {
        setFiles(files.map(f => f.id === id ? {...f, file: responseData.file, remark: responseData.remark} : f));
        alert("Data updated successfully");
    })
    .catch(err => {
        console.log(err);
        alert("Error updating data: " + err);
    });
}

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      fetch('http://192.168.10.12:5000/files/'+ id +"/",
            {
                method: 'DELETE',
                headers: {
                  'Authorization': "Bearer " + token,
                  'Accept': 'application/json',
                  'content-Type': 'application/json'
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
          })
          .catch(err => {
            console.log(err);
            alert("Error deleting data: " + err);
        });
    }
};
  return (
    <div className={styles.Summaries} data-testid="Docs">

      <Header title="Documents"></Header>
      <Sidebar  ></Sidebar>
        <div class="container-fluid">
      <div class="content-body">
          <div class="card-footer border-0 pt-0">
          {/* <button type="button" ><p class="card-text d-inline">Card footer</p></button> */}
                             {/* <a href="javascript:void(0)" class="card-link float-right">Card link</a> */}
                             {/* <button type="button" ><p class="card-link float-right">Card footer</p></button>   */}
                            </div>
                                    {/* <!-- Large modal --> */}
                                    {/* <div class="raise_button">
                                    <button type="button" class="btn btn-primary mb-2 raise_button" data-toggle="modal" data-target=".bd-example-modal-lg">Upload</button>
                                    </div> */}
                                    {/* <a href="/summaries"><button  type="button" class="btn btn-primary mb-2 raise_button" >View Summaries</button></a> */}
                                    <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true">
                                        <div class="modal-dialog modal-lg">
                                            <div class="modal-content">
                                                {/* <div class="modal-header">
                                                    <h5 class="modal-title">Upload Text</h5>
                                                    <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                                                </div> */}
                                                
                                                
                                                <div class="modal-body">
                                                <div class="basic-form">
                                    {/* <form>
                                    <div class="input-group mb-3">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Name</span>
                                            </div>
                                            <input type="text" class="form-control" value={remark} onChange={(evt) =>setRemark(evt.target.value)}/>
                                        </div>
                                        <div class="input-group mb-3">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Upload</span>
                                            </div>
                                            <div class="custom-file">
                                                <input type="file" class="custom-file-input" onChange={(evt) =>setFile(evt.target.files[0])}/>
                                                <label class="custom-file-label">Choose file</label>
                                            </div>
                                            
                                        </div>
                                        <div class="input-group mb-3">      
								<div class="input-group">
									<textarea rows="6" cols="7"class="form-control" placeholder="Paste your message..."></textarea>
									<div class="input-group-append">
										<button type="button" class="btn btn-primary"><i class="fa fa-location-arrow"></i></button>
									</div>
                  </div> 

							</div>
              <div class="input-group mb-3">
              <div class="input-group">
									<textarea rows="14" cols="7"class="form-control" placeholder="View Summarized Text $ Edit "></textarea>
									<div class="input-group-append">
										
									</div>
                  </div>
							</div>
                                    </form> */}
                                </div>
                                                  </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-danger light" data-dismiss="modal">Close</button>
                                                    <button onClick={() => newDoc()} type="button" class="btn btn-primary">Save changes</button>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
        {/* <div class="raise_button">
            <button type="button"class="btn btn-primary">Summarize Text</button>
            </div> */}
            
            <div class="card">
            <table class="table table-responsive-md">
                                        <thead>
                                            <tr>
                                               <th class="width80">ID</th>
                                                <th>NAME</th>
                                                <th>File</th>
                                                <th>ACTIONS</th>
                                            </tr>
                                        </thead>
                                        {/* <tbody>
                                        
           {items.map((item) =>(
                                            <tr>
                                               
                                                <td>{item.remark}</td>
                                                <td>{item.file.substr(40)}</td>
                                                <td>

                                                <div class="d-flex ">
                               <a onClick={() => handleUpdate(item.id)} data-toggle="modal" data-target="#editDraftModal"
                                  class="btn btn-primary shadow btn-xs sharp mr-1"title="EDIT"><i class="fa fa-pencil"></i></a>
                              
                                   <a onClick={() => handleDelete(item.id)} class="btn btn-danger shadow btn-xs sharp" data-toggle="modal"
                    title="Delete">
                    <i class="fa fa-trash"></i></a> 
                          </div>
                       </td>
												
                               <td>
                             
										
												</td>
                                            </tr>
											
 ))}  
           

											
                                        </tbody> */}
                                    </table>
                                    </div>

                                    
      </div>
      
    </div>
    
    
    </div>
    
  )
}
export default Docs2;

