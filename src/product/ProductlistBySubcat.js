import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getproductList,
  getFiltercode,
  addWishlist,
  productActions,
} from "../store/product";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import SiteLoader from "../SiteLoader";
import Filters from "../components/General/Filters";
import { images } from "../utils/images";
import { Circles } from "react-loader-spinner";
import InfiniteScroll from "react-infinite-scroller";
import { mgtApi } from "../store/axios";
import { fixChar } from "../utils/helper";
import { Link } from "react-router-dom";
import Dropdown from "../components/General/DropDown";
import ThemeBreadcrumb from "../components/common/ThemeBreadcrumb";

const options = [
  { label: "Low to high", value: "Low to high" },
  { label: "High to low", value: "High to low" },
];

const ProductlistBySubcat = () => {
  const { pathname } = useLocation();
  const siteUrl = window.location.href;
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { category, subCategory } = useParams();

  const filterUrl = window.location.pathname.split("product-category/").pop();
  const catAndSubCatSlugs = filterUrl.split("/");
  const { headerCategories } = useSelector((state) => state.home);
  const {
    products,
    fetchPermit,
    priceRange,
    keyword,
    filterQuery,
    filterList,
    total_page,
    categoryId,
    subCategoryId,
  } = useSelector((state) => state.prodLi);

  const categorySlug = catAndSubCatSlugs[0];
  const [searchState, setSearchState] = useState(false);

  const stringWithoutHyphens = subCategory.replace(/-/g, " ");
  const stringWithoutHyphenstwo = category.replace(/-/g, " ");

  useEffect(() => {
    const cateItem = headerCategories.filter((item) => item?.slug === category);
    dispatch(productActions.setCategoryId(cateItem[0]?.cate_id));
    if (cateItem.length > 0) {
      dispatch(getFiltercode({ cate_id: cateItem[0]?.cat_id }));

      const subCate = cateItem[0]?.sub_categories?.filter(
        (item) => item?.sub_cate_slug === subCategory
      );
      dispatch(productActions.setSubCategoryId(subCate[0]?.subcat_id));
    }
  }, [category, subCategory, headerCategories]);

  useEffect(() => {
    setSearchState(false);
    setPage(2);
    setLoadMore(true);
    if (!fetchPermit) {
      dispatch(getproductList(subCategory));
    }
  }, [category, subCategory]);
  const state = useSelector((state) => state.prodLi);

  const countlength = () => {
    return (
      <div className="counter grey-text">
        <strong>{state.plength}</strong>
      </div>
    );
  };

  useEffect(() => {
    if (state.prodNotFound) {
      navigate("/page-not-found");
    }
  }, [{ categorySlug }]);

  var userDetails = localStorage.getItem("userDetails");
  var data = JSON.parse(userDetails);
  var user_id = data?.ID;

  const addToWishList = (product_id, index) => {
    dispatch(addWishlist(product_id));

    var heartIcon = document.getElementById("heartIcon-" + index);
    heartIcon.classList.toggle("selected");
    heartIcon.classList.toggle("hearticoncolor");
  };

  // -------------------------------------------

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    setPage(2);
    setLoadMore(true);
  }, [searchState]);

  const [smallScreen, setSmallScreen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [page, setPage] = useState(2);
  const [loadMore, setLoadMore] = useState(true);
  const [listStyle, setListStyle] = useState(false);

  async function loadMoreProducts() {
    dispatch(productActions.setFetchPermit(true));
    if (page > 1 && loadMore && fetchPermit) {
      if (page > total_page) {
        setLoadMore(false);
      } else {
        let userDetails = localStorage.getItem("userDetails");
        let userData = JSON.parse(userDetails);
        let user_id = userData?.ID;
        let res = null;
        if (searchState) {
          const res = await mgtApi.post(
            `/productsearch?price_between=${priceRange[0]},${
              priceRange[1]
            }&page=${page}&category_id=${categoryId}&subcategory_id=${subCategoryId}${
              filterQuery && `&${filterQuery}`
            }`
          );
          setLoadMore(res.data?.products.length > 0 ? true : false);
          dispatch(productActions.setProducts(res.data?.products));
        } else {
          res = await mgtApi.post("product-by-subcategory-web", {
            page,
            slug: subCategory,
            user_id,
          });
          console.log("sub cate: ", res.data);
          setLoadMore(res.data?.data.products?.length > 0 ? true : false);
          dispatch(productActions.setProducts(res.data?.data?.products));
        }
        setPage(page + 1);
      }
    }
  }

  function removeTags(txt) {
    if (txt) {
      var rex = /(<([^>]+)>)/gi;
      return txt?.replace(rex, "");
    }
  }

  const subcatItem = headerCategories.filter((item) => item?.slug === category);

  return (
    <main className="">
      <ThemeBreadcrumb
        title={`${stringWithoutHyphenstwo} / ${stringWithoutHyphens}`}
        current_route={stringWithoutHyphenstwo}
      />
      <section className="single-wrapper">
        <div className="container">
          <div className="py-4 flex-between">
            {/* {countlength()} */}
            <div className="counter grey-text">
              Showing all {products?.length} results
            </div>
            {products.length > 0 && (
              <div className="d-flex flex-wrap justify-content-end gap-4 mt-4 mt-md-0">
                <div className="view-style">
                  <h3>Views : </h3>
                  {listStyle ? (
                    <button onClick={(e) => setListStyle(false)}>
                      <img src={images["grid.svg"]} alt="" />
                    </button>
                  ) : (
                    <button>
                      <img
                        src={images["list.svg"]}
                        alt=""
                        onClick={(e) => setListStyle(true)}
                      />
                    </button>
                  )}
                </div>
                <Dropdown options={options} onSelect={handleOptionSelect} />
                <button
                  className="filter-btn"
                  onClick={(e) => setSmallScreen(true)}
                >
                  Filters
                </button>
              </div>
            )}
          </div>
          {/* <!-- product  --> */}
          <div className="row">
            {products?.length > 0 && (
              <div
                className={`col-lg-3 col-md-4 ${
                  smallScreen ? "resp-show" : "resp-hide"
                }`}
              >
                <Filters
                  options={filterList}
                  setSmallScreen={setSmallScreen}
                  setSearchState={setSearchState}
                  setPage={setPage}
                />
              </div>
            )}
            <div
              className={`${
                products.length > 0 ? "col-lg-9 col-md-8" : "col-l2"
              }`}
            >
              {state.loaderStatus ? (
                <SiteLoader status={state.loaderStatus} />
              ) : (
                <InfiniteScroll
                  pageStart={2}
                  className="row g-4"
                  loadMore={loadMoreProducts}
                  hasMore={loadMore}
                  loader={
                    <div className="spinner">
                      <Circles
                        type="Circles"
                        color="#f6a92c"
                        height={60}
                        width={60}
                      />
                    </div>
                  }
                > 
                  {products?.length > 0 ? (
                    products?.map((plist, index) => {
                      return (
                        <div
                          key={index}
                          className={`position-relative ${
                            listStyle
                              ? "col-lg-12"
                              : "col-lg-3 col-md-6 col-sm-6 col-xs-12"
                          }`}
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
                            to={`/shop/${plist.pro_slug}-${plist.id}`}
                            className={
                              listStyle
                                ? "list-item"
                                : "item product-card me-2  mb-3 "
                            }
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
                              {/* <!-- product-cont  --> */}
                              <div
                                style={{
                                  width: `${listStyle ? "75%" : "auto"}`,
                                }}
                                className={`product-content ${
                                  listStyle ? "p-0" : "py-3"
                                }`}
                              >
                                <div className="category_title">
                                  {plist.pro_name?.length > 18
                                    ? plist.pro_name?.slice(0, 18) + "..."
                                    : plist?.pro_name}
                                </div>
                                <div className="categoryCartDes text-wrap">
                                  {plist?.description ? (
                                    <>
                                      {plist.description?.length > 37
                                        ? plist.description?.slice(0, 37) +
                                          "..."
                                        : plist.description}
                                    </>
                                  ) : (
                                    <>
                                      {plist.short_desc?.length > 37
                                        ? plist.short_desc?.slice(0, 37) + "..."
                                        : plist.short_desc}
                                    </>
                                  )}
                                </div>
                                <div className="price">
                                  <div className="grey-text">
                                    <span
                                      className={`text-warning ${
                                        listStyle ? "m-0" : ""
                                      }`}
                                    >
                                      ${plist.sell_price}
                                    </span>
                                  </div>
                                </div>
                                {listStyle && (
                                  <>
                                    <div className="description">
                                      <p>{fixChar(plist?.short_desc, 50)}</p>
                                    </div>
                                    <button className="add-cart">
                                      <i className="fa fa-shopping-cart"></i>
                                      <span>Add to Cart </span>
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })
                  ) : (
                    <div className="no-results">
                      <img src={images["not-found.png"]} alt="" />
                      <h4>Oops! No Products found.</h4>
                    </div>
                  )}
                </InfiniteScroll>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductlistBySubcat;
