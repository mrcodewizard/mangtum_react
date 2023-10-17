import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from "react-redux";

import { getHomepage, get_meta } from "../../store/home";
import FirstPaint from "./Components/FirstPaint";
import TeamCard from "./Components/TeamCard";
import { mgtApi } from "../../store/axios";
import Companies from "../Home/components/Companies";
import { images } from "../../utils/images";

const About = () => {
  const dispatch = useDispatch();
  const [about, setAbout] = useState(null);
  const siteUrl = window.location.href;

  // Meta Tags section start
  useEffect(() => {
    dispatch(get_meta("home-page"));
  }, ["home-page"]);

  const state = useSelector((state) => state.home);
  const metaTags = state.allmeta;

  useEffect(() => {
    mgtApi.post("about-us").then((r) => setAbout(r));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const data = useSelector((state) => state.home.home_array);

  useEffect(() => {
    dispatch(getHomepage());
  }, []);
  return (
    <section>
      <FirstPaint about={data?.about} />
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

        <meta name="twitter:image" content={images["logo.png"]} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={metaTags?.meta_data?.og_title} />
        <meta
          property="og:description"
          content={metaTags?.meta_data?.og_description}
        />
        <meta property="og:image" content={images["logo.png"]} />
      </Helmet>

      <div className="container">
        <div className="problems row">
          <div className="col-lg-6 padding-x">
            <span className="problems-trying text-black">At Mangtum</span>
            <div className="problem-heading col-9">
              We offer a broad range of products under carefully selected
              categories, including fashion jewelry, fine jewelry, and
              jewelry-making accessories
            </div>
          </div>
          <div className="col-lg-6 float-r">
            <p className="problem-content">
              Regardless of competition, we aimed at developing a marketplace
              for sellers to have a reliable and solid online platform that
              doesn’t push for technical abilities..
            </p>
          </div>
        </div>
        <div className="happy-customers">
          <div className="row">
            <div className="col-lg-3">
              <h1 className="about-counter">10K+</h1>
              <h5 className="happy-customer">Mangtum Users</h5>
            </div>
            <div className="col-lg-3">
              <h1 className="about-counter">25000+</h1>
              <h5 className="happy-customer">Active Products</h5>
            </div>
            <div className="col-lg-3">
              <h1 className="about-counter">500+</h1>
              <h5 className="happy-customer">Vendors Joined</h5>
            </div>
            <div className="col-lg-3">
              <h1 className="about-counter">1000+</h1>
              <h5 className="happy-customer">Products Sold</h5>
            </div>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            height: "0",
            paddingBottom: "56.25%",
            position: "relative",
          }}
        >
          <iframe
            title="YouTube Video"
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/PrJWs8VZE90?autoplay=1"
            frameBorder="1"
            allowFullScreen
            allow="autoplay"
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              border: "1px solid #000",
              borderRadius: "10px",
            }}
          ></iframe>
        </div>

        {/* <div className="our-team">
          <h2 className="meet-team">Meet Our Team</h2>
          <p className="problem-content">
            Problems trying to resolve the conflict between the two major realms
            of Classical physics: Newtonian mechanics{" "}
          </p>
          <div className="row mt-5">
            <TeamCard />
            <TeamCard />
            <TeamCard />
            <TeamCard />
          </div>
        </div>
        <div>
          <Companies />
        </div> */}
      </div>
    </section>
  );
};

export default About;
