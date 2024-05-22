// import './App.css';
// import './css/cases.css';
import React from "react";
import { Link } from "react-router-dom";

const Cases = props =>{

    // var smalljudge = props.item.judgement.substring(0,30)

return (
    <div className="container">
        <div className="row">
            { props.items.map((item) =>{
                return (
                    <div  key = { item._id } className="col-md-6" style={{ marginBottom:"2rem" }}>
                    <div className="case__box"> 
                    
                    {/* // src={case.image_url} 
                    // alt={case.title} */}
                    
                        {/* <p className="column">{item._id }</p> */}
                        <div className="case__text">
                        <h5 className="case__title"> 
                        {/* {item.meta_info['Parties: ']} */}
                        <blockquote className="blockquote-reverse">
                            { item.meta_info['Parties'].length < 95 ? `${item.meta_info['Parties']}` : 
                            `${item.meta_info['Parties'].substring(0,95)}...`}</blockquote>
                        </h5>
                        {/* { item.judgement[0].substring(0,200)} */}
                        <p className="cases__subtitle"> Case Outcome: <span> 
                        {item.meta_info['Case Outcome']}
                        
                        </span>
                        </p>
                        <p className="cases__subtitle">Date Delivered: <span> 
                         {item.meta_info['Date Delivered']}
                         </span>
                         </p>
                    </div>
                    <button className="recipe_buttons">
                <Link to={{ 
                  pathname: `/case/${item._id}`,
                  state: { item: item.judgement }
                }}>View Case</Link>
              </button>
                </div>
                </div>
                );
            })} 
        </div>
    </div>
)

};

export default Cases;