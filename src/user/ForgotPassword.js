import { Link } from "react-router-dom";
// import React, { useReducer } from 'react';
import React from "react";
import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  validatelogin,
  validateForgotpass,
  checkforgotPassword,
  manageLoginmessage,
} from "../store/auth";

import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const dispatch = useDispatch();

  const intialValues = { email: "" };

  const navigate = useNavigate();

  const forget_fields = useSelector((state) => state.auth.forgetPass);
  const state = useSelector((state) => state.auth);

  useEffect(() => {}, [forget_fields]);

  const [error, setErrors] = useState(false);
  const handellogin = (e) => {
    //dispatch(manageLoginmessage())
    const { name, value } = e.target;

    var input = { field: name, value: value };

    dispatch(validateForgotpass(input));
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    if (validate(forget_fields)) {
      dispatch(checkforgotPassword(forget_fields));
    }
  };

  const validate = (values) => {
    const error = {};
    const regex =
      /^(|(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6})$/i;
    const pass_regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    //  if(!values.password){
    //      error.password = "password is required!"
    //  }

    if (!values.email) {
      error.email = "Email is required!";
    } else if (!regex.test(values.email)) {
      error.email = "Plese enter the correct format of the email.";
    }
    setErrors(error);
    return Object.values(error).length > 0 ? false : true;
  };

  // console.log('state',state.loginErrormsg);
  // const showWrongpasswordmsg = () => {

  //   if(state.loginErrormsg){
  //     //document.getElementById('log-error')?.classList.remove("hide");
  //       return  <div className="alert alert-danger set-margin-top" id="log-error" role="alert">{state.loginError}</div>

  //   }

  // }

  const showMsg = (e) => {
    //let msg = state.forgotPassword
    if (state.forgotPasswordMsg) {
      // return <div className="alert alert-success" role="alert"> Password reset link has been sent on your email.</div>
      return (
        <div className=" row manage-center-msg">
          {" "}
          Password reset link has been sent on your email.
        </div>
      );
    } else if (state.forgoPasswordErr) {
      return (
        <div className="row manage-center-msg text-align-center forgot1">
          <p>{state.forgoPasswordErr}!</p>
        </div>
      );
    }
  };

  return (
    <div>
      <main>
        <div className="bg-light inner-breadcrumb">
          <div className="container">
            <div className="breadcrumb-head">
              <h3>Forgot Password</h3>
              <nav className="breadcrumb-wrap">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">Home</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    <Link
                      href="/login"
                      style={{ fontSize: "12px", paddingTop: "3px" }}
                    >
                      Forgot Password
                    </Link>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
        <section
          className="single-wrapper section-wrapper"
          style={{ marginTop: "50px" }}
        >
          <div className="container">
            <div className="row pt-2 pb-5 justify-content-center">
              <div className="col-md-4 login-wrap">
                {/* <h3 className="text-center">Forgot Password</h3> */}

                {/* {showWrongpasswordmsg()} */}
                <form
                  onSubmit={handelSubmit}
                  method=""
                  style={{ padding: "20px" }}
                >
                  <div className="form-group">
                    <label className="login-label" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      type="text"
                      name="email"
                      className="login-input"
                      onChange={handellogin}
                      placeholder="example@email.com"
                    />
                  </div>
                  <p className="register_error">{error.email}</p>
                  <div className="col-6 lost">
                    <button
                      disabled={state.loader}
                      className="btn btn-warning w-100"
                      style={{ fontWeight: "700" }}
                    >
                      {state.loader ? "Loading.." : "Submit"}
                    </button>
                  </div>
                </form>
                <div>{showMsg()}</div>
              </div>
            </div>
          </div>
        </section>
        {/* <section className="section-wrapper bg-light">
    <div className="container">
      <div className="row pt-4 pb-4">
        <div className="col-md-6">
          <div className="flex-center">
            <div className="contact-center-box">
              <h1>Contact Us</h1>
            <div className="con_txt">
              Problems trying to resolve the conflict between the two major realms of Classical physics: Newtonian mechanics.
            </div>
            <a href="/contact" className="btn btn-lg btn-warning">Contact Us</a>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="flexAddress">
            <div className="addressBox">
              <h4>Bhubaneswar</h4>
              <h5>1901 Thorn ridge Cir.</h5>
              <p>
                75000 Paris <br/>
                Phone ; +451 215 215 <br/>
                Fax : +451 215 215
              </p>
            </div>
            <div className="addressBox">
              <h4>Sambalpur</h4>
              <h5>1901 Thorn ridge Cir.</h5>
              <p>
                75000 Paris <br/>
                Phone ; +451 215 215 <br/>
                Fax : +451 215 215
              </p>
            </div>
            <div className="addressBox">
              <h4>Cuttack</h4>
              <h5>1901 Thorn ridge Cir.</h5>
              <p>
                75000 Paris <br/>
                Phone ; +451 215 215 <br/>
                Fax : +451 215 215
              </p>
            </div>
            <div className="addressBox">
              <h4>Burla</h4>
              <h5>1901 Thorn ridge Cir.</h5>
              <p>
                75000 Paris <br/>
                Phone ; +451 215 215 <br/>
                Fax : +451 215 215
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section> */}
        {/* <!-- clients  --> */}
        {/* <section className="section-wrapper">
    <div className="container">
      <div className="clients-wrap">
        <h4 className="text-center">Trusted By Over 4000 Big Companies</h4>
        <div className="clientLogo">
          <a href="#link"><img src="assets/img/logo1.png" className="img-fluid" title="" alt=""/></a>
          <a href="#link"><img src="assets/img/logo2.png" className="img-fluid" title="" alt=""/></a>
          <a href="#link"><img src="assets/img/logo3.png" className="img-fluid" title="" alt=""/></a>
          <a href="#link"><img src="assets/img/logo4.png" className="img-fluid" title="" alt=""/></a>
          <a href="#link"><img src="assets/img/logo5.png" className="img-fluid" title="" alt=""/></a>
          <a href="#link"><img src="assets/img/logo6.png" className="img-fluid" title="" alt=""/></a>
        </div>
      </div>
    </div>
  </section> */}
      </main>
    </div>
  );
};

export default ForgotPassword;
