import React, { useReducer } from "react";
import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { verifyOtpfield, checkValidateOTP } from "../store/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./authentication.css";
import ThemeBreadcrumb from "../components/common/ThemeBreadcrumb";

const Authentication = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const intialValues = { otp_key: "" };

  const form_fields = useSelector((state) => state.auth.passcode);
  //const state = useSelector(state => state.home)

  useEffect(() => {}, [form_fields]);

  const state = useSelector((state) => state.auth);
  const [otp_er, setOtpErrors] = useState(false);
  // console.log(state.OtpStatus);
  useEffect(() => {
    var otp_er = {};
    if (state.OtpStatus) {
      setRegisterSuccess(true);
      // navigate('/login', { state: { authentication: true } })
    }
  }, [state.OtpStatus]);
  const msgOnsuccess = () => {
    if (state.registerStatus) {
      return (
        <div className="row manage-center-msg">
          <p>{state.registerMsg}</p>
        </div>
      );
    } else {
      return (
        <div className="row manage-center-msg">
          <p>{state.registerMsg}</p>
        </div>
      );
    }
  };

  const otpMessage = () => {
    if (state.OtpStatus) {
      return <span className="register-msg-style">{state.otpMesg}</span>;
    } else {
      return <span className="register-msg-style">{state.otpMesg}</span>;
    }
  };

  const [error, setErrors] = useState(false);
  const handleverify = (e) => {
    const { name, value } = e.target;
    var input = { field: name, value: value };
    dispatch(verifyOtpfield(input));
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    if (validate(form_fields)) {
      dispatch(checkValidateOTP(form_fields));
    }
  };

  const validate = (values) => {
    const error = {};
    const regex =
      /^(|(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6})$/i;
    const pass_regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!values.otp_key) {
      error.otp_key = "Please enter the otp!";
    }

    setErrors(error);
    return Object.values(error).length > 0 ? false : true;
  };

  return (
    <div>
      <main>
        <ThemeBreadcrumb title="Verify OTP" current_route="Verify OTP" />

        <section className="single-wrapper section-wrapper">
          <div className="container">
            {/* <pre>{JSON.stringify(formValues,undefined,2)}</pre> */}
            {registerSuccess ? (
              <div id="card" className="animated fadeIn">
                <div id="upper-side">
                  <svg
                    version="1.1"
                    id="checkmark"
                    xmlns="http://www.w3.org/2000/svg"
                    xlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    space="preserve"
                  >
                    <path
                      d="M131.583,92.152l-0.026-0.041c-0.713-1.118-2.197-1.447-3.316-0.734l-31.782,20.257l-4.74-12.65
	c-0.483-1.29-1.882-1.958-3.124-1.493l-0.045,0.017c-1.242,0.465-1.857,1.888-1.374,3.178l5.763,15.382
	c0.131,0.351,0.334,0.65,0.579,0.898c0.028,0.029,0.06,0.052,0.089,0.08c0.08,0.073,0.159,0.147,0.246,0.209
	c0.071,0.051,0.147,0.091,0.222,0.133c0.058,0.033,0.115,0.069,0.175,0.097c0.081,0.037,0.165,0.063,0.249,0.091
	c0.065,0.022,0.128,0.047,0.195,0.063c0.079,0.019,0.159,0.026,0.239,0.037c0.074,0.01,0.147,0.024,0.221,0.027
	c0.097,0.004,0.194-0.006,0.292-0.014c0.055-0.005,0.109-0.003,0.163-0.012c0.323-0.048,0.641-0.16,0.933-0.346l34.305-21.865
	C131.967,94.755,132.296,93.271,131.583,92.152z"
                    />
                    <circle
                      fill="none"
                      stroke="#ffffff"
                      stroke-width="5"
                      stroke-miterlimit="10"
                      cx="109.486"
                      cy="104.353"
                      r="32.53"
                    />
                  </svg>
                  <h3 id="status">Success</h3>
                </div>
                <div id="lower-side">
                  <p id="message">
                    Congratulations, Your account has been created on Mangtum.
                    Please login to continue.
                  </p>
                  <Link
                    to="/login"
                    state={{ authentication: true }}
                    id="contBtn"
                  >
                    Continue
                  </Link>
                </div>
              </div>
            ) : (
              <div
                className="row pt-2 pb-5 justify-content-center"
                id="otp_div"
              >
                {msgOnsuccess()}
                <div className="col-md-6 login-wrap">
                  {/* <h3 className="text-center">Verify OTP</h3> */}

                  <form onSubmit={handelSubmit}>
                    <div className="form-group">
                      <label>Enter OTP</label>
                      <input
                        type="text"
                        name="otp_key"
                        onChange={handleverify}
                        className="form-control"
                        placeholder="Enter OTP"
                      />
                    </div>
                    <p className="register_error">{error.otp_key}</p>

                    <div className="col-6 lost">
                      <button
                        className="btn btn-warning w-100"
                        style={{ fontWeight: "700" }}
                      >
                        Submit
                      </button>
                    </div>
                    {otpMessage()}
                  </form>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Authentication;
