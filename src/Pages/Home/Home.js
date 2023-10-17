import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import Carousel from "react-bootstrap/Carousel";
import { useDispatch, useSelector } from "react-redux";
import { getHomepage, get_meta } from "../../store/home";
import { Helmet } from "react-helmet";
import SiteLoader from "../../SiteLoader";
import useLoader from "../../components/useLoader";
import { useNavigate } from "react-router-dom";
import defaultImg from "../../components/img/default.png";
import Companies from "./components/Companies";
import { images } from "../../utils/images";
import moment from "moment/moment";
import { Col, Row } from "react-bootstrap";

const Home = () => {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
  const dispatch = useDispatch();
  const isLoading = useLoader();
  const state = useSelector((state) => state.home);
  const homerec = useSelector((state) => state.home.home_array);

  // BANNER

  useEffect(() => {
    dispatch(getHomepage());
  }, []);

  const Banner = homerec?.banner;

  // EDITORPIC

  const homepageData = useSelector((state) => state.home.homepage_data);

  const cate1 = "Beads"; //useSelector(state => state.home.editorpics_category_one);
  const cate2 = "Fashion Jewellery"; //useSelector(state => state.home.editorpics_category_two);
  const cate3 = "Fine Jwellery"; //useSelector(state => state.home.editorpics_category_three);
  const cate4 = "Gemstones"; //useSelector(state => state.home.editorpics_category_four);
  //'{"foo": 01}'

  const Bestsellers = homerec?.featured_products;
  // SERVICES
  // FRIENDLIST MARCKETPLACE
  const Services = homerec?.services;
  // POPULAR PRODUCT
  const Populars = homerec?.popular_products;

  const abouts = homerec?.about;
  // META TAGS START
  useEffect(() => {
    dispatch(get_meta("home-page"));
  }, ["home-page"]);
  const metaTags = state.allmeta;
  // const metaTags = useSelector((state) => state.contact.data.meta_data);
  const siteUrl = window.location.href;
  // META TAGS END
  let imgurL = "";
  if (
    homerec &&
    homerec.services &&
    homerec.services["0"] &&
    homerec.services["0"].image
  ) {
    imgurL = homerec.services["0"].image;
  } else {
  }
  // scroll top functionality start
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  // scroll top functionality end
  const navigate = useNavigate();
  const openAbout = () => {
    navigate("/about");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const bannerContent =
    homerec?.welcome_text?.length && homerec?.welcome_text[0];
  // console.log(bannerContent)

  return (
    <>
      {state.loaderStatus ? (
        <SiteLoader status={state.loaderStatus} />
      ) : (
        <>
          <div className="container mx-auto" style={{ maxWidth: "100%" }}>
            <Carousel interval={2000} style={{ minHeight: "280px" }}>
              {Banner?.map((imgBan, index) => {
                return (
                  <Carousel.Item key={index}>
                    <img
                      src={imgBan.image}
                      className="img-fluid h-100"
                      style={{ minHeight: "280px" }}
                      title=""
                      alt=""
                    />
                    <div className="swiper-caption">
                      <div className="caption-content">
                        <h6 className="slide-head text-black text-center text-md-start">
                          {bannerContent?.heading}
                        </h6>
                        <h1 className="slide-head text-white text-center text-md-start">
                          {bannerContent?.content}
                        </h1>
                        <p className="text-black text-center text-md-start">
                          Unlocking the Secrets of Small-Scale Satisfaction
                        </p>
                        {/* <h1 className="slide-head">
                          {homerec?.welcome_text["0"]?.heading}
                        </h1>
                        <p>{homerec?.welcome_text["0"]?.content}</p> */}
                        <Link
                          to="/categories"
                          className="shop-now shop_now_btn"
                        >
                          Shop Now
                        </Link>
                      </div>
                    </div>
                  </Carousel.Item>
                );
              })}
            </Carousel>
          </div>
          {/* <!-- editors pic  --> */}
          {/* {state.loaderStatus ? <SiteLoader status={state.loaderStatus} /> :  */}
          <>
            <div className="container">
              <section className="section-wrapper editorsPic">
                <div className="container">
                  <div className="row">
                    <div className="flex-between-header col-md-12 pt-0">
                      <div className="flex-between w-100 view-container">
                        <div className="ms-3">
                          <h3 className="wow animated fadeInUp editorsPic">
                            EDITOR’S PICK
                          </h3>
                          <span className="wow-text ">
                          Elevate Your Style with Art and Jewelry Unveiled{" "}
                          </span>
                        </div>
                        <div className="view-all">
                          <Link
                            to={"/categories"}
                            className="d-flex align-items-center"
                          >
                            <span>View All</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="17"
                              height="17"
                              viewBox="0 0 17 17"
                              fill="none"
                            >
                              <g clipPath="url(#clip0_42_70)">
                                <path
                                  d="M11.4551 7.79165L7.65565 3.99215L8.65723 2.99057L14.1666 8.49999L8.65723 14.0094L7.65565 13.0078L11.4551 9.20832H2.83331V7.79165H11.4551Z"
                                  fill="black"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_42_70">
                                  <rect width="17" height="17" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                            {/* <i className="fa fa-arrow-right "></i> */}
                          </Link>
                        </div>
                        <Helmet>
                          <meta charSet="utf-8" />
                          <title>{metaTags?.meta_data?.meta_title}</title>
                          <meta
                            name="description"
                            content={metaTags?.meta_data?.meta_description}
                          />
                          <meta
                            name="twitter:card"
                            content="summary_large_image"
                          />
                          <meta name="twitter:url" content={siteUrl} />

                          <meta
                            name="twitter:title"
                            content={metaTags?.meta_data?.og_title}
                          />
                          <meta
                            name="twitter:description"
                            content={metaTags?.meta_data?.og_description}
                          />

                          <meta
                            name="twitter:image"
                            content={images["logo.png"]}
                          />

                          <meta property="og:type" content="website" />
                          <meta property="og:url" content={siteUrl} />
                          <meta
                            property="og:title"
                            content={metaTags?.meta_data?.og_title}
                          />
                          <meta
                            property="og:description"
                            content={metaTags?.meta_data?.og_description}
                          />
                          <meta
                            property="og:image"
                            content={images["logo.png"]}
                          />
                        </Helmet>
                      </div>
                    </div>
                    <div className="row gutter">
                      <div className="col-md-6 col-sm-6">
                        <Link
                          to="/beads"
                          className="flex-colmn mx-100 wow animated fadeInUp"
                        >
                          <img
                            src={images["img1.jpg"]}
                            className=""
                            title=""
                            alt={cate1}
                          />
                          <p className="overlay-heading">{cate1}</p>
                        </Link>
                      </div>
                      <div className="col-md-3 col-sm-6">
                        <Link
                          to="/fashion-jewelry"
                          className="flex-colmn wow animated fadeInUp"
                        >
                          <img
                            src={images["img2.jpg"]}
                            className=""
                            title=""
                            alt=""
                          />
                          <p className="overlay-heading">{cate2}</p>
                        </Link>
                      </div>
                      <div className="col-md-3 col-sm-12">
                        <div className="row sm-col">
                          <div className="col-sm-6 col-md-12">
                            <Link
                              to="/fine-jewelry"
                              className="flexrow wow animated fadeInUp rm-2"
                            >
                              <img
                                src={images["img3.png"]}
                                className=""
                                title=""
                                alt=""
                              />
                              <p className="overlay-heading">{cate3}</p>
                            </Link>
                          </div>
                          <div className="col-sm-6 col-md-12">
                            <Link
                              to="/gemstones"
                              className="flexrow wow animated fadeInUp"
                            >
                              <img
                                src={images["img4.jpg"]}
                                className=""
                                title=""
                                alt=""
                              />
                              <p className="overlay-heading">{cate4}</p>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            {/* //  end editors pic */}

            {/* BESTSELLER PRODUCT  */}

            {/* <section className="section-wrapper featured"> */}

            <div
              className=""
              style={{ backgroundColor: "#F8F8F8", padding: "100px 0" }}
            >
              <div className="container mx-auto">
                <div className="wrapper-header text-center mb-4">
                  <div className="grey-text wow animated fadeInUp featured_product">
                    Featured Products
                  </div>
                  <div
                    className="wow animated fadeInUp bestsellerproduct text-uppercase"
                    data-wow-delay="0.3s"
                  >
                    Bestseller Products
                  </div>
                 {/* <p className="wow animated fadeInUp product-text text-dark-emphasis">
                    Problems trying to resolve the conflict between{" "}
                  </p> */}
                </div>

                {/* <!-- product  --> */}
                <div className="grid-container">
                  {Bestsellers?.map((Bestseller, index) => {
                    return (
                      <div className="mb-4 bg-white">
                        <Link
                          to={`/shop/${Bestseller.pro_slug}-${Bestseller?.id}`}
                          onClick={handleScrollToTop}
                          className=""
                          key={index}
                        >
                          <div className="">
                            <div className="image-container">
                              <img
                                src={Bestseller.main_image}
                                className="img-size"
                                title=""
                                alt=""
                                onError={(e) => (e.target.src = defaultImg)}
                              />
                            </div>
                            <div
                              className="product-content home-page-card px-1"
                              style={{
                                padding: "20px 0",
                                height: "fit-content",
                              }}
                            >
                              <h6
                                className="fw-bold mb-2"
                                style={{
                                  color: "#252B42",
                                  fontFamily: "Montserrat",
                                }}
                              >
                                {Bestseller.product_name.length > 18
                                  ? Bestseller.product_name.slice(0, 18) + "..."
                                  : Bestseller.product_name}
                              </h6>
                              <div className="categoryCartDes mt-1 mb-3 des-container text-wrap">
                                <small
                                  className=""
                                  style={{
                                    color: "#737373",
                                    fontFamily: "Montserrat",
                                    fontWeight: "400",
                                  }}
                                >
                                  {Bestseller.short_desc.length > 37
                                    ? Bestseller.short_desc.slice(0, 37) + "..."
                                    : Bestseller.short_desc}
                                </small>
                              </div>
                              {/* <div
                                  className="title grey-text mb-2  card_text"
                                  style={{ fontSize: "13px" }}
                                >
                                  {Bestseller.short_desc.length > 14
                                    ? Bestseller.short_desc.slice(0, 14) + "..."
                                    : Bestseller.short_desc}
                                </div> */}
                              <div className="price">
                                <div
                                  className="grey-text"
                                  style={{ fontFamily: "Montserrat" }}
                                >
                                  {/* {Bestseller && Bestseller.regular_price ? (
                                    <>
                                      <del className="me-1">${Bestseller.regular_price}</del>
                                    </>
                                  ) : (
                                    ""
                                  )} */}
                                  <span className="text-warning ms-1">
                                    ${Bestseller && Bestseller.regular_price}
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

                <Link to="/categories">
                  <button className="view-more">View More Products</button>
                </Link>
              </div>
            </div>
            {/* <!-- end  --> */}

            {/* ABOUT */}
            <div className="bg-white ">
              <>
                <section
                  className="section-wrapper about-wrapper"
                  style={{
                    height: "100%",
                    backgroundImage: `url(${homerec?.about?.banner_image})`,
                  }}
                >
                  <div className="container white-lay">
                    <div className="">
                      <div className="row">
                        <div className="head-wrap-about col-md-6 about-section">
                          <h4>{homerec?.about?.heading}</h4>
                          <h3>{homerec?.about?.name}</h3>
                          <div className="" style={{ maxWidth: "400px" }}>
                            <p
                              dangerouslySetInnerHTML={{
                                __html: homerec?.about?.homecontent,
                              }}
                            ></p>
                          </div>
                          {/* <Link to="/about" className="btn btn-sm btn-warning" onClick={handleScrollToTop}>Know More</Link> */}
                          <Link
                            to="/categories"
                            className="shop-now"
                            onClick={() => openAbout()}
                          >
                            SHOP NOW
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            </div>

            {/* FRIENDLIST MARKETPLACE */}
            {/* SERVICES */}

            <>
              <section className="section-wrapper marketplace">
                {Services?.map((services_data, index) => {
                  return (
                    <div className="services" key={index}>
                      <div
                        className="respon"
                        style={{
                          backgroundImage: `url(${services_data.image}), url(${images["marketplace2.png"]})`,
                        }}
                        // style={{
                        //   backgroundImage: `url(${services_data.image}), url(${services_data.image})`,
                        //   backgroundRepeat: 'no-repeat', // This specifies how the images should be repeated.
                        //   backgroundPosition: 'right, left', // This specifies the position of each image.
                        // }}
                      >
                        <div className="marketplace-wrap container">
                          <h1 className="mb-2">{services_data.heading}</h1>
                          <h4 className="content mb-2">
                            {services_data.content.length > 190
                              ? services_data.content.slice(0, 240) + "..."
                              : services_data.content}
                            ...
                          </h4>
                          <a
                            href={process.env.REACT_APP_JOIN_URL}
                            target="_blank"
                            className="join-now"
                          >
                            Join Now
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </section>
            </>

            {/* <!-- POPULAR PRODUCT --> */}
            <div>
              <section
                className="section-wrapper featured bg-light"
                style={{ marginTop: "50px", paddingTop: "20px" }}
              >
                <div className="container">
                  <div className="wrapper-header text-center mb-4">
                    <h3
                      className="wow animated fadeInUp bestsellerproduct"
                      data-wow-delay="0.3s"
                    >
                      Popular Products
                    </h3>
                  {/*  <p className="wow animated fadeInUp product-text">
                      Problems trying to resolve the conflict between
                    </p>*/}
                  </div>

                  {/* <!-- product  --> */}
                  {/* <!-- Swiper --> */}
                  <Swiper
                    className="w-100"
                    breakpoints={{
                      320: {
                        slidesPerView: 1,
                      },
                      400: {
                        slidesPerView: 2,
                      },
                      600: {
                        slidesPerView: 3,
                      },
                      768: {
                        slidesPerView: 3,
                      },
                      // when window width is >= 768p
                      // when window width is >= 992px
                      992: {
                        slidesPerView: 5,
                      },
                    }}
                    spaceBetween={15}
                    slidesPerView={5}
                    freeMode={true}
                    modules={[Autoplay]}
                    autoplay={{
                      delay: 2000,
                      disableOnInteraction: false,
                    }}
                    speed={1000}
                    watchSlidesProgress={true}
                  >
                    {Populars?.map((Bestseller, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <div className="swiper popularProduct">
                            <div className="swiper-wrapper">
                              <div className="swiper-slide">
                                <div className="mb-4 bg-white">
                                  <Link
                                    to={`/shop/${Bestseller.pro_slug}-${Bestseller?.id}`}
                                    onClick={handleScrollToTop}
                                    className=""
                                    key={index}
                                  >
                                    <div className="">
                                      <div className="image-container">
                                        <img
                                          src={Bestseller.main_image}
                                          className="img-size"
                                          title=""
                                          alt=""
                                          onError={(e) =>
                                            (e.target.src = defaultImg)
                                          }
                                        />
                                      </div>
                                      <div
                                        className="product-content home-page-card px-1"
                                        style={{
                                          padding: "20px 0",
                                          height: "fit-content",
                                        }}
                                      >
                                        <h6
                                          className=" fw-bold mb-2"
                                          style={{
                                            color: "#252B42",
                                            fontFamily: "Montserrat",
                                          }}
                                        >
                                          {Bestseller.product_name.length > 18
                                            ? Bestseller.product_name.slice(
                                                0,
                                                18
                                              ) + "..."
                                            : Bestseller.product_name}
                                        </h6>
                                        <div className="categoryCartDes mt-1 des-container text-wrap">
                                          <small
                                            className=""
                                            style={{
                                              color: "#737373",
                                              fontFamily: "Montserrat",
                                              fontWeight: "400",
                                            }}
                                          >
                                            {Bestseller.short_desc.length > 37
                                              ? Bestseller.short_desc.slice(
                                                  0,
                                                  37
                                                ) + "..."
                                              : Bestseller.short_desc}
                                          </small>
                                        </div>
                                        <div className="price py-3">
                                          <div
                                            className="grey-text"
                                            style={{ fontFamily: "Montserrat" }}
                                          >
                                            {/* {Bestseller && Bestseller.regular_price ? (
                                              <>
                                                <del className="me-1">${Bestseller.regular_price}</del>
                                              </>
                                            ) : (
                                              ""
                                            )} */}
                                            <span className="text-warning ms-1">
                                              $
                                              {Bestseller &&
                                                Bestseller.regular_price}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>
              </section>

              {/* <Companies /> */}
            </div>
          </>
        </>
      )}
    </>
  );
};

export default Home;
