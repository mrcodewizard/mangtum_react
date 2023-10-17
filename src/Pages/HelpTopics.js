import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/Container";
// import fqimg from '../components/img/faqimg.png';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getHelptop, get_meta } from "../store/home";
import { Helmet } from "react-helmet";
import SiteLogo from "../components/img/logo.png";
import ThemeBreadcrumb from "../components/common/ThemeBreadcrumb";

const HelpTopics = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getHelptop());
  }, []);
  const state = useSelector((state) => state.home);
  const helptopics = state.Helptop.help_topic;

  // META TAGS START
  useEffect(() => {
    dispatch(get_meta());
  }, []);
  const metaTags = state.Helptop.meta_data;

  const siteUrl = window.location.href;
  // META TAGS END

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{metaTags?.meta_title}</title>
        <meta name="description" content={metaTags?.meta_description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={metaTags?.og_title} />
        <meta property="og:description" content={metaTags?.og_description} />
        <meta property="og:image" content={SiteLogo} />
      </Helmet>
      <ThemeBreadcrumb title="Help Topics" current_route="Help Topics" />

      <div className="faq_collaps_Section">
        <div className="container">
          {helptopics?.map((topic) => {
            //  {Aboutus?.map(about => (
            return (
              <>
                <div className="helpTopicsSection">
                  <h1>{topic.topic_title}</h1>
                  <p>
                    <p>
                      <span
                        className="help"
                        dangerouslySetInnerHTML={{
                          __html: topic.topic_description,
                        }}
                      ></span>
                      {/* Go to mangtum.com. Click ‘Sign In’ on the top right corner. */}
                    </p>
                  </p>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HelpTopics;
