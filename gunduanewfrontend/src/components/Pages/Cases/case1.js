import React, { useState, useEffect } from "react";
import axios from 'axios';

 
// let gotten = JSON.parse(localStorage.getItem("gunduauser"));
// let token = gotten.data.access;


const Case1 = () => {
  const [metas, setMetas] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [judgement, setJudgement] = useState('');
  const [relatedCases, setRelatedCases] = useState([]);
  const [relatedCaseDetails, setRelatedCaseDetails] = useState(null);
  const[items, setItems] = useState([]);
  const [summary, setSummary] = useState("");
  const [id, setid]= useState("")
  const [id1, setid1] = useState("")
  let gotten = JSON.parse(localStorage.getItem("gunduauser"));
  let token = gotten.data.access;
  const [judgment, setJudgment] = useState("");
  

  // const getSummary = () => {
    
  //   fetch(`http://192.168.10.12:5000/cases/summary/${judgement}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setSummary(data.summary);

  //       //console.log(data); // log the response data to the console
  //     })
  //     .catch((error) => console.log(error));
  // };
// const 
// remove_slash = judgement.replace('/', '');
// async function getSummary(){

//   var axios = require("axios").default;

//   // Remove forward slash from judgement variable
//   var judgementWithoutSlash = judgement.replace("/", "");

//   var ca = {
//     method: 'GET',
//     url: `http://192.168.10.12:5000/cases/summary/${judgementWithoutSlash}`,
//     headers: {
//       'Authorization': "Bearer " + token,
//     }
//   };
//   console.log(ca);
//   axios.request(ca).then(function (ca) {
//     // console.log(ca);
//     setSummary(ca.Object)  
//   }).catch(function (error) {
//     console.error(error);
//   });
// }

async function getSummary(id){
  // console.log(url)
  var axios = require("axios").default;

  var result1 = 
  {
    method: 'GET',
    url:`http://192.168.10.12:5000/cases/summary/${id}`,
    headers: {'Authorization': "Bearer " + token}
  };

  axios.request(result1).then(function (result1) {
        console.log(result1);
        setSummary(result1.data.summary)
      }).catch(function (error) {
        console.error(error);
      });
    
  // setSummary(result.data.summary)
  // console.log(result);
}


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    var respo = {
      method: 'GET',
      url: `http://192.168.10.12:5000/cases/${id}`,
      // headers: {
      //   'Authorization': "Bearer " + token,
      // }
  };



  console.log(respo);
  axios.request(respo).then(function (respo) {
    console.log(respo.data)
    console.log(respo.data._id)
    // console.log(response);

        setMetas(respo.data.meta_info);
        setid1(respo.data._id);
        setJudgement(respo.data.judgement);
        setRelatedCases(respo.data.related_cases);
        setIsLoading(false); 
  })

      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (relatedCases.length > 0) {
      let relatedCaseRequests = relatedCases.map((relatedCase) => {
        return axios.get(`http://192.168.10.12:5000/cases/${relatedCase}`);
      });
      Promise.all(relatedCaseRequests)
        .then((results) => {
          console.log(relatedCaseRequests);
          console.log(results.map((r) => r.data));
          // setRelatedCaseDetails(results.map((r) => r.data));
          setItems(results.map((r) => r.data));
          console.log("Parties of Related Cases:", relatedCaseDetails.map((d) => d.parties_info));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [relatedCases]);


  const shortenValue = (value) => {
    return value.length > 205 ? value.substring(0, 200) + '...' : value;
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div class="header">
        <div class="header-content">
          <nav class="navbar navbar-expand">
            <div class="collapse navbar-collapse justify-content-between">
              <div class="header-left">
                <div class="dashboard_bar">Case Details</div>
              </div>
            </div>
          </nav>
        </div>
      </div>

      <div class="content-body">
  <div class="container-fluid">
    <div class="row">
      {/* <div class="page-titles">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="/search">Case</a></li>
          <li class="breadcrumb-item active"><a href="javascript:void(0)">CaseDetails</a></li>
        </ol>
      </div> */}
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-xl-12 col-lg-12  col-md-12 col-xxl-12 col-sm-12">
                <div class="product-detail-content">
                  <div class="new-arrival-content pr">
                    <div class="col-lg-12">
                      <div class="card">
                        <div class="card-header">
                          <h4 class="card-title" align="center">METAINFO</h4>
                        </div>
                        <div class="card-body">
                          <div class="table-responsive">
                            <table class="table table-bordered table-responsive-sm">
                              <tbody>
                                {Object.entries(metas).map(([key, value]) => (
                                  <tr key={key}>
                                    <td>{key}</td>
                                    <td>{shortenValue(value)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="input-group-append justify-content-end">
  <button type="button" class="btn btn-primary" onClick={() => getSummary(id1)}>Summary</button>
</div>
<div class="card-header">
                      <h4 class="card-title">Summary of the Judgement</h4>
                    </div>
                    <p class="text-content"> {summary}</p>
{/* <p className="mt-3">
          <strong>Summary:</strong> 
          
        </p>  */}

                    <div class="card-header">
                      <h4 class="card-title">JUDGEMENT</h4>
                    </div>
                    <p class="text-content">{judgement}</p>
                  </div>
             
      
                  <div >
                
                  <h3>Related Cases:</h3><h6>About : {items.length} results</h6>
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
                        <p class="card-text">Tags:&nbsp;&nbsp;
                                    {/* <span class="badge badge-success light">{item.related_cases}</span> */}
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
          </div>
                  {/* <div class="related-cases">
                    
                    <ul>
                      {relatedCases.map((relatedCase) => (
                        <li key={relatedCase}>
                          <a href={`/case?id=${relatedCase}`}>
                            <h4>{relatedCase}</h4>
                          </a>
                          <p>
                            <strong>Court:</strong> {relatedCase}
                          </p>
                          <p>
                            <strong>Year:</strong> {relatedCase.year}
                          </p>
                          
                        </li>
                      ))}
                    </ul>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* <Footer /> */}
</div>
</div>
  )
};

Case1.propTypes = {};

Case1.defaultProps = {};

export default Case1;