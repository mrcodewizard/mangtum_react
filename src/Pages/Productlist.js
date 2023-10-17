import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import SiteLogo from "../components/img/logo.png";
import SiteLoader from "../SiteLoader";
import { getHeaderData,getHomepage, get_meta} from "../store/home";

// import { Link } from "react-router-dom";

const Productlist = () => {
  const dispatch = useDispatch();

  /** get all meta information */
  const mainstate = useSelector(state => state.home);
  const metaTags = mainstate.allmeta;
  const siteUrl = window.location.href;

  useEffect(() => {
      dispatch(get_meta("home_page"));
  }, []);

  useEffect(() => {
    dispatch(getHomepage())
  }, [])
  const homepageData = useSelector(state => state.home.homepage_data)

  const productdetail = (e) => {

  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{metaTags?.meta_data?.meta_title}</title>
        <meta name="description" content={metaTags?.meta_data?.meta_description} />

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
        <meta property="og:title" content={metaTags?.meta_data?.og_title} />
        <meta property="og:description" content={metaTags?.meta_data?.og_description} />
        <meta property="og:image" content={SiteLogo} />
      </Helmet>

      <main>
        <div className="bg-light inner-breadcrumb">
          <div className="container">
            <div className="breadcrumb-head">
              <h3>Product Category Name</h3>
              <nav className="breadcrumb-wrap">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">Product Cat Name</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
        <section className="single-wrapper">
          <div className="container">
            <div className="flex-space-between pt-4 pb-4">
              <div className="counter grey-text">Showing all 12 results </div>
              <div className="product-filter">
                <div className="dropdown">
                  <button className="btn btn-outline-secondary me-2 dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expande d="false">Price</button>
                  <div className="dropdown-menu pre-scrollable" aria-labelledby="dropdownMenuButton">
                    <Link className="dropdown-item" to="#">$0 - $20</Link>
                    <Link className="dropdown-item" to="#">$20 - $50</Link>
                    <Link className="dropdown-item" to="#">$50 - $100</Link>
                    <Link className="dropdown-item" to="#">$100 - $150</Link>
                    <Link className="dropdown-item" to="#">$150 - $200</Link>
                  </div>
                </div>
                <div className="dropdown">
                  <button className="btn btn-outline-secondary me-2 dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expande d="false">Bead Name</button>
                  <div className="dropdown-menu pre-scrollable" aria-labelledby="dropdownMenuButton">
                    <Link className="dropdown-item" to="#"><input type="checkbox" className="form-check" /> Product Name</Link>
                    <Link className="dropdown-item" to="#"><input type="checkbox" className="form-check" /> Product Name</Link>
                    <Link className="dropdown-item" to="#"><input type="checkbox" className="form-check" /> Product Name</Link>
                    <Link className="dropdown-item" to="#"><input type="checkbox" className="form-check" /> Product Name</Link>
                    <Link className="dropdown-item" to="#"><input type="checkbox" className="form-check" /> Product Name</Link>
                  </div>
                </div>
                <button className="btn btn-md btn-warning">Filter</button>
              </div>
            </div>
            {/* <!-- product  --> */}
            <div className="flex-product flexgrow">
              {homepageData?.exclusive_product?.map(productlist => {
                return (
                  <div className="item" onClick={productdetail}>
                    <div className="product-row wow animated fadeInUp">
                      <div className="product-cover">

                        <img src={productlist.main_image} className="img-fluid" title="" alt="" />

                      </div>
                      {/* <!-- product-cont  --> */}
                      <div className="product-content p-3">
                        <h4>{productlist.category?.cate_name}</h4>
                        <div className="title grey-text mb-2">{productlist?.short_desc}</div>
                        <div className="price">
                          <div className="grey-text">${productlist?.regular_price} <span className="text-warning">${productlist?.sell_price}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
        {/* <hr/> */}

      </main>

    </div>
  )
}

export default Productlist