import { useLocation } from "react-router-dom";
// import React, { useReducer } from 'react';
import React from "react";
import { useState, useEffect } from "react";
import SiteLogo from "../components/img/logo.png";
import { useDispatch, useSelector } from "react-redux";
import {
  validateResetfield,
  manageLoginmessage,
  resetPasswordUser,
} from "../store/auth";

import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import ThemeBreadcrumb from "../components/common/ThemeBreadcrumb";

const ResetPassword = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  const dispatch = useDispatch();

  const intialValues = { email: "", password: "" };

  const navigate = useNavigate();

  const mainstate = useSelector((state) => state.home);
  const metaTags = mainstate.allmeta;
  const siteUrl = window.location.href;

  const login_fields = useSelector((state) => state.auth.resetPassword);
  const state = useSelector((state) => state.auth);

  // useEffect(() => {
  //   if(state.change_pass){
  //     return  <div className="alert alert-danger set-margin-top" id="log-success" >Password reset successfully.</div>
  //       navigate('/login')
  //   }
  // }, [state.change_pass])

  const [statee, setState] = useState({ change_pass: false });

  useEffect(() => {
    if (state.change_pass) {
      const timeout = setTimeout(() => {
        setState((prevState) => ({ ...prevState, redirectToLogin: true }));
      }, 3000); // Set the time interval in milliseconds (e.g., 3000 for 3 seconds)

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [state.change_pass]);

  useEffect(() => {
    if (statee.redirectToLogin) {
      navigate("/login");
    }
  }, [statee.redirectToLogin]);

  useEffect(() => {}, [login_fields]);

  useEffect(() => {
    if (state.loginStatus) {
      localStorage.setItem("userDetails", JSON.stringify(state.userDetails));
      navigate("/");
    }
  }, [state.resetPassword]);

  const [error, setErrors] = useState(false);
  const handellogin = (e) => {
    dispatch(manageLoginmessage());
    const { name, value } = e.target;

    var input = { field: name, value: value };

    dispatch(validateResetfield(input));
  };

  const handelSubmit = (e) => {
    e.preventDefault();

    if (validate(login_fields)) {
      const userSlug = window.location.pathname.split("reset-password/").pop();
      // const password = document.getElementById("pwd");
      //const categorySlug = catAndSubCatSlugs[0];
      dispatch(resetPasswordUser({ login_fields, userSlug }));
    }
  };

  const validate = (values) => {
    const error = {};
    const pass_regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (!values.password) {
      error.password = "password is required!";
    }
    if (!pass_regex.test(values.password)) {
      error.password =
        "6 letter password, with at least a symbol, upper and lower case letters and a number.";
    }
    if (!values.cpassword) {
      error.cpassword = "Confirm Password is required!";
    }

    if (values.password !== values.cpassword) {
      error.cpassword = "Confirm Password and Password should be same.";
    }
    setErrors(error);
    return Object.values(error).length > 0 ? false : true;
  };

  const showWrongpasswordmsg = () => {
    if (state.loginErrormsg) {
      document.getElementById("log-error")?.classList.remove("hide");
      //   return  <div className="alert alert-danger set-margin-top" id="log-error" role="alert">{state.resetPassword}</div>
      return (
        <div className="alert alert-danger set-margin-top" id="log-error">
          {state.loginErrormsg}
        </div>
      );
    }
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{metaTags?.meta_title}</title>
        <meta name="description" content={metaTags?.meta_description} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={siteUrl} />
        <meta name="twitter:title" content={metaTags?.meta_data?.og_title} />
        <meta
          name="twitter:description"
          content={metaTags?.meta_data?.og_description}
        />
        <meta name="twitter:image" content={SiteLogo} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={metaTags?.meta_data?.og_title} />
        <meta
          property="og:description"
          content={metaTags?.meta_data?.og_description}
        />
        <meta property="og:image" content={SiteLogo} />
      </Helmet>
      <main>
        <ThemeBreadcrumb
          title="Reset Password"
          current_route="Reset Password"
        />

        <section
          className="single-wrapper section-wrapper"
          style={{ marginTop: "50px" }}
        >
          <div className="container">
            <div className="row pt-2 pb-5 justify-content-center">
              <div className="col-md-4 login-wrap">
                <div>
                  {state.change_pass && (
                    <div
                      className="alert alert-success set-margin-top"
                      id="log-success"
                    >
                      Password reset successfully.
                    </div>
                  )}
                  {/* Rest of your component code */}
                </div>

                <h3 className="text-center">Reset Password</h3>

                {showWrongpasswordmsg()}
                <form onSubmit={handelSubmit} method="" autocomplete="off">
                  <div className="form-group">
                    <label for="">Password</label>
                    <input
                      type="password"
                      name="password"
                      id="pwd"
                      className="form-control"
                      onChange={handellogin}
                      placeholder="Password*"
                    />
                  </div>
                  <p className="register_error">{error.password}</p>
                  <div className="form-group">
                    <label for="">Confirm Password</label>
                    <input
                      type="password"
                      name="cpassword"
                      className="form-control"
                      onChange={handellogin}
                      placeholder="Confirm Password*"
                    />
                  </div>
                  <p className="register_error">{error.cpassword}</p>
                  <div className="col-6 lost">
                    <button
                      className="btn btn-warning w-100"
                      style={{ fontWeight: "700" }}
                    >
                      Submit
                    </button>
                  </div>
                </form>
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
                      Problems trying to resolve the conflict between the two
                      major realms of Classical physics: Newtonian mechanics.
                    </div>
                    <a href="/contact" className="btn btn-lg btn-warning">
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="flexAddress">
                  <div className="addressBox">
                    <h4>Bhubaneswar</h4>
                    <h5>1901 Thorn ridge Cir.</h5>
                    <p>
                      75000 Paris <br />
                      Phone ; +451 215 215 <br />
                      Fax : +451 215 215
                    </p>
                  </div>
                  <div className="addressBox">
                    <h4>Sambalpur</h4>
                    <h5>1901 Thorn ridge Cir.</h5>
                    <p>
                      75000 Paris <br />
                      Phone ; +451 215 215 <br />
                      Fax : +451 215 215
                    </p>
                  </div>
                  <div className="addressBox">
                    <h4>Cuttack</h4>
                    <h5>1901 Thorn ridge Cir.</h5>
                    <p>
                      75000 Paris <br />
                      Phone ; +451 215 215 <br />
                      Fax : +451 215 215
                    </p>
                  </div>
                  <div className="addressBox">
                    <h4>Burla</h4>
                    <h5>1901 Thorn ridge Cir.</h5>
                    <p>
                      75000 Paris <br />
                      Phone ; +451 215 215 <br />
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

export default ResetPassword;
