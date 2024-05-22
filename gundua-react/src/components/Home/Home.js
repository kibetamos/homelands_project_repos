import React, { useState, forwardRef, useRef, useImperativeHandle, useEffect } from "react";
import PropTypes from 'prop-types';
import styles from './Home.module.css';
import Headers from '../Headers/Headers';
import Footers from '../Footers/Footers';
import $ from 'jquery';
import axios from 'axios';
import { Variables } from '../_utils/GlobalVariables';
import Moment from 'moment';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  //when page loads
  useEffect(() => {
    getPosts();
  }, []);

  //get all posts
  const getPosts = () => {
    let gotten = JSON.parse(localStorage.getItem("adanianuser"));
    let token = gotten.data.success.token;


    const headers = {
      'Content-Type': 'multipart/form-data',
      'Authorization': "Bearer " + token
    }
    setLoading(true);
    axios.get(Variables.apiURL + 'api/get_all_posts', { headers: headers })
      .then(response => {
        setLoading(false);
        console.log(response.data.success);

        if (response.status == 200) {
          setPosts(response.data.success);
          console.log(posts);
        } else {
          $('#SubmitError').show();
        }
      })
      .catch(error => {
        console.log('error');
        console.log(error);
        // $('#EmailAbsentError').show();
        // setLoading(false);
      })
  }

  Moment.locale('en');
  return (
    <div className={styles.Home} data-testid="Home">

      {/* <!-- dividers --> */}
      <div class="dividers">
        <div class="divider"></div>
        <div class="divider"></div>
        <div class="divider"></div>
        <div class="divider"></div>
      </div>

      {/* <Headers></Headers> */}

      {/* <Footers></Footers> */}

    </div>
  )
};

Home.propTypes = {};

Home.defaultProps = {};

export default Home;
