import React from 'react'


export const Category_result = () => {

  const[categories, setCategories] = useState([]);

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
        // console.log(cats.data);
        setCategories(cats.data)  
      }).catch(function (error) {
        console.error(error);
      });
  }

  return (
  		
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
                {/* <p>About: {items.length} results</p> */}
              </div>
                  <div class="card-body">
                              
                              <div class="custom-tab-1">
                                  <ul class="nav nav-tabs">
                                      <li class="nav-item">
                                          <a class="nav-link active" data-toggle="tab" href="#home1"><i class="l"></i> Results</a>
                                      </li>
                                  </ul>
                                  <div class="tab-content">
                                      <div class="tab-pane fade show active" id="home1" role="tabpanel">
                                        <div>

                                        
                                           
                                          <div class="row">
        {categories.map((item) => (
          
          
          // <p> {item.meta_info['Date Delivered']}</p>
          <div class="col-lg-6 col-xl-6">
            <div class="card">
              <div class="card-body">
                <div class="row m-b-30">
                  <div class="col-md-12 col-xxl-12">
                    <div class="new-arrival-content position-relative">
                    {/* <p key={item._id} item={item}></p> */}
                    {/* <h4><a href={"/Case?id="+item._id}>
                    { `${ item.meta_info['Parties '].substring(0,70)}...` } 
              </a></h4>  */}
             
                      <p>Judge(s): <span class="item">{category.meta_info['Judge(s) ']}<i class="fa fa-check-circle text-success"></i></span></p>
                      {/* <p>Citation: <span class="item">{item.meta_info['Citation']}</span> </p>
                      <p>County: <span class="item">{item.meta_info['County']}</span></p>
                      <p>Date: <span class="item">{item.meta_info['Date Delivered ']}</span></p>
                      <p>Tags:&nbsp;&nbsp;   
                                  <span class="badge badge-success light">{item.resolved_acts.slice(0,4)}</span>
                              </p> */}
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
  )
}
