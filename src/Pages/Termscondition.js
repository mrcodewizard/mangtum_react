import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getPrivacypolicy, get_meta } from "../store/home";
import SiteLoader from "../SiteLoader";

import { Helmet } from "react-helmet";
import SiteLogo from "../components/img/logo.png";
import ThemeBreadcrumb from "../components/common/ThemeBreadcrumb";

const Termscondition = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPrivacypolicy());
  }, []);
  const termscondition = useSelector((state) => state.home.tmc);
  const state = useSelector((state) => state.home);

  // META TAGS START
  useEffect(() => {
    dispatch(get_meta("terms-and-condition"));
  }, ["terms-and-condition"]);
  const metaTags = state.allmeta;

  const siteUrl = window.location.href;
  // META TAGS END

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
      <SiteLoader status={state.loaderStatus} />
      <ThemeBreadcrumb
        title="Terms and Conditions"
        current_route="Terms and Conditions"
      />
      <section className="single-wrapper section-wrapper">
        <div className="container">
          <>
            {termscondition?.map((t) => (
              <>
                <div className="content">
                  <p dangerouslySetInnerHTML={{ __html: t.content }}></p>
                </div>{" "}
              </>
            ))}
          </>
        </div>
      </section>
    </div>
  );
};

export default Termscondition;
