import React from "react";
import { images } from "../../../utils/images";
import { Link } from "react-router-dom";

const FirstPaint = ({ about }) => {
  // console.log(about)
  return (
    <>
      <div
        className="paint"
        style={{
          backgroundImage: `url(${images["none.png"]})`,
        }}
      >
        <div className="container d-none d-md-block">
          <div className="paint-text ">
            {/* <div className="about-title">ABOUT COMPANY</div> */}
            <div className="about-heading">ABOUT US</div>
            <div
              className="about-content"
              dangerouslySetInnerHTML={{
                __html: about?.pagecontent,
              }}
            />
            <Link target="_blank" to={process.env.REACT_APP_JOIN_URL}>
              <button className="about-btn">JOIN NOW </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="container d-md-none mb-5 mt-4">
        <h1 className="">ABOUT US</h1>
        <div
          className="about-content"
          dangerouslySetInnerHTML={{
            __html: about?.pagecontent,
          }}
        />
        <Link target="_blank" to={process.env.REACT_APP_JOIN_URL}>
          <button className="about-btn mt-4">JOIN NOW </button>
        </Link>
      </div>
    </>
  );
};

export default FirstPaint;
