import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
  useParams,
} from "react-router-dom";
import { Circles } from "react-loader-spinner";
import { Nav, Tab, Pagination, PageItem } from "react-bootstrap";
import { PaginationControl } from "react-bootstrap-pagination-control";

import product, { addWishlist, getVendorInfo } from "../store/product";
import { images } from "../utils/images";
import { mgtApi } from "../store/axios";
import "../styles/seller-store.css";
// import { Ci rcles } from "react-loader-spinner";
import defaultImg from "../components/img/default.png";
import SiteLogo from "../components/img/logo.png";
import SiteLoader from "../SiteLoader";
import { getHeaderData, get_meta } from "../store/home";
import { Helmet } from "react-helmet";

const SellerStore = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  const dispatch = useDispatch();
  const { storeSlug, page } = useParams();
  const search = useLocation().search;
  const searchParams = new URLSearchParams(search);
  const [currentPage, setCurrentPage] = useState(
    searchParams ? searchParams.get("page") : 1
  );

  const [products, setProducts] = useState([]);
  // const [loader, setLoader] = useState(false);
  const [query, setInputQuery] = useState("");

  const vendorInfo = useSelector((state) => state.prodLi.vendorInfo);
  const initialProducts = vendorInfo.products;
  const loaderStatus = useSelector((state) => state.prodLi.loaderStatus);
  const singleProduct = useSelector((state) => state.prodLi.singleProduct);

  const handleInputQuery = (value) => {
    if (value.length > 0) {
      setInputQuery(value);
    } else {
      setInputQuery("");
    }
  };

  const handleKeyPress = (e) => {
    const search_text = (e.target.value || query).toLowerCase();
    setLoader(true);
    if (search_text.length > 0) {
      dispatch(getVendorInfo(storeSlug, currentPage, search_text));
    } else {
      dispatch(getVendorInfo(storeSlug, 1));
      setCurrentPage(1);
      navigate(`/store/${storeSlug}?page=${1}`);
    }
  };

  const checkQuery = () => {
    const search_text = query.toLowerCase();
    if (search_text.length < 1) {
      navigate(`/store/${storeSlug}?page=${currentPage}`);
    }
  };

  /** get all meta information */
  const mainstate = useSelector((state) => state.home);
  const metaTags = mainstate.allmeta;
  const siteUrl = window.location.href;

  useEffect(() => {
    dispatch(get_meta("home_page"));
  }, []);

  /**  show the products return from search */
  useEffect(() => {
    setProducts(vendorInfo?.products);
    setLoader(loaderStatus);
  }, [query]);

  const handlePaginate = (pageNumber) => {
    /** set scroll to that section */
    const element = document.querySelector(".tab-content");
    element.scrollIntoView({
      behavior: "smooth",
    });

    setLoader(true);
    dispatch(getVendorInfo(storeSlug, pageNumber));
    setCurrentPage(pageNumber);
    navigate(`/store/${storeSlug}?page=${pageNumber}`);
  };

  /** find products on the basis of current page */
  useEffect(() => {
    setLoader(true);
    if (query && query.length) {
      dispatch(getVendorInfo(storeSlug, currentPage, query));
    } else {
      dispatch(getVendorInfo(storeSlug, currentPage));
    }
  }, [currentPage]);

  /** set the matched products to show */
  useEffect(() => {
    setProducts(vendorInfo?.products);
    setLoader(loaderStatus);
  }, [vendorInfo]);

  const [loader, setLoader] = useState(false);
  const { vendor, address } = vendorInfo;
  // console.log("Vendor Info", vendorInfo);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const user = localStorage.getItem("userDetails");

  const addToWishList = (product_id, index) => {
    if (user) {
      dispatch(addWishlist(product_id));

      let heartIcon = document.getElementById("heartIcon-" + index);
      heartIcon.classList.toggle("selected");
      heartIcon.classList.toggle("hearticoncolor");
    } else {
      navigate("/login");
    }
  };

  console.log(products);

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{vendor?.store_name}</title>
        <meta name="description" content={vendor?.bio} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={siteUrl} />
        <meta name="twitter:title" content={vendor?.store_name} />
        <meta name="twitter:description" content={vendor?.bio} />
        <meta name="twitter:image" content={SiteLogo} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={vendor?.store_name} />
        <meta property="og:description" content={vendor?.bio} />
        <meta property="og:image" content={SiteLogo} />
      </Helmet>

      <main>
        <section className="p-0 store-section">
          {/* <!-- seller profile --> */}
          <div className="container">
            <div
              className="seller-profile border border-white rounded"
              style={{
                backgroundImage: `url(${vendor?.store_cover_image})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="bgForProfile profile_box border border-white rounded">
                <img
                  className="rounded"
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  src={vendor?.avatar}
                  title={vendor?.store_name}
                  alt="store-avatar"
                />

                <h5 className="store_name"> {vendor?.store_name} </h5>
                <div className="seller-country-text">
                  <p>{address?.city},</p>
                  <p>{address?.country_name}</p>
                </div>
                <div className="star-svg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="112"
                    height="19"
                    viewBox="0 0 112 19"
                    fill="none"
                  >
                    <path
                      d="M3.825 19L5.45 11.975L0 7.25L7.2 6.625L10 0L12.8 6.625L20 7.25L14.55 11.975L16.175 19L10 15.275L3.825 19Z"
                      fill="#F6A92C"
                    />
                    <path
                      d="M26.825 19L28.45 11.975L23 7.25L30.2 6.625L33 0L35.8 6.625L43 7.25L37.55 11.975L39.175 19L33 15.275L26.825 19Z"
                      fill="#F6A92C"
                    />
                    <path
                      d="M49.825 19L51.45 11.975L46 7.25L53.2 6.625L56 0L58.8 6.625L66 7.25L60.55 11.975L62.175 19L56 15.275L49.825 19Z"
                      fill="#F6A92C"
                    />
                    <path
                      d="M72.825 19L74.45 11.975L69 7.25L76.2 6.625L79 0L81.8 6.625L89 7.25L83.55 11.975L85.175 19L79 15.275L72.825 19Z"
                      fill="#F6A92C"
                    />
                    <path
                      d="M112 7.24L104.81 6.62L102 0L99.19 6.63L92 7.24L97.46 11.97L95.82 19L102 15.27L108.18 19L106.55 11.97L112 7.24ZM102 13.4V4.1L103.71 8.14L108.09 8.52L104.77 11.4L105.77 15.68L102 13.4Z"
                      fill="#F6A92C"
                    />
                  </svg>
                  {/* <div></div> */}
                </div>
              </div>
            </div>
          </div>

          <Tab.Container id="left-tabs-example" defaultActiveKey="productsTab">
            <div className="container" style={{ marginTop: "80px" }}>
              <div
                className="page-title py-3 py-sm-0 px-1 px-sm-5 d-flex flex-wrap align-items-center justify-content-between"
                style={{ minheight: "70px" }}
              >
                <div className="store-tabs">
                  <Nav variant="tabs" className="d-flex align-items-center">
                    <Nav.Item className="">
                      <Nav.Link
                        eventKey="productsTab"
                        className="sllerNav px-0"
                      >
                        All Products
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="aboutTab" className="sllerNav ms-3">
                        About
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
                <div
                  className="searchtxt searchtxtSeller w-100"
                  spiketip-title="🔍 Search Anything"
                  spiketip-pos="left"
                  spiketip-color="error"
                >
                  <input
                    type="text"
                    name="query"
                    className="form-control"
                    placeholder="Search Product"
                    id="search_item"
                    value={query}
                    onKeyUp={(e) => handleKeyPress(e)}
                    onChange={(e) => handleInputQuery(e.target.value)}
                  />
                  <span
                    to=""
                    className="search_icon"
                    //  onClick={handleSearch}
                  >
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </span>
                </div>
              </div>
            </div>

            <Tab.Content>
              {/* <!-- vendor about tab  --> */}

              <Tab.Pane eventKey="aboutTab">
                <div className="container">
                  <div className="flex-between">
                    <div className="profile-dtl">
                      <h3>{vendor?.store_name}</h3>
                      <div className="content set-content-width">
                        {vendor?.bio}
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Pane>

              {/* <!-- end about tab  --> */}

              {/* <!-- vendor products tab  --> */}

              <Tab.Pane eventKey="productsTab" id="productsTab">
                <div className="container">
                  <div className="flex-space-between pt-4 pb-4">
                    <div className="counter grey-text">
                      Showing all {products?.length} results{" "}
                    </div>
                  </div>

                  {/* <!-- loader  --> */}
                  <div className="">
                    {loader ? (
                      <div className="d-flex align-items-center mb-4">
                        <div className="spinner">
                          <Circles
                            type="Circles"
                            color="#f6a92c"
                            height={60}
                            width={60}
                          />
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    <div className="grid-container">
                      {products?.map((plist, index) => {
                        return (
                          <div
                            key={index}
                            className={`position-relative w-100`}
                          >
                            <div className="wishlist-icon">
                              <i
                                className={
                                  plist?.wishlist_status
                                    ? "fa fa-heart hearticoncolor selected"
                                    : "fa fa-heart"
                                }
                                aria-hidden="true"
                                wish-class
                                id={`heartIcon-${index}`}
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToWishList(plist.id, index);
                                }}
                              ></i>
                            </div>
                            <Link
                              to={`/shop/${plist.product_slug}-${plist?.id}`}
                              className={"item product-card me-2 mb-3 w-100"}
                              keys={plist.id}
                            >
                              <div className="wow animated fadeInUp mt-0">
                                <div className="image-container">
                                  <img
                                    src={plist.main_image}
                                    className="img-size"
                                    title=""
                                    alt=""
                                    onError={(e) =>
                                      (e.target.src = images["defaultImg.png"])
                                    }
                                  />
                                </div>
                                <div
                                  style={{ width: "auto" }}
                                  className={`product-content py3`}
                                >
                                  <div className="category_title mt-3">
                                    {plist.product_name.length > 18
                                      ? plist.product_name.slice(0, 18) + "..."
                                      : plist.product_name}
                                  </div>
                                  <div className="categoryCartDes text-wrap">
                                    {plist.short_desc?.length > 37
                                      ? plist.short_desc?.slice(0, 37) + "..."
                                      : plist.short_desc}
                                  </div>
                                  <div className="price">
                                    <div className="grey-text">
                                      <span className={`text-warning`}>
                                        ${plist.regular_price}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div
                  className="d-flex justify-content-center pagination-root"
                  style={{ marginTop: "100px", overflow: "auto" }}
                >
                  <PaginationControl
                    page={currentPage}
                    between={4}
                    total={vendorInfo?.total_products}
                    limit={20}
                    changePage={(page) => handlePaginate(page)}
                    ellipsis={1}
                  />
                </div>
              </Tab.Pane>

              {/* <!-- end products tab  --> */}
            </Tab.Content>
          </Tab.Container>
        </section>
      </main>
    </div>
  );
};

export default SellerStore;
