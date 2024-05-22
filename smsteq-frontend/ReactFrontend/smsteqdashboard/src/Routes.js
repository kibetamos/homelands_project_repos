import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Home from './Home/Home';
import Login from './Login/Login';
import Page404 from './Page404/Page404';
import Register from './Register/Register';
import SendMessage from './SendMessage/SendMessage';
import BulkSms from './BulkSms/BulkSms';
import Contacts from './Contacts/Contacts';
import Overview from './Overview/Overview';
import Profile from './Profile/Profile';
import Templates from './Templates/Templates.js';
import Payments from './Payments/Payments.js';
import ForgotPassword from './ForgotPassword/ForgotPassword';
import SenderIds from './SenderIds/SenderIds';
import Schedules from './Schedules/Schedules';

//
// import Error404 from './components/404/Error404';
// import Dashboard from './containers/Dashboard/Dashboard';
// import { history } from './history';

const RoutesList = () => {
    return (
        <Routes>
            <Route exact path="*" element={<Page404 />} />
            <Route exact path="/home" element={<Home />} />
            <Route exact path="/" element={<Login />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/sendmessage" element={<SendMessage />} />
            <Route exact path="/bulksms" element={<BulkSms />} />
            <Route exact path="/contacts" element={<Contacts />} />
            <Route exact path="/overview" element={<Overview />} />
            <Route exact path="/sendmessage" element={<SendMessage />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/templates" element={<Templates />} />
            <Route exact path="/payments" element={<Payments />} />
            <Route exact path="/sender-ids" element={<SenderIds />} />
            <Route exact path="/schedules" element={<Schedules />} />
            <Route exact path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
    );
};

export default RoutesList;