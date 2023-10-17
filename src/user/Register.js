import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import { get_meta } from "../store/home";
import SiteLogo from "../components/img/logo.png";

import {
  updateField,
  RegisterUser,
  updateSetAlreadyRegister,
} from "../store/auth";
import ThemeBreadcrumb from "../components/common/ThemeBreadcrumb";

const Register = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const mainstate = useSelector((state) => state.home);

  const metaTags = mainstate.allmeta;
  const siteUrl = window.location.href;

  useEffect(() => {
    dispatch(get_meta("home_page"));
  }, []);

  const intialValues = {
    full_name: "",
    email: "",
    mobile: "",
    password: "",
    cpassword: "",
  };

  const form_fields = useSelector((state) => state.auth.form_fields);
  const state = useSelector((state) => state.auth);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (state.registerStatus) {
      localStorage.setItem("registerdEmail", form_fields["email"]);

      navigate("/authentication");
    }
  }, [state.registerStatus]);

  if (state.alreadyRegister) {
    setTimeout(() => {
      dispatch(updateSetAlreadyRegister());
    }, 5000);
  }

  const checkIsRegister = () => {
    if (state.alreadyRegister) {
      return (
        <div
          className="alert alert-danger register-msg-style"
          role="alert"
          id="email-is-register"
        >
          Email is already registered with us.Try another.
        </div>
      );
    } else {
      document.getElementById("email-is-register")?.classList.add("hide");
    }
  };

  const [errors, setErrors] = useState({});
  const handleChangeUpdate = (e) => {
    const { name, value } = e.target;
    var input = { field: name, value: value };
    if (value) {
      errors[name] = "";
      setErrors(errors);
    }
    dispatch(updateField(input));
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    if (validate(form_fields)) {
      dispatch(RegisterUser(form_fields));
    }
  };

  const validate = (values) => {
    const error = {};
    const regex =
      /^(|(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6})$/i;
    const pass_regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!values.full_name || /^\s+$/.test(values.full_name)) {
      error.full_name = "Username is required!";
    }
    if (!values.password) {
      error.password = "password is required!";
    }

    if (!pass_regex.test(values.password)) {
      error.password =
        "6 letter password, with at least a symbol, upper and lower case letters and a number.";
    }
    if (!values.email) {
      error.email = "Email is required!";
    } else if (!regex.test(values.email)) {
      error.email = "Plese enter the correct format of the email.";
    }
    if (!values.mobile) {
      error.mobile = "Phone Number is required!";
    } else if (!/^\d{10,14}$/.test(values.mobile)) {
      error.mobile =
        "Invalid Phone Number. Please enter a valid numeric number.";
    } else if (/\s{2,}/.test(values.mobile)) {
      error.mobile = "Phone Number should not contain multiple spaces!";
    } else if (!/^\d+$/.test(values.mobile)) {
      error.mobile =
        "Invalid Phone Number. Please enter a valid numeric number.";
    }

    if (!values.cpassword) {
      error.cpassword = "Confirm Password is required!";
    } else if (values.cpassword !== values.password) {
      error.cpassword = "Confirm Password and Password should be same.";
    }
    setErrors(error);
    return Object.values(error).length > 0 ? false : true;
  };

  const handleKeyUp = (event) => {
    const inputValue = event.target.value;
    if (!/^\d+$/.test(inputValue)) {
      errors["mobile"] =
        "Invalid Phone Number. Please enter a valid numeric number.";
      setErrors(errors);
      setUpdated(!updated);
    }
  };

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("userDetails"));
    if (data) {
      navigate("/");
    }
  }, []);
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
        <ThemeBreadcrumb title="Register" current_route="Register" />

        <section className="single-wrapper section-wrapper">
          <div className="container">
            <div
              className="row pt-2 pb-5 justify-content-center"
              style={{ marginTop: "50px" }}
            >
              <div className="col-md-6 login-wrap">
                <h3
                  className="text-center"
                  style={{ color: "#ffc107", fontFamily: "Montserrat" }}
                >
                  Welcome To Mangtum
                </h3>
                {checkIsRegister()}
                <form
                  onSubmit={handelSubmit}
                  id="myform"
                  style={{ padding: "20px 30px" }}
                >
                  <div className="form-group">
                    <label htmlFor="" className="login-label">
                      Name<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      onChange={handleChangeUpdate}
                      className="login-input"
                      placeholder="Your Full Name"
                    />
                    <p className="register_error">{errors.full_name}</p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="" className="login-label">
                      Email Address<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="email"
                      onChange={handleChangeUpdate}
                      className="login-input"
                      placeholder="example@email.com"
                    />
                    <p className="register_error">{errors.email}</p>
                  </div>
                  <div className="form-group">
                    <label htmlFor="" className="login-label">
                      Phone Number<span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="reg-form-group">
                      <input
                        type="number"
                        minLength={10}
                        maxLength={25}
                        name="mobile"
                        onChange={handleChangeUpdate}
                        className="login-input"
                        placeholder="Phone number"
                        onKeyUp={handleKeyUp}
                      />
                    </div>
                    <p className="register_error">{errors.mobile}</p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="" className="login-label">
                      Password<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      onChange={handleChangeUpdate}
                      className="login-input"
                      placeholder="Password"
                    />
                    <p className="register_error">{errors.password}</p>
                  </div>
                  <div className="form-group">
                    <label htmlFor="" className="login-label">
                      Confirm Password<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="password"
                      name="cpassword"
                      onChange={handleChangeUpdate}
                      className="login-input"
                      placeholder="Confirm password"
                    />
                    <p className="register_error">{errors.cpassword}</p>
                  </div>
                  <button
                    disabled={state.loader}
                    className="theme-btn w-100 py-3 w-100"
                    style={{ fontWeight: "700" }}
                  >
                    {state.loader ? "Registering..." : "Register"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Register;
