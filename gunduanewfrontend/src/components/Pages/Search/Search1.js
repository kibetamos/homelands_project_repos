import React, { useState, forwardRef, useRef, useImperativeHandle, useEffect } from "react";
import PropTypes from 'prop-types';
import styles from '../../Pages/Home/Home.module.css';
import Home2 from "../Home/Home2";
import Header from '../../_layouts/Headers/Headers';
// import Header from "../../_layouts/Headers/Headers";
import Sidebar from '../../_layouts/Sidebar/Sidebar';
import Footer from '../../_layouts/Footers/Footers';
import $ from 'jquery';
import axios from 'axios';
import { Variables } from '../../_utils/GlobalVariables';
import Moment from 'moment';
const Search = () => {
  const[query, setQuery] = useState("");
  const [result, setResult] = useState([])
  const[items, setItems] = useState([])
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(false);
  const[isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const[itemsPerPage] = useState(6);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategoryData, setSelectedCategoryData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

 
  let gotten = JSON.parse(localStorage.getItem("gunduauser"));
  let token = gotten.data.access;
  
  // async function search_by_category(itemname){
 
  //   var axios = require("axios").default;

  //     var cats = {
  //       method: 'GET',
  //       url: `http://192.168.10.12:5000/cases/category/`+itemname +"/",
  //       headers: {
  //         'Authorization': "Bearer " + token,
  //       }
  //     };
  //     // console.log(options);
  //     axios.request(cats).then(function (cats) {
  //       console.log(cats.data);
  //       setCategories(cats.data)  
  //     }).catch(function (error) {
  //       console.error(error);
  //     });
  // }


  async function getResult(){
    let query = document.getElementById('search').value;
    // console.log(query)
    // const url = `http://192.168.10.12:5000/cases/fulltext/`+query;
    const capitalizedQuery = query.charAt(0).toUpperCase() + query.slice(1);

    const url = `http://192.168.10.12:5000/cases/category/${capitalizedQuery}`;


    var result = await axios.get(url);
    
    // const data = await result.json();
    console.log(result);
    // console.log(result.data.hits)
    setItems(result.data);

    if (!result.data.length) {
      console.log('No results found');
    } else {
    console.log(result.data.length);

  }
};




// function searchCategory(category) {
//   const url = `http://192.168.10.12:5000/cases/category/${category}`;
//   // Perform search using API

// }
 
const getCategories = async () => {    
  try {
    const cat = await axios({
      method: 'GET',
      url: 'http://192.168.10.12:5000/cases/all_cat',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log(cat.data);


    setCategories(cat.data);
  } catch (error) {
    console.error(error);
  }



}
async function search_by_category(category){
 
  var axios = require("axios").default;

    var ans = {
      method: 'GET',
      url: `http://192.168.10.12:5000/cases/category/`+category +"/",
      headers: {
        'Authorization': "Bearer " + token,
      }
    };
    console.log(ans);
    axios.request(ans).then(function (ans) {
      console.log(ans.data);
      setCats(ans.data)  
    }).catch(function (error) {
      console.error(error);
    });
}



    const onSubmit = (e) => {
      
      e.preventDefault();
      
      setResult();
    };
    function handleCategoryChange(event) {
      setSelectedCategory(event.target.value);
    }

  Moment.locale('en');
  return (
    
    <div className={styles.Summaries} data-testid="Docs">

        {/* <Header title="Search"></Header> */}
      
      
      <div>
      {/*  Nav header start */}
      <div className="nav-header">
        <a href="/" className="brand-logo">
          <img className="logo-abbr" src="./images/gundualogo.png" alt="" />
          <img className="logo-compact" src="./images/gunduatext.png" alt="" />
          <img className="brand-title" src="./images/gunduatext4.png" alt="" />
        </a>

        <div className="nav-control">
          <div className="hamburger">
            <span className="line"></span><span className="line"></span><span className="line"></span>
          </div>
        </div>
      </div>
      {/*  Nav header end */}

      {/* Header start */}
      <div class="header">
        <div class="header-content">
          <nav class="navbar navbar-expand">
            <div class="collapse navbar-collapse justify-content-between">
              <div class="header-left">
                <div class="dashboard_bar">
                </div>
              </div>
              <ul class="navbar-nav header-right">
                <li class="nav-item">
                <form onSubmit={onSubmit}>
                  <div class="input-group top-search-bar search-area d-xl-inline-flex" >
                    <input type="text" 
                    class="form-control"
                    id='search'
                   
                    onChange={(e) => setQuery(e.target.value)} placeholder="Search By Category ..."/>
                    <button type="submit" class="btn btn-primary mb-2 raise_button"  onClick={getResult}>Search</button>
                  </div>
                  </form>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>
    <Sidebar  ></Sidebar>

		
			<div class="container-fluid">
      <div class="content-body">
				<div class="row">
					<div class="col-xl-12 col-xxl-12">
						<div class="row">
	
							<div class="col-xl-12">
								<div class="card">
									<div class="card-header border-0 pb-sm-0 pb-5">
                    
									</div>
                  <div className="card-header">
                  <h4 className="card-title"> Results</h4>
                  <p>About: {items.length} results</p>
                </div>
										<div class="card-body">
                                
                                <div class="custom-tab-1">
                                    <ul class="nav nav-tabs">
                                        <li class="nav-item">
                                            <a class="nav-link active" data-toggle="tab" href="#home1"><i class="l"></i> Results</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" data-toggle="tab" href="#profile1"><i class="la la-user mr-2"></i> Category</a>
                                        </li>
                                    </ul>
                                    <div class="tab-content">
                                        <div class="tab-pane fade show active" id="home1" role="tabpanel">
                                          <div>

                                          <h4><p>About: {items.length} results</p></h4>
                                         
                                          
                                             
                                            <div class="row">
          {items.map((item) => (
            <div class="col-lg-6 col-xl-6">
              <div class="card">
                <div class="card-body">
                  <div class="row m-b-30">
                    <div class="col-md-12 col-xxl-12">
                      <div class="new-arrival-content position-relative">
                      <h4><a href={"/Case?id="+item._id}>
                      { item.meta_info['Parties '].substring(0,70)} 
                </a></h4> 
                        <p>Judge(s): <span class="item">{item.meta_info['Judge(s) ']}<i class="fa fa-check-circle text-success"></i></span></p>
                        <p>Citation: <span class="item">{item.meta_info['Citation']}</span> </p>
                        <p>County: <span class="item">{item.meta_info['County']}</span></p>
                        <p>Date: <span class="item">{item.meta_info['Date Delivered ']}</span></p>
                        <p>Tags:&nbsp;&nbsp;   
                                    {/* <span class="badge badge-success light">{item.resolved_acts.slice(0,4)}</span> */}
                                    <span class="badge badge-success light">{item.resolved_acts}</span>
                                    <span class="badge badge-success light">{item.resolved_charges}</span>
                                </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        ))}
          </div>
          </div>
   
   </div>
                                        <div class="tab-pane fade" id="profile1">
                                            <div class="pt-4">
                                                
                                                <div class="col-xl-12 col-lg-12">
                                                <div class="card">
  <div class="card-body">
    <div>


<div className="dropdown">
      <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={getCategories} >
        Categories
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <select className="form-control" onChange={handleCategoryChange} value={selectedCategory}>
          <option value="" >Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category} onClick={() => search_by_category(category)} className="col-lg-12 col-xl-12" >
              {category}
            </option>
            
          ))}
        </select>
        
        <div className="row mt-2">
          {categories.map((category) => (
            <div key={category} className="col-lg-12 col-xl-12">
              <div className="card">
                <div className="card-body">
                  <div className="row m-b-30">
                    <div className="col-md-12 col-xxl-12">
                      <div className="new-arrival-content position-relative">
                        <p>
                          <a href="#" onClick={() => search_by_category(category)}>
                            <span className="item">{category}<i className="fa fa-check-circle text-success"></i></span>
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div> 
                <div class="row">
          {cats.map((cat) => (
            <div class="col-lg-6 col-xl-6">
              <div class="card">
                <div class="card-body">
                  <div class="row m-b-30">
                    <div class="col-md-12 col-xxl-12">
                      <div class="new-arrival-content position-relative">
                      <h4><a href={"/Case?id="+cat._id}>
                      { cat.meta_info['Parties '].substring(0,70)} 
                </a></h4> 
                        <p>Judge(s): <span class="item">{cat.meta_info['Judge(s) ']}<i class="fa fa-check-circle text-success"></i></span></p>
                        <p>Citation: <span class="item">{cat.meta_info['Citation']}</span> </p>
                        <p>County: <span class="item">{cat.meta_info['County']}</span></p>
                        <p>Date: <span class="item">{cat.meta_info['Date Delivered ']}</span></p>
                        <p>Tags:&nbsp;&nbsp;   
                                    <span class="badge badge-success light">{cat.resolved_acts.slice(0,4)}</span>
                                    <span class="badge badge-success light">{cat.resolved_acts}</span>
                                    <span class="badge badge-success light">{cat.resolved_charges}</span>
                                </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        ))}
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
				</div>
			</div>
		</div>
    </div>
  )
};

Search.propTypes = {};

Search.defaultProps = {};

export default Search;