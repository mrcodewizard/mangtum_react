import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { getPrivacypolicy, get_meta } from "../store/home";
import SiteLogo from "../components/img/logo.png";
import SiteLoader from "../SiteLoader";
import ThemeBreadcrumb from "../components/common/ThemeBreadcrumb";

const PrivacyPolicy = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPrivacypolicy());
  }, []);
  const Privacypolicy = useSelector((state) => state.home.Privacypolicy);
  const state = useSelector((state) => state.home);

  // META TAGS START
  useEffect(() => {
    dispatch(get_meta("privacy-policy"));
  }, ["privacy-policy"]);

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
      <ThemeBreadcrumb title="Privacy Policy" current_route="Privacy Policy" />

      <section className="single-wrapper section-wrapper">
        <div className="container">
          <>
            {Privacypolicy?.map((privacy) => (
              <>
                <div className="content">
                  <p dangerouslySetInnerHTML={{ __html: privacy.content }}></p>
                </div>{" "}
              </>
            ))}
          </>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
