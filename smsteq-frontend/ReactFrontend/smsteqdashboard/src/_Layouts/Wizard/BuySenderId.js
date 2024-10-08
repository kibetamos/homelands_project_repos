import React, { useState, useEffect } from 'react';
import {
    Link, useNavigate
} from "react-router-dom";
import { Variables } from '../../_utils/GlobalVariables';
import axios from 'axios';
import $ from 'jquery';
import BuySmsWizard from './BuySmsWizard';

const BuySenderId = (props) => {

    let [currentslidervalue, setCurrentslidervalue] = useState(1000);
    let [amountDue, setamountDue] = useState(0);
    let [accountname, setAccountname] = useState("");
    let [checkoutId, setCheckoutId] = useState("");
    const [loading, setLoading] = useState(false);
    const [phoneNumberStatus, setPhoneNumberStatus] = useState(true);
    const [amountStatus, setAmountStatus] = useState(true);
    let gotten = JSON.parse(localStorage.getItem("smstequser"));
    const navigate = useNavigate();
    const { title } = props;

    //on component mount
    useEffect(() => {
        let item = document.getElementById('RechargeSliderValue')
        item.value = 12000;
        setamountDue(12000);

        let gotten = JSON.parse(localStorage.getItem("smstequser"));
        // console.log(gotten);
        setAccountname(gotten.data.account_name)
    }, []);

    const onUpdate = (event) => {
        let item = document.getElementById('RechargeSliderValue')
        item.value = Math.floor(event)
        setamountDue(Math.floor(event));
        // setCurrentslidervalue(Math.floor(event));
    }

    const updateSlider = (event) => {
        setCurrentslidervalue(event.target.value)
        setamountDue(event.target.value);
    }

    const validateAmount = (event) => {
        setamountDue(event.target.value);
        if (event.target.value < 50) {
            // setamountDue(50);
            setAmountStatus(false);
        } else {
            setAmountStatus(true);
        }
        if (!isNumeric(event.target.value)) {
            setAmountStatus(false);
        }
    }

    const isNumeric = (value) => {
        return /^-?\d+$/.test(value);
    }

    const _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            updateSlider(e);
        }
    }

    const validatePhoneNumber = (e) => {
        if (!isNumeric(e.target.value)) {
            setPhoneNumberStatus(false);
        } else {
            if (e.target.value.length == 9) {
                setPhoneNumberStatus(true);
            } else {
                setPhoneNumberStatus(false);
            }
        }
    }


    const submitForm = (e) => {
        e.preventDefault();
        let num = document.getElementById('SenderIdPaymentTel');
        let amount = document.getElementById('RechargeSliderValue');

        if (phoneNumberStatus != true) {
            return;
        }

        let gotten = JSON.parse(localStorage.getItem("smstequser"));
        let token = gotten.data.access;

        const headers = {
            'Content-Type': 'multipart/form-data',
            'Authorization': "Bearer " + token
        }

        let formData = new FormData();
        let file = props.payload.document;
        formData.append('document', file);
        formData.append('file', file);
        formData.append('fileName', file.name);
        formData.append('mpesa_number', num.value);
        formData.append('owner', gotten.data.id);
        formData.append("sender_id", props.payload.sender_id);
        formData.append("describe_usage", props.payload.describe_usage);
        formData.append("fee", 1);

        //show payment instructions
        let elm = document.getElementById("buySenderIdForm");
        elm.classList.add("d-none");
        let elm2 = document.getElementById("SenderIdPaymentInstructions");
        elm2.classList.remove("d-none");

        setLoading(true);

        // for (var pair of formData.entries()) {
        //     console.log(pair[0], pair[1]);
        // }

        axios.post(Variables.apiURL + 'api/v1/api/v1/apply/', formData, { headers: headers })
            .then(response => {

                setLoading(false);
                // console.log(loading);
                // console.log(response.data.checkout_id);

                if (response.status == 200) {
                    setCheckoutId(response.data.checkout_id);
                    confirmPayment(response.data.checkout_id);
                } else {
                    $('#stk-success').addClass('d-none');
                    $('#stk-error').removeClass('d-none');
                }
            })
            .catch(error => {
                console.log('error');
                console.log(error);
                // $('#EmailAbsentError').show();
                setLoading(false);
            })
    }

    //confirm payment status
    const confirmPayment = (checkoutID) => {
        let confirmLoop = setInterval(function () {
            axios.get(Variables.apiURL + 'api/v1/confirm_purchase/' + checkoutID + '/')
                .then(response => {
                    // console.log(loading);
                    // console.log(response);

                    if (response.status == 200) {
                        if (response.data.ResultCode) {
                            console.log("failed payment");
                        } else {
                            clearInterval(confirmLoop);
                            $("#SenderIdPaymentInstructions").addClass("d-none");
                            $("#SenderID-payment-paid").removeClass("d-none");
                            setTimeout(function () {
                                window.location.reload();
                            }, 5000);
                            console.log("success payment");
                        }
                    } else {
                        // $('#stk-success').addClass('d-none');
                        // $('#stk-error').removeClass('d-none');
                    }
                })
                .catch(error => {
                    console.log('error');
                    console.log(error);
                    // $('#EmailAbsentError').show();
                    // setLoading(false);
                })
        }, 10000);
    }

    return (
        <div>

            {/* Buy SenderId Modal */}
            <div class="modal fade  background-opaque" id="buySenderIdModalside">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Complete Payment</h5>
                            <button type="button" class="close" data-dismiss="modal"><span>&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form id='buySenderIdForm' onSubmit={submitForm}>
                                <div class="text-center mb-2 pb-3">
                                    <img className="lipa-na-mpesa-img" src="./images/lipa-na-mpesa-paybill.jpg" alt="" />
                                </div>
                                <div class="form-group">
                                    <label className="mb-1 text-Black mb-3"><strong>Mpesa Phone Number</strong></label>
                                    <div class="input-group mb-3 input-warning-o">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">+254</span>
                                        </div>
                                        <input type="text" onKeyUp={validatePhoneNumber} onChange={validatePhoneNumber} maxLength="9" class="form-control" id='SenderIdPaymentTel' placeholder="7xx xxx xxx" />
                                    </div>
                                </div>
                                {phoneNumberStatus ? <></> : <div className="alert alert-danger mt-2" id='MpesaNumberInvalidError' role="alert">
                                    That phone number is Invalid.
                                </div>}

                                <div class="form-group">
                                    <label className="mb-1 text-Black">
                                        <strong>Amount Due: Ksh</strong> {amountDue}
                                    </label>
                                </div>
                                <div class="form-group">
                                    <div class="text-center mt-4">
                                        <button type="submit" class="btn bg-primary text-white btn-block"> {loading ? <span>Loading...</span> : <span>Submit</span>}</button>
                                    </div>
                                </div>
                            </form>

                            <div id='SenderIdPaymentInstructions' class="d-none">
                                <div class="text-center mb-2 pb-3">
                                    <img className="lipa-na-mpesa-img" src="./images/lipa-na-mpesa-paybill.jpg" alt="" />
                                </div>
                                <div class="text-center">
                                    <h5 class="text-red">Awaiting Payment!</h5>
                                    <div class="mt-2 mb-3 loader5">
                                        <div class="loader-wrapper d-flex justify-content-center align-items-center con-vs-loading">
                                            <div class="vs-loading radius"><div class="effect-1 effects"></div><div class="effect-2 effects"></div><div class="effect-3 effects"></div><img src="" /></div>
                                        </div>
                                    </div>

                                </div>
                                <div>
                                    <h5 id='stk-success'>We have sent a payment notification to your phone. Enter your MPesa pin to complete the transaction.</h5>
                                    <h5 id='stk-error' className='text-red d-none'>We couldn't send an stk push to your phone. Please follow the instructions below.</h5>

                                    <div class="card mt-5">
                                        <h5>
                                            In case you did not receive a notification follow these instructions
                                        </h5>
                                        <div class="pl-3">
                                            <p><strong>1. </strong>Open the Mpesa Menu</p>
                                            <p><strong>2. </strong>Go to Lipa na M-Pesa</p>
                                            <p><strong>3. </strong>Go to PayBill </p>
                                            <p><strong>4. </strong>Enter Business No:<span class="bold"> 869032</span></p>
                                            <p><strong>5. </strong>Enter Account Number: <span class="bold">{accountname}</span></p>
                                            <p><strong>6. </strong>Enter Amount <span class="bold">{amountDue}</span></p>
                                            <p><strong>7. </strong>Enter your Mpesa Pin</p>
                                            <p><strong>8. </strong>Confirm payment</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="SenderID-payment-paid" class="d-none">
                                <div class="text-center mb-2 pb-3">
                                    <img className="lipa-na-mpesa-img" src="./images/lipa-na-mpesa-paybill.jpg" alt="" />
                                </div>
                                <div class="verified-div">
                                    <img src="images/check-mark-verified.gif" />
                                </div>
                                <div class="text-center">
                                    <h3 class="text-green">Payment Confirmed!</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Buy SMS Modal End */}
        </div>
    );
}

export default BuySenderId;