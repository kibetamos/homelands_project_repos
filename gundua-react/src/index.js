import React from 'react';
import ReactDOM from 'react-dom'
import './index.css';
import './App.css';
import './App.js';
import './cases.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import Home from './components/Home/Home';
//import Login from './components/Login/Login';
// import DataFetch from './components/case/DataFetch' ;
import Case from './components/case/Case' ;
// import Form from './components/case/Form';


ReactDOM.render(
  <BrowserRouter>
    <Routes>
      {/* <Route exact path="/" element={<Home />} /> */}
      {/* <Route exact path="/case" element={<DataFetch />} /> */}
      <Route path="/case/:id" element={<Case />}/>
      <Route exact path="/" element={<App />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);
