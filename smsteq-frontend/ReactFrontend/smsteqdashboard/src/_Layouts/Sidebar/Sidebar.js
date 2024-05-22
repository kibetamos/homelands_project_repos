import React from 'react';
import PropTypes from 'prop-types';
import {
  Link, useNavigate
} from "react-router-dom";

const isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
  },
  any: function () {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};

const whatsappRedirect = function () {
  let str = '';

  if (isMobile.any()) {
    str = "https://api.whatsapp.com/send?phone=%2B" + "254713032319" + "&text=Hi%2C%20I%20am%20interested%20in%20bulk%20sms%20services";
  } else {
    str = 'https://web.whatsapp.com/send?phone=%2B' + "254713032319" + "&text=Hi%2C%20I%20am%20interested%20in%20bulk%20sms%20services";
  };
  window.open(str);
}

const Sidebar = () => (
  <div >
    <div class="deznav">
      <div class="deznav-scroll">
        <a href="javascript:void(0)" id='showGroupModalBtn' class="add-menu-sidebar d-none" data-toggle="modal" data-target="#addGroupModal" > Show Group Chooser</a>
        <a href="javascript:void(0)" id='chooseIndividualContactModalBtn' class="add-menu-sidebar d-none" data-toggle="modal" data-target="#chooseIndividualContactModal" > Show Group Chooser</a>
        <a href="javascript:void(0)" id='confirmDeleteGroupModalBtn' class="add-menu-sidebar d-none" data-toggle="modal" data-target="#confirmDeleteGroupModal" > Show Group Confirm Delete</a>
        <a href="javascript:void(0)" id='showDraftsModalBtn' class="add-menu-sidebar d-none" data-toggle="modal" data-target="#addDraftsModal" > Show draft modal </a>
        <a href="javascript:void(0)" id='showDeleteContactModalBtn' data-toggle="modal" data-target="#deleteContactModal" class="btn btn-danger shadow btn-xs sharp d-none"> Delete Single Contact </a>
        <a href="javascript:void(0)" data-toggle="modal" data-target="#editContactModalside"
          class="btn btn-primary shadow btn-xs sharp mr-1 d-none" id="showEditContactModal"  > </a>
        <a href="javascript:void(0)" data-toggle="modal" data-target="#applySenderIdModal"
          class="btn btn-primary shadow btn-xs sharp mr-1 d-none" id="applySenderIdModalBtn"  > </a>
        <a href="javascript:void(0)" data-toggle="modal" data-target="#buySenderIdModalside"
          class="btn btn-primary shadow btn-xs sharp mr-1 d-none" id="buySenderIdModalsideBtn"> </a>

        <ul class="metismenu" id="menu">
          {/* <li>
          <a href="/home" aria-expanded="false">
            <i class="flaticon-381-networking"></i>
            <span class="nav-text">Dashboard</span>
          </a>
          <Link to="/home" aria-expanded="false" >  <i class="flaticon-381-networking"></i>
            <span class="nav-text">Dashboard</span>
          </Link>
        </li> */}
          {/* <li>
          <a href="/home" class="ai-icon" aria-expanded="false">
            <i class="flaticon-381-notepad-2"></i>
            <span class="nav-text">Overview</span>
          </a>
        </li> */}
          {/* <li>
          <a href="/sendmessage" class="ai-icon" aria-expanded="false">
          <i class="flaticon-381-add-3"></i>
          <span class="nav-text">Send Message</span>
        </a>
        </li> */}
          <li>
            <a href="javascript:void(0)" class="add-menu-sidebar" data-toggle="modal" id='sendMessageModalBtn' data-target="#sendMessageModal" >
              <i class="flaticon-381-add-3"></i>
              <span class="nav-text"> Send Message</span>
            </a>
          </li>

          <li>
            <a href="/bulksms" class="ai-icon" aria-expanded="false">
              <i class="flaticon-381-album-2"></i>
              <span class="nav-text"> Messages</span>
            </a>
          </li>
          <li>
            <a href="/schedules" class="ai-icon" aria-expanded="false">
              <i class="flaticon-381-calendar-1"></i>
              <span class="nav-text"> SMS Schedules</span>
            </a>
          </li>
          <li>
            <a href="/templates" class="ai-icon" aria-expanded="false">
              <i class="flaticon-381-archive"></i>
              <span class="nav-text">Drafts</span>
            </a>
          </li>
          <li>
            <a href="/contacts" class="ai-icon" aria-expanded="false">
              <i class="flaticon-381-folder-15"></i>
              <span class="nav-text">Contacts</span>
            </a>
          </li>
          <li>
            <a href="/sender-ids" class="ai-icon" aria-expanded="false">
              <i class="flaticon-381-receive"></i>
              <span class="nav-text">Sender IDs</span>
            </a>
          </li>
          {/* <li>
          <a href="/payments" class="ai-icon" aria-expanded="false">
            <i class="flaticon-381-notepad-2"></i>
            <span class="nav-text">Payments</span>
          </a>
        </li> */}

          <li>
            <a href="/profile" class="ai-icon" aria-expanded="false">
              <i class="flaticon-381-networking"></i>
              <span class="nav-text">Profile</span>
            </a>
          </li>

          <li className='whatsapp-btn-wrapper' >
            <button onClick={whatsappRedirect} id="whatsapp-btn" type="button"
              class="rounded-pill shadow btn-rounded border-primary">
              <img src="./images/icons8-whatsapp-48.png" alt="" /> <span>Talk To Us</span>
            </button>
          </li>

          {/* <li><a class="has-arrow ai-icon" href="javascript:void()" aria-expanded="false">
          <i class="flaticon-381-television"></i>
          <span class="nav-text">Apps</span>
        </a>
          <ul aria-expanded="false">
            <li><a href="./app-profile.html">Profile</a></li>
            <li><a href="./post-details.html">Post Details</a></li>
            <li><a class="has-arrow" href="javascript:void()" aria-expanded="false">Email</a>
              <ul aria-expanded="false">
                <li><a href="./email-compose.html">Compose</a></li>
                <li><a href="./email-inbox.html">Inbox</a></li>
                <li><a href="./email-read.html">Read</a></li>
              </ul>
            </li>
            <li><a href="./app-calender.html">Calendar</a></li>
            <li><a class="has-arrow" href="javascript:void()" aria-expanded="false">Shop</a>
              <ul aria-expanded="false">
                <li><a href="./ecom-product-grid.html">Product Grid</a></li>
                <li><a href="./ecom-product-list.html">Product List</a></li>
                <li><a href="./ecom-product-detail.html">Product Details</a></li>
                <li><a href="./ecom-product-order.html">Order</a></li>
                <li><a href="./ecom-checkout.html">Checkout</a></li>
                <li><a href="./ecom-invoice.html">Invoice</a></li>
                <li><a href="./ecom-customers.html">Customers</a></li>
              </ul>
            </li>
          </ul>
        </li>
        <li><a class="has-arrow ai-icon" href="javascript:void()" aria-expanded="false">
          <i class="flaticon-381-controls-3"></i>
          <span class="nav-text">Charts</span>
        </a>
          <ul aria-expanded="false">
            <li><a href="./chart-flot.html">Flot</a></li>
            <li><a href="./chart-morris.html">Morris</a></li>
            <li><a href="./chart-chartjs.html">Chartjs</a></li>
            <li><a href="./chart-chartist.html">Chartist</a></li>
            <li><a href="./chart-sparkline.html">Sparkline</a></li>
            <li><a href="./chart-peity.html">Peity</a></li>
          </ul>
        </li>
        <li><a class="has-arrow ai-icon" href="javascript:void()" aria-expanded="false">
          <i class="flaticon-381-internet"></i>
          <span class="nav-text">Bootstrap</span>
        </a>
          <ul aria-expanded="false">
            <li><a href="./ui-accordion.html">Accordion</a></li>
            <li><a href="./ui-alert.html">Alert</a></li>
            <li><a href="./ui-badge.html">Badge</a></li>
            <li><a href="./ui-button.html">Button</a></li>
            <li><a href="./ui-modal.html">Modal</a></li>
            <li><a href="./ui-button-group.html">Button Group</a></li>
            <li><a href="./ui-list-group.html">List Group</a></li>
            <li><a href="./ui-media-object.html">Media Object</a></li>
            <li><a href="./ui-card.html">Cards</a></li>
            <li><a href="./ui-carousel.html">Carousel</a></li>
            <li><a href="./ui-dropdown.html">Dropdown</a></li>
            <li><a href="./ui-popover.html">Popover</a></li>
            <li><a href="./ui-progressbar.html">Progressbar</a></li>
            <li><a href="./ui-tab.html">Tab</a></li>
            <li><a href="./ui-typography.html">Typography</a></li>
            <li><a href="./ui-pagination.html">Pagination</a></li>
            <li><a href="./ui-grid.html">Grid</a></li>

          </ul>
        </li>
        <li><a class="has-arrow ai-icon" href="javascript:void()" aria-expanded="false">
          <i class="flaticon-381-heart"></i>
          <span class="nav-text">Plugins</span>
        </a>
          <ul aria-expanded="false">
            <li><a href="./uc-select2.html">Select 2</a></li>
            <li><a href="./uc-nestable.html">Nestedable</a></li>
            <li><a href="./uc-noui-slider.html">Noui Slider</a></li>
            <li><a href="./uc-sweetalert.html">Sweet Alert</a></li>
            <li><a href="./uc-toastr.html">Toastr</a></li>
            <li><a href="./map-jqvmap.html">Jqv Map</a></li>
            <li><a href="./uc-lightgallery.html">Lightgallery</a></li>
          </ul>
        </li>
        <li><a href="widget-basic.html" class="ai-icon" aria-expanded="false">
          <i class="flaticon-381-settings-2"></i>
          <span class="nav-text">Widget</span>
        </a>
        </li>
        <li><a class="has-arrow ai-icon" href="javascript:void()" aria-expanded="false">
          <i class="flaticon-381-notepad"></i>
          <span class="nav-text">Forms</span>
        </a>
          <ul aria-expanded="false">
            <li><a href="./form-element.html">Form Elements</a></li>
            <li><a href="./form-wizard.html">Wizard</a></li>
            <li><a href="./form-editor-summernote.html">Summernote</a></li>
            <li><a href="form-pickers.html">Pickers</a></li>
            <li><a href="form-validation-jquery.html">Jquery Validate</a></li>
          </ul>
        </li>
        <li><a class="has-arrow ai-icon" href="javascript:void()" aria-expanded="false">
          <i class="flaticon-381-network"></i>
          <span class="nav-text">Table</span>
        </a>
          <ul aria-expanded="false">
            <li><a href="table-bootstrap-basic.html">Bootstrap</a></li>
            <li><a href="table-datatable-basic.html">Datatable</a></li>
          </ul>
        </li>
        <li><a class="has-arrow ai-icon" href="javascript:void()" aria-expanded="false">
          <i class="flaticon-381-layer-1"></i>
          <span class="nav-text">Pages</span>
        </a>
          <ul aria-expanded="false">
            <li><a href="./page-register.html">Register</a></li>
            <li><a href="./page-login.html">Login</a></li>
            <li><a class="has-arrow" href="javascript:void()" aria-expanded="false">Error</a>
              <ul aria-expanded="false">
                <li><a href="./page-error-400.html">Error 400</a></li>
                <li><a href="./page-error-403.html">Error 403</a></li>
                <li><a href="./page-error-404.html">Error 404</a></li>
                <li><a href="./page-error-500.html">Error 500</a></li>
                <li><a href="./page-error-503.html">Error 503</a></li>
              </ul>
            </li>
            <li><a href="./page-lock-screen.html">Lock Screen</a></li>
          </ul>
        </li> */}
        </ul>
        {/* <div class="copyright">
        <p><strong>UjumbePap </strong> © 2022 All Rights Reserved</p> 
      </div> */}
      </div>
    </div>
  </div>
);

Sidebar.propTypes = {};

Sidebar.defaultProps = {};

export default Sidebar;
