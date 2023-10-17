import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addWishlist,
  getProductCartCount,
  getRelatedProducts,
  getSingleProductDetail,
  getVendorInfo,
  getWishlistProduct,
} from "../store/product";
import { AddToCart, getCartData } from "../store/newCart";
import { getHeaderData } from "../store/home";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Add this to the parent component that contains the Carousel
import "react-responsive-carousel/lib/styles/carousel.min.css";
import SiteLoader from "../SiteLoader";
import { fixChar } from "../utils/helper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { images } from "../utils/images";
import { Col, Image, Modal, Nav, Row, Tab } from "react-bootstrap";
import {
  MagnifierContainer,
  MagnifierPreview,
  MagnifierZoom,
} from "react-image-magnifiers";
import { Helmet } from "react-helmet";

let variantData = {};
const SingleProduct = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { productTitle } = useParams();
  const segments = productTitle.split("-");
  const lastSegment = segments.pop();
  const desiredPart = segments.join("-");

  const siteUrl = window.location.href;

  // const
  let userDetails = localStorage.getItem("userDetails");
  let data = JSON.parse(userDetails);
  let user_id = data?.ID;
  let isLogin = false;
  if (user_id) isLogin = true;
  else isLogin = false;
  const filterUrl = window.location.pathname.split("shop/").pop();
  const productSlug = filterUrl.split("/");
  const prodSlug = productSlug[2];

  const [modalImages, setModalImages] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);

  // use selector
  const st = useSelector((state) => state.prodLi);
  const singleProduct = useSelector((state) => state.prodLi.singleProduct);
  const { loader, status } = useSelector((state) => state.cart);
  const { statusKey } = useSelector((state) => state.prodLi);
  const galleryI = useSelector((state) => state.prodLi.galleryimages);
  const relatedProducts = useSelector((state) => state.prodLi.related_prod);
  const inDetails = useSelector((state) => state.prodLi.productVariations);
  const userCartProductCount = useSelector(
    (state) => state.prodLi.userCartProductCount
  );
  const storeInfoTab = useSelector((state) => state.prodLi.vendorInfo);
  const shippingDetails = useSelector(
    (state) => state.prodLi.singleProduct?.product.shipping_profile
  );
  const wish = useSelector((state) => state.prodLi.wishlist_status);
  const cartData = useSelector((state) => state.newCart.cartData);
  // console.log('cartData: ', cartData);

  const image = [
    // {
    //   original: singleProduct?.product?.main_image,
    //   thumbnail: singleProduct?.product?.main_image,
    //   originalHeight: 350,
    //   originalWidth: 350,
    //   thumbnailHeight: 90,
    //   thumbnailWidth: 60,
    // },
    ...galleryI.map((imgList) => ({
      original: imgList,
      thumbnail: imgList,
      originalHeight: 350,
      originalWidth: 350,
      thumbnailHeight: 90,
      thumbnailWidth: 60,
    })),
  ];

  const product_id = singleProduct?.product?.id;
  const subCateId = singleProduct?.product?.sub_ids["0"];
  let pTag = storeInfoTab?.vendor?.return_policy;
  const sanitizedText = pTag?.replace(/<[^>]+style="[^"]*"[^>]*>|&nbsp;/g, "");
  let pTagTwo = storeInfoTab?.vendor?.terms_conditions;
  const sanitizedTextTwo = pTagTwo?.replace(
    /<[^>]+style="[^"]*"[^>]*>|&nbsp;/g,
    ""
  );
  let pTagThree = storeInfoTab?.vendor?.shipping_policy;
  const sanitizedTextThree = pTagThree?.replace(
    /<[^>]+style="[^"]*"[^>]*>|&nbsp;/g,
    ""
  );

  // use state
  const [invId, setInvId] = useState("");
  const [stockVal, setStockVal] = useState(0);
  const [regularPrice, setRegularPrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [dbQuantity, setDbQuantity] = useState(1);
  const [prodQty, setProdQty] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [buttonShouldDisable, setButtonShouldDisable] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState(
    Array(inDetails?.variation?.length).fill(false)
  );
  const [arr, setArr] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [activeTabNew, setActiveTabNew] = useState("vp");
  const [combinationKey, setCombinationKey] = useState(null);
  const [showFullText, setShowFullText] = useState(500);
  const [updated, setUpdated] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setProdQty(1);
  }, [pathname]);

  const lightGallery = useRef(null);
  const getItems = useCallback(() => {
    return galleryI.map((item, index) => {
      return (
        <a
          key={index}
          data-lg-size={item}
          className="gallery-item"
          data-src={item}
        >
          <img
            style={{ maxWidth: "80px" }}
            className="img-responsive"
            src={item}
            alt={`Image ${index}`}
          />
        </a>
      );
    });
  }, [galleryI]);

  // method
  const addToCart = (pro_slug) => {
    if (!isLogin) {
      navigate("/login");
      return;
    }

    // const isVariationSelected = !inDetails
    //     || !inDetails.variation
    //     || inDetails.variation.every((variation, index) => {
    //         const selectedOption = selectedRadio[index];
    //         return (selectedOption && variation.values.find((val) => val.attr_value_id === selectedOption)?.attr_value_id === selectedOption);
    //     });

    const isProductHasVariations = !Array.isArray(
      singleProduct?.product_variations?.combinations
    );

    if (isProductHasVariations) {
      // Send with variations
      dispatch(
        AddToCart({
          pro_slug,
          user_id,
          product_id: singleProduct.product?.id,
          quantity: prodQty,
          selectedAttributes,
          sku: singleProduct?.product_variations?.combinations[combinationKey]
            ?.sku,
          color: selectedColor,
          test: "variation request",
        })
      );

      toast.success("Cart update successful!");
    } else {
      // Without Variations
      dispatch(
        AddToCart({
          pro_slug,
          quantity: prodQty,
          user_id,
          product_id: singleProduct.product?.id,
          test: "without variation request",
        })
      );

      toast.success("Cart update successfull!");
    }

    getHeaderData({ user_id });
  };
  const incrementProdQuantity = () => {
    if (prodQty < dbQuantity) {
      setProdQty((prev) => prev + 1);
      setButtonShouldDisable(false);
    } else {
      setButtonShouldDisable(true);
    }
  };
  const decrementProdQuantity = () => {
    setProdQty((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleTabChange = (tab) => setActiveTab(tab);
  const handleTabChangeNew = (tab) => setActiveTabNew(tab);
  const handleOrderClick = (vendor_id, shipping_profile) => {
    navigate(`/store/${storeInfoTab?.vendor?.store_slug}`, {
      state: {
        vendor_id: vendor_id,
        shipping_profile: shipping_profile,
      },
    });
  };
  const handleScrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });
  const addToWishList = (product_id, index) => {
    dispatch(addWishlist(product_id));
    dispatch(getWishlistProduct());

    let heartIcon = document.getElementById("heartIcon-" + index);
    heartIcon.classList.toggle("selected");
    heartIcon.classList.toggle("hearticoncolor");
  };
  const addToWishListWithoutIndex = (product_id) => {
    dispatch(addWishlist(product_id));

    let heartIcon = document.getElementById("heartIconWithoutIndex");
    heartIcon.classList.toggle("selected");
    heartIcon.classList.toggle("hearticoncolor");
    dispatch(getWishlistProduct());
  };

  const handleAttributeChange = (attributeId, value) => {
    setSelectedAttributes((prevAttributes) => {
      const attributeIndex = prevAttributes.findIndex(
        (attr) => attr.id === attributeId
      );

      const updatedAttributes = [...prevAttributes];

      if (attributeIndex !== -1) {
        updatedAttributes[attributeIndex].value = value;
      } else {
        updatedAttributes.push({ id: attributeId, value });
      }
      updatedAttributes.sort((a, b) => {
        const aIndex =
          singleProduct.product_variations?.choice_attributes_combination.findIndex(
            (attr) => attr.id === a.id
          );
        const bIndex =
          singleProduct.product_variations?.choice_attributes_combination.findIndex(
            (attr) => attr.id === b.id
          );
        return aIndex - bIndex;
      });
      return updatedAttributes;
    });
  };
  const handleColorChange = (color) => setSelectedColor(color);
  const handleRadioChange = (value, i, inventory_id, id) => {
    const allLabels = document.querySelectorAll("label");
    allLabels.forEach((label) => {
      const invValue = label.getAttribute("data-inv");
      if (invValue === inventory_id) {
        label.classList.remove("hide");
      } else {
        label.classList.add("hide");
      }
    });

    const newSelectedRadio = [...selectedRadio];
    newSelectedRadio[i] = value;
    setSelectedRadio(newSelectedRadio);
    arr[i] = value;
    if (arr.length > 1) Object.keys(arr).sort();
    setArr(arr);
    let data = Object.values(arr).toString().replaceAll(",", "");
  };

  // use Effect
  useEffect(() => {
    dispatch(getSingleProductDetail(desiredPart));
    dispatch(getCartData(true));
  }, [desiredPart, productTitle]);

  useEffect(() => {
    const cartItemsData = [].concat(...cartData.map((obj) => obj.cart_items));

    const itemExistInCart = cartItemsData.find(
      (item) => item.pro_slug === prodSlug
    );

    // console.log('itemExistInCart: ', itemExistInCart)

    if (itemExistInCart) {
      setProdQty(itemExistInCart.quantity);
    } else {
      setProdQty(1);
    }
  }, [cartData, pathname]);

  useEffect(() => {
    (async () => {
      if (singleProduct) {
        // console.log(singleProduct);

        // dispatch(
        //     getVendorInfo(storeSlug)
        // );

        dispatch(
          getRelatedProducts(
            singleProduct?.product?.id,
            singleProduct?.product?.subcate_ids,
            user_id
          )
        );
        setDbQuantity(singleProduct?.product?.stock);
      }
    })();
  }, [singleProduct?.product]);

  useEffect(() => {
    variantData = {};
    singleProduct?.product &&
      Object.entries(singleProduct?.product.varients).map(([varient]) => {
        variantData = { ...variantData, [varient]: "" };
      });

    setStockVal(singleProduct?.product && singleProduct?.product.stock);
    setRegularPrice(
      singleProduct?.product && singleProduct?.product?.regular_price
    );
    setSellPrice(singleProduct?.product && singleProduct?.product?.sell_price);
  }, [singleProduct?.product]);
  useEffect(() => {
    if (user_id && product_id) {
      dispatch(getProductCartCount(user_id, product_id));
    }
  }, [product_id]);
  useEffect(() => {
    setDbQuantity(userCartProductCount);
  }, [userCartProductCount]);
  useEffect(() => {
    if (wish === 1) {
      let element = document.getElementsByClassName("wish-class")[0];
      if (element) {
        element.style.color = "red";
      }
    }
    if (wish === 0) {
      let element = document.getElementsByClassName("wish-class")[0];
      if (element) {
        element.style.color = "#ffc107";
      }
    }
  }, [wish]);

  useEffect(() => {
    if (selectedAttributes) {
      let combinationKey = "";
      if (selectedAttributes?.length === 0) {
        combinationKey += selectedColor;
      } else {
        combinationKey += selectedColor + "-";
      }

      combinationKey += `${selectedAttributes
        .map((attr) => attr.value)
        .join("-")}`;

      setCombinationKey(combinationKey);
      const cartItemsData = [].concat(...cartData.map((obj) => obj.cart_items));

      const itemExistInCart = cartItemsData.find(
        (item) => item.product_id === singleProduct?.product.id
      );

      if (itemExistInCart) {
        // console.log("exist :", itemExistInCart);
        setProdQty(itemExistInCart.quantity);
      } else {
        setProdQty(1);
      }

      if (
        singleProduct?.product_variations?.combinations[combinationKey]?.qty
      ) {
        setDbQuantity(
          singleProduct?.product_variations?.combinations[combinationKey]?.qty
        );
      } else {
        setDbQuantity(singleProduct?.product?.stock);
      }

      setUpdated(!updated);
    }
  }, [cartData, singleProduct?.product, selectedAttributes, selectedColor]);

  useEffect(() => {
    const initialAttributes =
      singleProduct?.product_variations?.choice_attributes_combination.map(
        (attr) => ({
          id: attr.id,
          value: attr.values[0],
        })
      );
    if (singleProduct?.product_variations?.colors) {
      let color = Object.entries(singleProduct?.product_variations?.colors)[0];
      if (color) {
        setSelectedColor(color[1]);
      }
    }
    setSelectedAttributes(initialAttributes);
  }, [singleProduct?.product_variations]);
  useEffect(() => {
    if (statusKey || status) {
      setIsVisible(true);

      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [statusKey, status]);

  const CustomSlide = ({ item }) => {
    const { original, description, width, height } = item;
    return (
      <div
        className="custom-slide"
        style={{
          overflow: "visible",
          position: "relative",
          maxHeight: "500px",
        }}
      >
        <MagnifierContainer
          className="position-relative"
          style={{
            maxHeight: "450px",
            width: "100%",
            position: "relative",
            objectFit: "fill",
          }}
        >
          <MagnifierPreview
            imageSrc={original}
            className="previewImg"
            style={{ maxHeight: "100%", objectFit: "fill" }}
          />
          <MagnifierZoom
            imageSrc={original}
            className="zoomImg"
            style={{
              maxHeight: "450px",
              height: "100%",
              width: "100%",
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              zIndex: "100",
            }}
          />

          <div
            className="position-absolute d-flex justify-content-center align-items-center bg-light"
            style={{
              bottom: "20px",
              right: "20px",
              color: "initial",
              zIndex: "100",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
            }}
          >
            <svg
              className=""
              onMouseEnter={(e) => (e.target.style.color = "#F6A92C")}
              onMouseLeave={(e) => (e.target.style.color = "initial")}
              width="30px"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
          </div>
        </MagnifierContainer>
      </div>
    );
  };

  const renderItem = (item) => {
    return <CustomSlide item={item} />;
  };

  const ImageSlide = ({ item }) => {
    const { original, description, width, height } = item;
    return (
      <div className="custom-slide pt-3">
        <Image
          fluid
          className=""
          style={{
            maxWidth: "100vw",
            maxHeight: "82vh",
            minHeight: "600px",
            objectFit: "contain",
          }}
          src={original}
          alt=""
        />
      </div>
    );
  };

  const renderImage = (item) => {
    return <ImageSlide item={item} />;
  };

  console.log(singleProduct);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{singleProduct?.product?.pro_name}</title>
        <meta name="description" content={singleProduct?.product?.short_desc} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={siteUrl} />
        <meta name="twitter:title" content={singleProduct?.product?.pro_name} />
        <meta
          name="twitter:description"
          content={singleProduct?.product?.short_desc}
        />
        <meta
          name="twitter:image"
          content={singleProduct?.product?.main_image}
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={singleProduct?.product?.pro_name} />
        <meta
          property="og:description"
          content={singleProduct?.product?.short_desc}
        />
        <meta
          property="og:image"
          content={singleProduct?.product?.main_image}
        />
      </Helmet>

      {st.loaderStatus ? (
        <SiteLoader status={st.loaderStatus} />
      ) : (
        <>
          <main>
            <div className="bg-light inner-breadcrumb">
              <div className="container">
                <div className="d-flex justify-content-between align-items-center py-3">
                  <h3 className="d-none d-sm-block">
                    {singleProduct?.product?.pro_name.length > 20
                      ? singleProduct?.product?.pro_name.slice(0, 20) + "..."
                      : singleProduct?.product?.pro_name}
                  </h3>
                  <span></span>
                  <span
                    className="breadcrumb-item active order-span align-items-center"
                    aria-current="page"
                    order_id={singleProduct?.product?.id}
                    key={singleProduct?.product?.id}
                    style={{
                      cursor: "pointer",
                      textDecoration: "none",
                    }}
                  >
                    <a
                      href={`/store/${singleProduct?.product?.vendor?.store_slug}`}
                    >
                      <li className="morefromvendor">More from this vendor</li>
                    </a>
                  </span>
                </div>
              </div>
            </div>

            <section className="" style={{ marginTop: "65px" }}>
              <div className="container p-0">
                <div className="row p-0 m-0">
                  <div className="col-md-5">
                    <Modal
                      show={modalImages?.length > 0 ? true : false}
                      onHide={() => setModalImages([])}
                      fullscreen={true}
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                      style={{ overflowY: "hidden", backgroundColor: "black" }}
                      className="py-0 m-0"
                    >
                      <Modal.Body className="py-0 m-0 bg-black">
                        <div
                          className="mx-auto"
                          style={{ maxWidth: "1200px", height: "100%" }}
                        >
                          <ImageGallery
                            items={image}
                            showFullscreenButton={false}
                            showPlayButton={false}
                            showNav={true}
                            startIndex={imageIndex}
                            renderItem={renderImage}
                            renderLeftNav={(onClick, disabled) => (
                              <button
                                className={`start-0 image-gallery-left-nav image-gallery-left-Position ${
                                  disabled ? "disabled" : ""
                                }`}
                                onClick={onClick}
                                disabled={disabled}
                                style={{
                                  width: "45px",
                                  height: "100px",
                                  backgroundColor: "rgba(0, 0, 0, 0.500)",
                                  color: "white",
                                  marginTop: "100px",
                                }}
                              >
                                {/* You can put your custom arrow icon here */}
                                <svg
                                  width="40px"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="4"
                                  stroke="currentColor"
                                  className="w-6 h-6"
                                >
                                  <path
                                    stroke-linecap="none"
                                    stroke-linejoin="none"
                                    d="M15.75 19.5L8.25 12l7.5-7.5"
                                  />
                                </svg>
                              </button>
                            )}
                            renderRightNav={(onClick, disabled) => (
                              <button
                                className={`end-0 image-gallery-right-nav image-gallery-right-Position ${
                                  disabled ? "disabled" : ""
                                }`}
                                onClick={onClick}
                                disabled={disabled}
                                style={{
                                  width: "45px",
                                  height: "100px",
                                  backgroundColor: "rgba(0, 0, 0, 0.500)",
                                  color: "white",
                                  marginTop: "100px",
                                }}
                              >
                                {/* You can put your custom arrow icon here */}
                                <svg
                                  width="40px"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="4"
                                  stroke="currentColor"
                                  className="w-6 h-6"
                                >
                                  <path
                                    stroke-linecap="none"
                                    stroke-linejoin="none"
                                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                  />
                                </svg>
                              </button>
                            )}
                          />
                        </div>
                      </Modal.Body>

                      <svg
                        onClick={() => setModalImages([])}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="4"
                        stroke="currentColor"
                        className="position-absolute text-white pointer"
                        style={{ width: "40px", top: "20px", right: "20px" }}
                      >
                        <path
                          stroke-linecap="none"
                          stroke-linejoin="none"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Modal>

                    {/*Gallery Start*/}
                    <div className="zoom_product arrow-parent">
                      {/*<ImageGallery items={images}/>*/}
                      <ImageGallery
                        items={image}
                        showFullscreenButton={false}
                        showPlayButton={false}
                        showNav={true}
                        onSlide={(e) => setImageIndex(e)}
                        onClick={() => setModalImages(image)}
                        renderItem={renderItem}
                        renderLeftNav={(onClick, disabled) => (
                          <button
                            className={`arrow-l-btn start-0 image-gallery-left-nav image-gallery-left-Position ${
                              disabled ? "disabled" : ""
                            }`}
                            onClick={onClick}
                            disabled={disabled}
                            style={{
                              width: "45px",
                              height: "100px",
                              backgroundColor: "rgba(0, 0, 0, 0.500)",
                              color: "white",
                            }}
                          >
                            {/* You can put your custom arrow icon here */}
                            <svg
                              width="40px"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="4"
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                stroke-linecap="none"
                                stroke-linejoin="none"
                                d="M15.75 19.5L8.25 12l7.5-7.5"
                              />
                            </svg>
                          </button>
                        )}
                        renderRightNav={(onClick, disabled) => (
                          <button
                            className={`arrow-r-btn end-0 image-gallery-right-nav image-gallery-right-Position ${
                              disabled ? "disabled" : ""
                            }`}
                            onClick={onClick}
                            disabled={disabled}
                            style={{
                              width: "45px",
                              height: "100px",
                              backgroundColor: "rgba(0, 0, 0, 0.500)",
                              color: "white",
                            }}
                          >
                            {/* You can put your custom arrow icon here */}
                            <svg
                              width="40px"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="4"
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                stroke-linecap="none"
                                stroke-linejoin="none"
                                d="M8.25 4.5l7.5 7.5-7.5 7.5"
                              />
                            </svg>
                          </button>
                        )}
                      />
                    </div>
                    {/* <!-- end  --> */}
                  </div>
                  <div className="col-md-5 p-0 m-0">
                    <div className="product-detail ms-md-4 mt-2 p-2">
                      {/*Product Title*/}
                      <div className="d-flex justify-content-between">
                        <div className="detailProductName">
                          {singleProduct?.product?.pro_name}
                        </div>
                        <div>
                          <i
                            className={
                              singleProduct?.wishlist_status
                                ? "fa fa-heart hearticoncolor selected wishlist-iconColor"
                                : "fa fa-heart wishlist-iconColor"
                            }
                            aria-hidden="true"
                            wish-className="true"
                            id="heartIconWithoutIndex"
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              addToWishListWithoutIndex(
                                singleProduct.product?.id
                              );
                            }}
                          ></i>
                        </div>
                      </div>

                      {/*Review*/}
                      <div className="review d-flex align-items-center">
                        <div>
                          <i
                            className="fa fa-star-o me-1"
                            aria-hidden="true"
                          ></i>
                          <i
                            className="fa fa-star-o me-1"
                            aria-hidden="true"
                          ></i>
                          <i
                            className="fa fa-star-o me-1"
                            aria-hidden="true"
                          ></i>
                          <i
                            className="fa fa-star-o me-1"
                            aria-hidden="true"
                          ></i>
                          <i
                            className="fa fa-star-o me-1"
                            aria-hidden="true"
                          ></i>
                          {/* <i className="fa fa-star-half-o" aria-hidden="true"></i> */}
                        </div>
                        <span className="grey-text detailProductReviews d-flex align-items-center mt-2">
                          <span>
                            {singleProduct?.rating_data?.total_rating}
                          </span>
                          <span style={{ marginLeft: "5px" }}>Reviews</span>
                        </span>
                      </div>

                      {/*Price Tag*/}
                      <div className="priceTag">
                        <span>&#x24;</span>
                        {combinationKey
                          ? singleProduct?.product_variations?.combinations[
                              combinationKey
                            ]?.price * prodQty
                          : singleProduct?.product?.sell_price * prodQty}
                      </div>

                      {/*Product Availability*/}
                      <div className="available">
                        {(
                          combinationKey
                            ? !singleProduct?.product_variations?.combinations[
                                combinationKey
                              ]?.qty ||
                              singleProduct?.product_variations?.combinations[
                                combinationKey
                              ]?.display !== "on"
                            : singleProduct?.product?.stock === 0
                        ) ? (
                          <>
                            0 : <span className="text-red">Out of Stock</span>
                            &nbsp;&nbsp;
                            <span
                              className="order-span"
                              key={singleProduct?.product?.id}
                              style={{ cursor: "pointer" }}
                            ></span>
                          </>
                        ) : (
                          <>
                            {singleProduct?.product?.stock !== 0 ||
                              singleProduct?.product_variations?.combinations[
                                combinationKey
                              ]?.qty}
                            {combinationKey
                              ? singleProduct?.product_variations?.combinations[
                                  combinationKey
                                ]?.qty
                              : singleProduct?.product?.stock}
                            : <span className="text-green">In Stock</span>
                            &nbsp;&nbsp;
                            <span
                              className="order-span"
                              order_id={singleProduct?.product?.id}
                              key={singleProduct?.product?.id}
                              // onClick={() => handleOrderClick(singleProduct?.product?.vendor_id)}
                              style={{ cursor: "pointer" }}
                            ></span>
                          </>
                        )}
                      </div>

                      {/*Product description*/}
                      <p className="productDetailShortdes">
                        {singleProduct?.product?.short_desc}
                      </p>

                      {/*If Product has variations*/}
                      {singleProduct?.product_variations && (
                        <div>
                          <table>
                            <tbody>
                              {/* Render color options */}
                              {singleProduct?.product_variations?.colors &&
                                Object.keys(
                                  singleProduct.product_variations.colors
                                ).length > 0 && (
                                  <tr>
                                    <td className={`button-column`}>
                                      <div className="d-flex">
                                        <div className="productDetailColor mt-1">
                                          Colors
                                        </div>
                                        <div className=" ms-2">
                                          <div className="d-flex">
                                            {Object.keys(
                                              singleProduct.product_variations
                                                .colors
                                            ).map((colorCode) => {
                                              const colorName =
                                                singleProduct.product_variations
                                                  .colors[colorCode];
                                              return (
                                                <div
                                                  style={{ display: "flex" }}
                                                  key={colorCode}
                                                  className={
                                                    selectedColor === colorName
                                                      ? "color-selected color me-3"
                                                      : "color me-3"
                                                  }
                                                >
                                                  <button
                                                    key={colorCode}
                                                    id="variantFontSizeId"
                                                    style={{
                                                      backgroundColor:
                                                        colorCode,
                                                    }}
                                                    onClick={() =>
                                                      handleColorChange(
                                                        colorName
                                                      )
                                                    }
                                                  />
                                                  {selectedColor ===
                                                    colorName && (
                                                    <i className="fa fa-check"></i>
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </div>
                                          <span className="productDetailShortdes">
                                            {selectedColor}
                                          </span>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}

                              {/* Render attribute options */}
                              {singleProduct?.product_variations && (
                                <tr>
                                  {singleProduct?.product_variations?.choice_attributes_combination.map(
                                    (attribute, index) => (
                                      <td
                                        className="button-column mt-4"
                                        key={index}
                                      >
                                        <div
                                          key={attribute.id}
                                          className="d-flex align-items-center"
                                        >
                                          <div className="productDetailColor">
                                            {attribute.name}
                                          </div>
                                          <div
                                            key={attribute.id}
                                            style={{
                                              display: "flex",
                                              blockSize: "fit-content",
                                            }}
                                          >
                                            {attribute.values.map((value) => (
                                              <button
                                                key={value}
                                                onClick={() =>
                                                  handleAttributeChange(
                                                    attribute.id,
                                                    value
                                                  )
                                                }
                                                className={
                                                  selectedAttributes &&
                                                  selectedAttributes.some(
                                                    (attr) =>
                                                      attr.id ===
                                                        attribute.id &&
                                                      attr.value === value
                                                  )
                                                    ? "attribute-selected attribute-selectedIndex ms-2"
                                                    : "attribute-selected ms-2"
                                                }
                                              >
                                                {value}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      </td>
                                    )
                                  )}
                                </tr>
                              )}

                              {/*Add to Cart Button*/}
                              <tr>
                                <td className="d-flex gap-4 mt-3 w-100">
                                  <div className="qty-style dataButton">
                                    <button
                                      disabled={
                                        combinationKey
                                          ? singleProduct?.product_variations
                                              ?.combinations[combinationKey]
                                              ?.display !== "on" ||
                                            !singleProduct?.product_variations
                                              ?.combinations[combinationKey]
                                              ?.qty
                                          : !singleProduct?.product?.stock ||
                                            loader
                                      }
                                      onClick={() => decrementProdQuantity()}
                                    >
                                      <i className="fa fa-minus"></i>
                                    </button>
                                    <div>{prodQty}</div>
                                    <button
                                      disabled={
                                        combinationKey
                                          ? singleProduct?.product_variations
                                              ?.combinations[combinationKey]
                                              ?.display !== "on" ||
                                            !singleProduct?.product_variations
                                              ?.combinations[combinationKey]
                                              ?.qty
                                          : !singleProduct?.product?.stock ||
                                            loader
                                      }
                                      onClick={() => incrementProdQuantity()}
                                    >
                                      <i className="fa fa-plus"></i>
                                    </button>
                                  </div>

                                  <button
                                    className="add-cart dataButtontwo"
                                    onClick={() =>
                                      addToCart(singleProduct.product?.pro_slug)
                                    }
                                    disabled={
                                      combinationKey
                                        ? singleProduct?.product_variations
                                            ?.combinations[combinationKey]
                                            ?.display !== "on" ||
                                          !singleProduct?.product_variations
                                            ?.combinations[combinationKey]?.qty
                                        : !singleProduct?.product?.stock ||
                                          loader
                                    }
                                  >
                                    {loader ? (
                                      "Adding to cart..."
                                    ) : (
                                      <span className="data_textButton">
                                        <i
                                          className="fa fa-shopping-cart"
                                          aria-hidden="true"
                                        ></i>
                                        Add to Cart
                                      </span>
                                    )}
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Error */}
                      <span id="v_msg"></span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <hr />

            {/*Description*/}
            <section className="section-wrapper description">
              <div className="container">
                <div className="desc-tab">
                  <ul className="nav nav-tabs" id="desTab" role="tablist">
                    {/*Description*/}
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "description" ? "active" : ""
                        }`}
                        id="description-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#description-tab-pane"
                        type="button"
                        role="tab"
                        aria-controls="description-tab-pane"
                        aria-selected={activeTab === "description"}
                        onClick={() => handleTabChange("description")}
                      >
                        <i className="ri-dashboard-line" /> Description
                      </button>
                    </li>

                    {/*Store*/}
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "store" ? "active" : ""
                        }`}
                        id="store-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#store"
                        type="button"
                        role="tab"
                        aria-controls="store"
                        aria-selected={activeTab === "store"}
                        onClick={() => handleTabChange("store")}
                      >
                        <i className="ri-dashboard-line" /> Store Info
                      </button>
                    </li>

                    {/*Shipping*/}
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "shipping" ? "active" : ""
                        }`}
                        id="shipping-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#shipping"
                        type="button"
                        role="tab"
                        aria-controls="shipping"
                        aria-selected={activeTab === "shipping"}
                        onClick={() => handleTabChange("shipping")}
                      >
                        <i className="ri-dashboard-line" /> Shipping
                      </button>
                    </li>
                  </ul>

                  <div className="tab-content accordion" id="desTabContent">
                    {/*Description*/}
                    <div
                      className={`tab-pane fade accordion-item ${
                        activeTab === "description" ? "active show" : ""
                      }`}
                      id="description-tab-pane"
                      role="tabpanel"
                      aria-labelledby="description-tab"
                      tabIndex={0}
                    >
                      <div
                        id="description"
                        className="accordion-collapse collapse show d-lg-block"
                        aria-labelledby="description"
                        data-bs-parent="#desTabContent"
                      >
                        <div className="accordion-body">
                          <div className="row">
                            <div className="col-md-4">
                              <div className="des-img">
                                <img
                                  src={singleProduct?.product?.main_image}
                                  title=""
                                  alt=""
                                />
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="description-content">
                               {/* <h3>{singleProduct?.product?.pro_name}</h3> */}

                                <p
                                  onClick={(e) => setShowFullText(-1)}
                                  style={{ cursor: "pointer" }}
                                  dangerouslySetInnerHTML={{
                                    __html: fixChar(
                                      singleProduct?.product?.description,
                                      showFullText
                                    ),
                                  }}
                                ></p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/*Store*/}
                    <div
                      className={`tab-pane fade accordion-item ${
                        activeTab === "store" ? "active show" : ""
                      }`}
                      id="store"
                      role="tabpanel"
                      aria-labelledby="store-tab"
                    >
                      <Tab.Container
                        id="left-tabs-example"
                        defaultActiveKey="key1"
                      >
                        <Row className="">
                          <Col sm={3}>
                            <Nav
                              variant="text"
                              className="flex-column border-end"
                              style={{ borderColor: "#ECECEC" }}
                            >
                              <Nav.Item>
                                <Nav.Link
                                  activeTab
                                  activeKey="key1"
                                  eventKey="key1"
                                  className="custom-tab"
                                >
                                  Vendor Information
                                </Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link
                                  eventKey="key2"
                                  className="custom-tab"
                                >
                                  Shipping Policy
                                </Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link
                                  eventKey="key3"
                                  className="custom-tab"
                                >
                                  Return Policy
                                </Nav.Link>
                              </Nav.Item>
                              {/* <Nav.Item>
                                <Nav.Link
                                  eventKey="key4"
                                  className="custom-tab"
                                >
                                  Shipping & Delivery
                                </Nav.Link>
                              </Nav.Item> */}
                              <Nav.Item>
                                <Nav.Link
                                  eventKey="key5"
                                  className="custom-tab"
                                >
                                  Terms & Conditions
                                </Nav.Link>
                              </Nav.Item>
                            </Nav>
                          </Col>
                          <Col
                            sm={9}
                            className=""
                            style={{ minHeight: "300px" }}
                          >
                            <Tab.Content className="p-0">
                              <Tab.Pane activeKey="key1" eventKey="key1">
                                <div className="tab-content">
                                  <h3>
                                    {singleProduct?.product?.vendor?.name}
                                  </h3>
                                  <p>{singleProduct?.product?.vendor?.bio}</p>
                                </div>
                              </Tab.Pane>
                              <Tab.Pane eventKey="key2">
                                <div
                                  className="tab-content"
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      singleProduct?.product?.vendor
                                        ?.shipping_policy,
                                  }}
                                />
                              </Tab.Pane>
                              <Tab.Pane eventKey="key3">
                                <div
                                  className="tab-content"
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      singleProduct?.product?.vendor
                                        ?.return_policy,
                                  }}
                                />
                              </Tab.Pane>
                              {/* <Tab.Pane eventKey="key4">
                                <div
                                  className="tab-content"
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      singleProduct?.product?.vendor
                                        ?.terms_conditions,
                                  }}
                                />
                              </Tab.Pane> */}
                              <Tab.Pane eventKey="key5">
                                <div
                                  className="tab-content"
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      singleProduct?.product?.vendor
                                        ?.terms_conditions,
                                  }}
                                />
                              </Tab.Pane>
                            </Tab.Content>
                          </Col>
                        </Row>
                      </Tab.Container>
                    </div>

                    {/*Shipping*/}
                    <div
                      className={`tab-pane fade accordion-item ${
                        activeTab === "shipping" ? "active show" : ""
                      }`}
                      id="shipping"
                      role="tabpanel"
                      aria-labelledby="shipping-tab"
                    >
                      <div
                        id="shipping"
                        className="accordion-collapse collapse show  d-lg-block"
                        aria-labelledby="shipping "
                        data-bs-parent="#desTabContent"
                      >
                        <div className="accordion-body">
                          <div className="description-content row px-6">
                            <div className="col-md-6">
                              {/* <div
                                                                className="d-flex gap-2 justify-content-between align-items-center mb-2 py-2  border-bottom border-1">
                                                                <h6>Shipping profile Name</h6>
                                                                <p className="color-class">
                                                                    {
                                                                        storeInfoTab?.shipping_info
                                                                            ?.shipping_profile_name
                                                                    }
                                                                </p>
                                                            </div> */}

                              <div className="d-flex gap-2 justify-content-between align-items-center mb-2 py-2  border-bottom border-1">
                                <h6>Standard Fee:</h6>
                                <p className="color-class">
                                  $ {shippingDetails?.handling_fee}
                                </p>
                              </div>

                              <div className="d-flex gap-2 justify-content-between align-items-center mb-2 py-2  border-bottom border-1">
                                <h6>Additional Item Fee</h6>
                                <p className="color-class">
                                  $ {shippingDetails?.additional_item_fee}
                                </p>
                              </div>

                              <div className="d-flex gap-2 justify-content-between align-items-center mb-2 py-2  border-bottom border-1">
                                <h6>Expedited Delivery Fee</h6>
                                <p className="color-class">
                                  $ {shippingDetails?.expedited_fee}
                                </p>
                              </div>

                              <div className="d-flex gap-2 justify-content-between align-items-center mb-2 py-2  border-bottom border-1">
                                <h6>Processing Fee</h6>
                                <p className="color-class">
                                  $ {shippingDetails?.processing_fee}
                                </p>
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="d-flex gap-2 justify-content-between align-items-center mb-2 py-2  border-bottom border-1">
                                <h6>Expedited Fee</h6>
                                <p className="color-class">
                                  $ {shippingDetails?.expedited_fee}
                                </p>
                              </div>

                              <div className="d-flex gap-2 justify-content-between align-items-center mb-2 py-2  border-bottom border-1">
                                <h6>Additional Expedited Fee</h6>
                                <p className="color-class">
                                  $ {shippingDetails?.additional_expedited_fee}
                                </p>
                              </div>

                              <div className="d-flex gap-2 justify-content-between align-items-center mb-2 py-2  border-bottom border-1">
                                <h6>Gift Packing Fee</h6>
                                <p className="color-class">
                                  $ {shippingDetails?.gift_packing_fee}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/*Related Section*/}
            <section
              className={`featured bg-light ${
                relatedProducts?.length === 0 ? "hide" : ""
              }`}
              style={{ paddingTop: "40px" }}
            >
              <div className="container footerpadding mx-auto">
                <div
                  className={`wrapper-header text-center mb-4 ${
                    relatedProducts?.product?.length < 0 ? "hide" : ""
                  }`}
                >
                  {/*<h4 className="grey-text wow animated fadeInUp">More from this Seller</h4>*/}
                  <div
                    className="wow animated bestsellerproduct fadeInUp"
                    data-wow-delay="0.3s"
                  >
                    Related Items
                  </div>
                  <p className="wow animated fadeInUp"></p>
                </div>

                {/* <!-- product  --> */}
                <div className="grid-container">
                  {relatedProducts.product?.map((rp, index) => {
                    return (
                      <div
                        key={index}
                        className="position-relative mb-4 bg-white"
                      >
                        <div className="wishlist-icon">
                          <i
                            className={
                              rp?.status
                                ? "fa fa-heart hearticoncolor selected"
                                : "fa fa-heart"
                            }
                            aria-hidden="true"
                            wish-className="true"
                            id={`heartIcon-${index}`}
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToWishList(rp.id, index);
                            }}
                          ></i>
                        </div>
                        <Link
                          to={`/shop/${rp.pro_slug}-${rp?.id}`}
                          className=""
                          // onClick={handleScrollToTop}
                        >
                          <div className="">
                            <div className="image-container">
                              <img
                                src={rp.main_image}
                                className="img-size"
                                title=""
                                alt=""
                              />
                            </div>

                            {/* <!-- product-count  --> */}
                            <div
                              className="text-center px-1"
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
                                {rp.pro_name?.length > 18
                                  ? rp.pro_name?.slice(0, 18) + "..."
                                  : rp.pro_name}
                              </h6>
                              <div className="categoryCartDes mt-1 mb-3 px-2 des-container text-wrap">
                                <small
                                  className=""
                                  style={{
                                    color: "#737373",
                                    fontFamily: "Montserrat",
                                    fontWeight: "400",
                                    fontSize: "14px",
                                  }}
                                >
                                  {rp.short_desc.length > 37
                                    ? rp.short_desc.slice(0, 37) + "..."
                                    : rp.short_desc}
                                </small>
                              </div>
                              <div className="price">
                                <div
                                  className="grey-text"
                                  style={{ fontFamily: "Montserrat" }}
                                >
                                  <span className="text-warning ms-1">
                                    ${rp && rp.regular_price}
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
            </section>
          </main>
        </>
      )}
    </>
  );
};

export default SingleProduct;
