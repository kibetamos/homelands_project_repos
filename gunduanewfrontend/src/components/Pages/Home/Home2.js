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

const Home2 = ({ item }) => {
  const [posts, setPosts] = useState([]);
  const[items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const[isLoading, setIsLoading] = useState(true);
  const[query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const[itemsPerPage] = useState(6);

  //when page loads
  // useEffect(() => {
  //   // getPosts();
  // }, []);
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true)
      // const result = await axios(`http://192.168.30.102:5000/fulltext/cases/${query}`)
      const result = await axios('http://192.168.30.102:5000/cases/')
      console.log(result.data)
      setItems(result.data)
      // setItems(fullSearchUrl.data)
      setIsLoading(false)
    }
    fetchItems()
  },[query] )
  Moment.locale('en');
  return (
    
    <div className={styles.Home} data-testid="Home">

      <Header title="Overview"></Header>
      <Sidebar  ></Sidebar>

      <div class="content-body">
        <div class="container-fluid">
          <div class=" ">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="javascript:void(0)">Gundua</a></li>
              <li class="breadcrumb-item active"><a href="javascript:void(0)">Home</a></li>
            </ol>
          </div>
          <div class="row">
          {items.map((item) => (
            // <Case1 key={item._id} item={item}></Case1>
            // <p> {item.meta_info['Date Delivered']}</p>
            <div class="col-lg-6 col-xl-6">
              <div class="card">
                <div class="card-body">
                  <div class="row m-b-30">
                    <div class="col-md-12 col-xxl-12">
                      <div class="new-arrival-content position-relative">
                      <h4><a href={"/Case?id="+item._id}>
                {/* { item.meta_info['Parties'].substring(0,70) ? `${item.meta_info['Parties']}` : 
                `${item.meta_info['Parties'].substring(0,70)}...`} */}
                {/* {item.judgement.substring(0,70)} */}
                {item.meta_info['Parties']}
                </a></h4> 
                        <div class="comment-review star-rating">
                          <ul>
                            {/* <li><i class="fa fa-star"></i></li>
                            <li><i class="fa fa-star"></i></li>
                            <li><i class="fa fa-star"></i></li>
                            <li><i class="fa fa-star-half-empty"></i></li>
                            <li><i class="fa fa-star-half-empty"></i></li> */}
                          </ul>
                          {/* <span class="review-text">(34 reviews) / </span><a class="product-review" href="" data-toggle="modal" data-target="#reviewModal">Write a review?</a>
                          <p class="price">$320.00</p> */}
                        </div>
                        <p>Judge(s): <span class="item">{item.meta_info['Judge(s)']}<i class="fa fa-check-circle text-success"></i></span></p>
                        <p>Citation: <span class="item">{item.meta_info['Citation']}</span> </p>
                        <p>County: <span class="item">{item.meta_info['County']}</span></p>
                        <p>Date: <span class="item">{item.meta_info['Date Delivered']}</span></p>
                        {/* <p class="text-content"></p> */}
                        <p>Tags:&nbsp;&nbsp;
                                    <span class="badge badge-success light">{item.resolved_acts}</span>
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
  )
};

Home2.propTypes = {};

Home2.defaultProps = {};

export default Home2;