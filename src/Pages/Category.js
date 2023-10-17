import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import { getHeaderData, get_meta } from "../store/home";
import SiteLogo from "../components/img/logo.png";
import ThemeBreadcrumb from "../components/common/ThemeBreadcrumb";

export const Category = () => {
  const headerCategories = useSelector((state) => state.home.headerCategories);
  const dispatch = useDispatch();
  /** get all meta information */
  const mainstate = useSelector((state) => state.home);
  const metaTags = mainstate.allmeta;
  const siteUrl = window.location.href;

  useEffect(() => {
    dispatch(get_meta("home_page"));
  }, []);

  // console.log(headerCategories);
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
        <ThemeBreadcrumb title="Categories" current_route="Categories" />

        <section className="single-wrapper">
          <div className="container mx-auto" style={{ marginTop: "100px" }}>
            {/* <div className="flex-space-between pt-4 pb-4">
              <div className="counter grey-text">Showing all 12 results </div>
              <div className="product-filter">
                <div className="views-setting">
                  <h4 className="grey-text">Views:</h4>
                  <a href=" ">
                    <i className="ri-layout-grid-fill"></i>
                  </a>
                  <a href="#link">
                    <i className="ri-list-check-2"></i>
                  </a>
                </div>
                <select name="" className="form-select" id="">
                  <option value="">Popularity</option>
                  <option value="">Latest</option>
                  <option value="">Oldest</option>
                </select>
                <button className="btn btn-md btn-warning">Filter</button>
              </div>
            </div> */}
            {/* <!-- categories list  --> */}
            <div className="row categories-row pb-5 mx-auto">
              {headerCategories?.map((cate, i) => (
                <Link
                  to={`/${cate?.slug}`}
                  className="col-md-4 mb-4"
                  style={{ maxHeight: "376px" }}
                >
                  <div className="flex-column mx-100 mb-4 h-100 wow animated fadeInUp">
                    <img
                      src={cate?.cate_img}
                      className="img-fluid w-100 h-100"
                      title={cate?.cate_name}
                      alt="category_image"
                      style={{ objectFit: "cover" }}
                    />
                    <p className="overlay-heading">{cate?.cate_name}</p>
                  </div>
                </Link>
              ))}

              {/* <div className="col-md-4">
                <div className="flex-colmn mx-100 mb-4 h-auto wow animated fadeInUp">
                  <img src="assets/img/img1.jpg" className="" title="" alt="" />
                  <a href="#link" className="overlay-heading">
                    Fine Jewelery
                  </a>
                </div>
              </div>
              <div className="col-md-4">
                <div className="flex-colmn mx-100 mb-4 h-auto wow animated fadeInUp">
                  <img src="assets/img/img1.jpg" className="" title="" alt="" />
                  <a href="#link" className="overlay-heading">
                    Fine Jewelery
                  </a>
                </div>
              </div>
              <div className="col-md-4">
                <div className="flex-colmn mx-100 mb-4 h-auto wow animated fadeInUp">
                  <img src="assets/img/img1.jpg" className="" title="" alt="" />
                  <a href="#link" className="overlay-heading">
                    Fine Jewelery
                  </a>
                </div>
              </div>
              <div className="col-md-4">
                <div className="flex-colmn mx-100 mb-4 h-auto wow animated fadeInUp">
                  <img src="assets/img/img1.jpg" className="" title="" alt="" />
                  <a href="#link" className="overlay-heading">
                    Fine Jewelery
                  </a>
                </div>
              </div>
              <div className="col-md-4">
                <div className="flex-colmn mx-100 mb-4 h-auto wow animated fadeInUp">
                  <img src="assets/img/img1.jpg" className="" title="" alt="" />
                  <a href="#link" className="overlay-heading">
                    Fine Jewelery
                  </a>
                </div>
              </div> */}
            </div>
            {/* <!-- end  --> */}
          </div>
        </section>
        {/* <hr /> */}
        {/* <!--  --------------------------------- clients  --------------------------------- --> */}

        {/* <section className="section-wrapper">
          <div className="container">
            <div className="clients-wrap">
              <h4 className="text-center">
                Trusted By Over 4000 Big Companies
              </h4>
              <div className="clientLogo">
                <a href="#link">
                  <img
                    src="assets/img/logo1.png"
                    className="img-fluid"
                    title=""
                    alt=""
                  />
                </a>
                <a href="#link">
                  <img
                    src="assets/img/logo2.png"
                    className="img-fluid"
                    title=""
                    alt=""
                  />
                </a>
                <a href="#link">
                  <img
                    src="assets/img/logo3.png"
                    className="img-fluid"
                    title=""
                    alt=""
                  />
                </a>
                <a href="#link">
                  <img
                    src="assets/img/logo4.png"
                    className="img-fluid"
                    title=""
                    alt=""
                  />
                </a>
                <a href="#link">
                  <img
                    src="assets/img/logo5.png"
                    className="img-fluid"
                    title=""
                    alt=""
                  />
                </a>
                <a href="#link">
                  <img
                    src="assets/img/logo6.png"
                    className="img-fluid"
                    title=""
                    alt=""
                  />
                </a>
              </div>
            </div>
          </div>
        </section> */}
      </main>
    </div>
  );
};

export default Category;
