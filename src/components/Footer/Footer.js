import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkSubscribe } from "../../store/home";
import { ToastContainer, toast } from "react-toastify";
import { FaArrowUp } from "react-icons/fa";
import { images } from "../../utils/images";
import "./ResponsiveFooter.css";

const Footer = () => {
  const dispatch = useDispatch();
  const subscribe_email = useSelector((state) => state.home.Subscribe);
  const subscribemsg = subscribe_email?.msg;
  const [errors_subsemail, setErrors_subsemail] = useState({});
  const handleSubmitSubsemail = (e) => {
    e.preventDefault();

    // Define errors object
    var errors = {};
    const emailInput = e.target.elements.email;
    const emailRegex =
      /^(|(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6})$/i;
    if (!emailInput.value || !emailRegex.test(emailInput.value)) {
      errors = { ...errors, email: "Please enter a valid email!" };

      emailInput.focus();
    }
    if (Object.keys(errors).length === 0) {
      const formData = new FormData(e.target);
      dispatch(checkSubscribe(formData));
      setErrors_subsemail({});
    } else {
      setErrors_subsemail(errors);
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const interval = setInterval(() => {
      setYear(new Date().getFullYear());
    }, 1000 * 60 * 60 * 24); // Update every day

    return () => {
      clearInterval(interval);
    };
  }, []);

  //console hello world
  return (
    <footer className="section-wrapper pt-5 mt-5 ">
      <div className="ftr-head">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="navbarLogo col-md-7 col-6">
              <img
                src={images["logo.png"]}
                className="img-fluid"
                title=""
                alt=""
              />
            </div>
            <div className="social-icons text-right col-md-3 col-6">
              <a href="https://www.facebook.com/profile.php?id=100063585218866">
                <img src={images["facebook.svg"]} />
              </a>
              <a href="https://www.instagram.com/mangtum_shop/">
                <img src={images["instagram.svg"]} alt="" />
              </a>
              <a href="https://twitter.com/mangtumllc">
                <img src={images["twitter.svg"]} alt="" />
              </a>
              {/* <a href="#link"><i className="fa fa-twitter-square" aria-hidden="true"></i></a> */}
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row justify-content-center hide-footer">
          <div className="col-lg-7 col-md-12">
            <div className="footer-row">
              <div className="footer-card">
                {/* <h4>Useful Links</h4> */}
                <h4>Company</h4>
                <ul>
                  <li>
                    <Link to="/terms-and-condition" onClick={handleScrollToTop}>
                      Terms And Conditions
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacypolicy" onClick={handleScrollToTop}>
                      Privacy Policy
                    </Link>
                  </li>
                  {/* <li>
                    <Link to="/help-topics" onClick={handleScrollToTop}>
                      Help Topics
                    </Link>
                  </li> */}
                  {/* <li><a href="">Blog</a></li> */}
                </ul>
              </div>
              <div className="footer-card">
                <h4>Our Links</h4>
                <ul>
                  <li>
                    <Link to="/contact" onClick={handleScrollToTop}>
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" onClick={handleScrollToTop}>
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" onClick={handleScrollToTop}>
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="footer-card">
                <h4>Enquiry</h4>
                <ul>
                  <li>
                    <a href="tel: +1 980-228-8715">
                      <i className="fa fa-phone text-color1"></i> +1
                      980-228-8715  
                      (Text & WhatsApp only)
                    </a>
                  </li>
                  <li>
                    <a href="mailto: support@mangtum.com">
                      <i className="fa fa-envelope text-color1"></i>{" "}
                      support@mangtum.com
                    </a>
                  </li>
                  {/* <li><a href="#link">Customers</a></li> */}
                  {/* <li><a href="#link">API</a></li> */}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-5 col-md-12">
            <div className="subscribe footer-card">
              <h4>Get In Touch</h4>
              <div className="form-subscribe">
                <form onSubmit={handleSubmitSubsemail}>
                  <div className="formflex">
                    {/* <input type="text" name="subscribe_email" className="form-control" onChange={handelsubscribe} placeholder="Your Email"/> */}
                    <input
                      type="email"
                      name="email"
                      className="form-control subform"
                      placeholder="Enter Email"
                      style={{ textAlign: "left" }}
                    />
                    <button className="subbtn" type="submit">
                      Subscribe
                    </button>{" "}
                    <br />
                  </div>
                  {errors_subsemail.email && (
                    <p className="register_error">{errors_subsemail.email}</p>
                  )}
                </form>
                <div className="ft-content grey-text mt-3">
                  Driven by the strongest ideals & motivation, focused on
                  delivering high-quality, reliable and user-friendly products
                  to consumers.
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- copyright --> */}
        <div className=" copyright">
          {/* If you have any questions, &nbsp;
          <a href="/contact"><strong   style={{ 'fontWeight':'500'}}>Contact us.</strong></a> 
          <br/> */}
          &copy; {year} | Mangtum-LLC, All Rights Reserved.
        </div>
      </div>
      <button
        className="back-to-top d-flex align-items-center bg-warning justify-content-center"
        onClick={handleScrollToTop}
      >
        <FaArrowUp className="uparw" />
      </button>
    </footer>
  );
};

export default Footer;
