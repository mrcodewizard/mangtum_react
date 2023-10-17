import React from "react";
import Accordion from "react-bootstrap/Accordion";
import fqimg from "../components/img/faqimg.png";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getFaq, get_meta } from "../store/home";
import { Helmet } from "react-helmet";
import SiteLogo from "../components/img/logo.png";
import SiteLoader from "../SiteLoader";

const Faq = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFaq());
  }, []);

  const faqlist = useSelector((state) => state.home.Faq);
  const state = useSelector((state) => state.home);

  useEffect(() => {
    dispatch(get_meta());
  }, []);

  const metaTags = state.Faq.meta_data;
  const siteUrl = window.location.href;

  return (
    <>
      <div className="faq_tab_section">
        <div className="container">
          <div className="row section-heading">
            <div className="col-4 mx-auto text-center">
              <h3 className="text-color3" style={{ "margin-top": "10%" }}>
                FAQ
              </h3>
              <SiteLoader status={state.loaderStatus} />
              <Helmet>
                <meta charSet="utf-8" />
                <title>{metaTags?.meta_title}</title>
                <meta name="description" content={metaTags?.meta_description} />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={siteUrl} />
                <meta
                  name="twitter:title"
                  content={metaTags?.meta_data?.og_title}
                />
                <meta
                  name="twitter:description"
                  content={metaTags?.meta_data?.og_description}
                />
                <meta name="twitter:image" content={SiteLogo} />

                <meta property="og:type" content="website" />
                <meta property="og:url" content={siteUrl} />
                <meta property="og:title" content={metaTags?.og_title} />
                <meta
                  property="og:description"
                  content={metaTags?.og_description}
                />
                <meta property="og:image" content={SiteLogo} />
              </Helmet>

              <img src={fqimg} className="img-fluid" title="" alt="" />
            </div>
          </div>
          <div className="react-tabs" data-tabs="true">
            <div className="Collapsible">
              <span className="Collapsible_trigger is-closed">
                <>
                  {faqlist?.general?.map((faq, index) => (
                    <Accordion
                      key={index}
                      defaultActiveKey="0"
                      className="faqheight"
                    >
                      <Accordion.Item eventKey="1">
                        <Accordion.Header>{faq.heading}</Accordion.Header>
                        <Accordion.Body className="accordionContent">
                          <p
                            dangerouslySetInnerHTML={{ __html: faq.content }}
                          ></p>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  ))}
                </>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Faq;
