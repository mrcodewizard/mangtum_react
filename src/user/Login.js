import { Link, useLocation, useNavigate } from "react-router-dom";
import { React, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { get_meta } from "../store/home";
import SiteLogo from "../components/img/logo.png";
import {
  validatelogin,
  checkLogin,
  manageLoginmessage,
  setUserData,
} from "../store/auth";
import ThemeBreadcrumb from "../components/common/ThemeBreadcrumb";

const Login = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // console.log(location?.state.authentication)
  const initialValues = { email: "", password: "" };
  const state = useSelector((state) => state.auth);
  const mainstate = useSelector((state) => state.home);

  const metaTags = mainstate.allmeta;
  const siteUrl = window.location.href;

  useEffect(() => {
    dispatch(get_meta());
  }, []);

  const login_fields = useSelector((state) => state.auth.login);

  useEffect(() => {
    if (state.loginStatus) {
      dispatch(setUserData(state.userDetails));
      localStorage.setItem("userDetails", JSON.stringify(state.userDetails));
      if (location?.state?.authentication) {
        navigate("/");
      } else {
        navigate(-1);
      }
    }
  }, [state.loginStatus]);

  const [error, setErrors] = useState(false);
  const handellogin = (e) => {
    dispatch(manageLoginmessage());
    const { name, value } = e.target;

    var input = { field: name, value: value };
    dispatch(validatelogin(input));
  };

  const handelSubmit = (e) => {
    e.preventDefault();

    if (validate(login_fields)) {
      dispatch(checkLogin(login_fields));
    }
  };

  const validate = (values) => {
    const error = {};
    const regex =
      /^(|(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6})$/i;
    const pass_regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!values.password) {
      error.password = "password is required!";
    }

    if (!values.email) {
      error.email = "Email is required!";
    } else if (!regex.test(values.email)) {
      error.email = "Plese enter the correct format of the email.";
    }
    setErrors(error);
    return Object.values(error).length > 0 ? false : true;
  };

  const showWrongpasswordmsg = () => {
    if (state.loginErrormsg) {
      //document.getElementById('log-error')?.classList.remove("hide");
      return (
        <div
          className="alert alert-danger set-margin-top"
          id="log-error"
          role="alert"
        >
          {state.loginError}
        </div>
      );
    }
  };

  // REMEMBER ME FUNCTIONALITY START
  const [rememberMe, setRememberMe] = useState(false);
  const handleCheckboxChange = (event) => {
    setRememberMe(event.target.checked);
  };
  // REMEMBER ME FUNCTIONALITY END

  return (
    <div>
      <main>
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
        <ThemeBreadcrumb title="Login" current_route="Login" />

        <section
          className="single-wrapper section-wrapper"
          style={{ marginTop: "50px" }}
        >
          <div className="container">
            <div className="row pt-2 pb-5 justify-content-center">
              <div className="col-md-5 login-wrap">
                {showWrongpasswordmsg()}
                <form
                  onSubmit={handelSubmit}
                  method=""
                  style={{ padding: "20px 30px" }}
                >
                  <h2
                    style={{
                      textAlign: "center",
                      fontWeight: "700",
                      paddingBottom: "16px",
                      fontFamily: "Montserrat",
                    }}
                  >
                    Welcome Back
                  </h2>

                  <div className="form-group">
                    <label htmlFor="" className="login-label">
                      Email Address
                    </label>
                    <input
                      type="text"
                      name="email"
                      className="login-input"
                      onChange={handellogin}
                      placeholder="Enter Email"
                    />
                    <p className="register_error">{error.email}</p>
                  </div>
                  <div className="form-group">
                    <label htmlFor="" className="login-label">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="login-input"
                      onChange={handellogin}
                      placeholder="Enter Password"
                    />
                    <p className="register_error">{error.password}</p>
                  </div>
                  <div className="row checkbox px-3 mb-2">
                    <div className="col-6">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={rememberMe}
                          onChange={handleCheckboxChange}
                          value=""
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label"
                          for="flexCheckDefault"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>
                    <div className="col-6">
                      <Link
                        to="/forgot-password"
                        style={{
                          color: "red",
                          fontWeight: "bold",
                          float: "right",
                        }}
                      >
                        Lost your password?
                      </Link>
                    </div>
                  </div>
                  <button
                    disabled={state.loader}
                    className="theme-btn w-100 text-white py-3"
                    style={{ fontWeight: "700" }}
                  >
                    {state.loader ? "Logging in..." : "Login"}
                  </button>
                </form>
                <div className="ac-open text-center mt-3 login-label">
                  Don't have an account?{" "}
                  <a
                    href="/register"
                    className="login-label"
                    style={{ color: "#fd7e14", fontWeight: "600" }}
                  >
                    Create Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
