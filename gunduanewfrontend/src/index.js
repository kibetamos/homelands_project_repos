import React from 'react';
import ReactDOM from 'react-dom'
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Pages/Home/Home';
import Login from './components/Login/Login';
import Profile from './components/Profile/Profile';
import Register from './components/Register/Register';
// import Summarizer from './components/Summarizer/Summarizer';
import Summaries from './components/Pages/Summaries/Summaries';
import Docs  from './components/Pages/Docs/Docs';
// import list_docs  from './components/Pages/Docs/';
import list_docs from './components/Pages/Docs/list_docs';
import Case1 from './components/Pages/Cases/case1';
import Home2 from  './components/Pages/Home/Home2';
import Editor from './components/Pages/Editor/Editor';
import Search from './components/Pages/Search/Search';
import Library from './components/Pages/Libraries/Libraries';
import Transcribe from './components/Pages/Transcribe/Transribe'; 
import Docs2 from './components/Pages/Docs/Docs2';
import List_docs from './components/Pages/Docs/list_docs';



ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/register" element={<Register />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route exact path="/" element={<Home />} />
      <Route exact path="/home2" element={<Home2 />} />
      <Route exact path="/Summaries" element={<Summaries />} />
      <Route exact path="/Docs" element={<Docs />} />
      <Route exact path="/Docs2" element={<Docs2 />} />
      <Route exact path="/List_docs" element={<List_docs />} />
      <Route exact path="/list_docs" element={<Docs />} />
      <Route exact path="/Case" element={<Case1 />} />
      <Route exact path="/Editor" element={<Editor />} />
      <Route exact path="/Search" element={<Search />} />
      <Route exact path="/Library" element={<Library />} />
      <Route exact path="/Transcribe" element={<Transcribe />} />
      <Route exact path="/Docs2" element={<Docs2 />} />
      {/* <Route exact path=                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            "/categories"  /> */}
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
