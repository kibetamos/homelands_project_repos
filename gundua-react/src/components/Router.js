import React from 'react';
import { BrowserRouter, Routes } from "react-router-dom";

import App from '../App';
// src/App.js
// import Recipe from "./Recipe";

const Router = () => (
  <BrowserRouter>
    {/* <Switch> */}
      <Routes path="/" component={App} exact />
      {/* <Route path="/recipe/:id" component={Recipe} /> */}
    {/* </Switch> */}
  </BrowserRouter>
);

export default Router;