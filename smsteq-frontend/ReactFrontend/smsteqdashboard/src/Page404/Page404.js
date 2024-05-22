import React from 'react';
import PropTypes from 'prop-types';
import Header from '../_Layouts/Header/Header';
import Sidebar from '../_Layouts/Sidebar/Sidebar';


const Page404 = () => (
  <div>

    <div class="authincation h-100">
      <div class="container h-100">
        <div class="row justify-content-center h-100 align-items-center">
          <div class="col-md-8">
            <div class="form-input-content text-center error-page">
              <h1 class="error-text font-weight-bold">404</h1>
              <h4><i class="fa fa-exclamation-triangle text-warning"></i> The page you were looking for was not found!</h4>
              <p>You may have mistyped the address or the page may have moved.</p>
              <div>
                <a class="btn btn-primary" href="/home">Back to Home</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

Page404.propTypes = {};

Page404.defaultProps = {};

export default Page404;