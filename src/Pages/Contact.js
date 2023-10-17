import React, { useReducer, useRef } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
// import { Link } from 'react-router-dom';
// import { loginUser, signupUser, fbLogin, googleLogin, userActions,fetchSocialCredential } from '../store/user';
import { useDispatch, useSelector } from "react-redux";

import {
  updateFieldContact,
  getContact,
  updateSetAlreadyRegister,
} from "../store/auth";
// import { object } from 'yup';
import { Link, useNavigate } from "react-router-dom";
import { get_meta } from "../store/home";
import { Helmet } from "react-helmet";
import SiteLogo from "../components/img/logo.png";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeBreadcrumb from "../components/common/ThemeBreadcrumb";

const Contact = () => {
  //document.getElementById('email-is-register')?.classList.add("hide");
  const dispatch = useDispatch();

  let intialValues = { name: "", email: "", mobile: "", query: "" };

  const form_fields = useSelector((state) => state.auth.contact_field);

  useEffect(() => {}, [form_fields]);

  const [errors, setErrors] = useState(false);
  const handleChangeUpdate = (e) => {
    const { name, value } = e.target;
    var input = { field: name, value: value };
    dispatch(updateFieldContact(input));
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    var form_fields_new = Object.assign({}, form_fields);
    if (validate(form_fields_new)) {
      dispatch(getContact(form_fields_new));
      intialValues = { name: "", email: "", mobile: "", query: "" };
      toast(
        "Your details submitted successfully. We will back to you shortly."
      );
      document.getElementById("myform").reset();
    }
  };

  const validate = (values) => {
    const error = {};
    const regex =
      /^(|(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6})$/i;
    if (!values.name) {
      error.name = "Name is required!";
    }

    if (!values.email) {
      error.email = "Email is required!";
    } else if (!regex.test(values.email)) {
      error.email = "Plese enter the correct format of the email.";
    }
    if (!values.mobile) {
      error.mobile = "Phone Number is required!";
    }
    if (!values.query) {
      error.query = "Message is required!";
    }

    setErrors(error);
    return Object.values(error).length > 0 ? false : true;
  };

  const homestate = useSelector((state) => state.home);
  useEffect(() => {
    dispatch(get_meta("contact"));
  }, ["contact"]);

  const metaTags = homestate.allmeta;
  const siteUrl = window.location.href;

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{metaTags?.meta_data?.meta_title}</title>
        <meta
          name="description"
          content={metaTags?.meta_data?.meta_description}
        />

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
        <ThemeBreadcrumb title="Contact Us" current_route="Contact Us" />

        <section className="contactbg mt-4">
          <div className="container mx-auto p-3">
            <div
              className="contact-wrap mx-auto p-3 p-sm-5"
              style={{ maxWidth: "800px" }}
            >
              <form onSubmit={handelSubmit} id="myform">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    required
                    name="name"
                    onChange={handleChangeUpdate}
                    className="form-control"
                    placeholder="Enter your name"
                  />
                </div>
                <p className="register_error">{errors.name}</p>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="text"
                    required
                    name="email"
                    onChange={handleChangeUpdate}
                    className="form-control"
                    placeholder="Enter a valid email address"
                  />
                </div>
                <p className="register_error">{errors.email}</p>

                <div className="form-group">
                  <label htmlFor="mobile">Phone Number</label>
                  <div className="row">
                    <div className="col-md-12">
                      <input
                        type="number"
                        name="mobile"
                        className="form-control"
                        minLength={10}
                        placeholder="Enter your phone number"
                        maxLength={25}
                        onChange={handleChangeUpdate}
                        required
                      />
                    </div>
                  </div>
                </div>
                <p className="register_error">{errors.mobile}</p>
                <div className="mb-3">
                  <label
                    htmlFor="exampleFormControlTextarea1"
                    className="form-label"
                  >
                    Message
                  </label>
                  <textarea
                    required
                    className="form-control"
                    name="query"
                    id="exampleFormControlTextarea1"
                    placeholder="Enter your message"
                    rows="3"
                    onChange={handleChangeUpdate}
                  ></textarea>
                  <p className="register_error">{errors.query}</p>
                </div>
                <button className="btn btn-md btn-warning w-100" id="reg_btn">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;
