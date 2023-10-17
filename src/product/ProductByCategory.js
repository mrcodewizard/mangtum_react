import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Circles } from "react-loader-spinner";
import { Helmet } from "react-helmet";

import {
  addWishlist,
  getFiltercode,
  getProductByCategory,
  productActions,
} from "../store/product";
import SiteLoader from "../SiteLoader";
import { images } from "../utils/images";
import { mgtApi } from "../store/axios";
import InfiniteScroll from "react-infinite-scroller";
import Filters from "../components/General/Filters";
import Dropdown from "../components/General/DropDown";
import { fixChar } from "../utils/helper";
import ThemeBreadcrumb from "../components/common/ThemeBreadcrumb";

const options = [
  { label: "Low to high", value: "Low to high" },
  { label: "High to low", value: "High to low" },
];

const ProductByCategory = () => {
  const dispatch = useDispatch();
  const siteUrl = window.location.href;
  const { category } = useParams();
  const stringWithoutHyphens = category?.replace(/-/g, " ");
  // console.log(category)

  const [listStyle, setListStyle] = useState(false);
  const [loadMore, setLoadMore] = useState(true);
  const [page, setPage] = useState(2);

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
  } = useSelector((state) => state.prodLi);

  console.log(categoryId);

  const [searchState, setSearchState] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const cateItem = headerCategories.filter((item) => item?.slug === category);
    dispatch(productActions.setCategoryId(cateItem[0]?.cat_id));
    if (cateItem.length > 0) {
      dispatch(getFiltercode({ cate_id: cateItem[0]?.cat_id }));
    }
  }, [category, headerCategories]);

  useEffect(() => {
    setSearchState(false);
    setPage(2);
    setLoadMore(true);
    if (!fetchPermit) {
      dispatch(getProductByCategory(category));
    }
  }, [category]);

  const state = useSelector((state) => state.prodLi);

  const countLength = () => {
    return (
      <div className="counter">
        <strong>{state.length}</strong>
      </div>
    );
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

  // --------------------------------------------
  const searchParams = useSelector((state) => state.prodLi.searchParams);
  const [smallScreen, setSmallScreen] = useState(false);

  useEffect(() => {
    setLoadMore(true);
  }, [searchState]);

  async function loadMoreProducts() {
    dispatch(productActions.setFetchPermit(true));
    console.log(total_page);
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
            }&page=${page}&category_id=${categoryId}${
              filterQuery && `&${filterQuery}`
            }`
          );
          setLoadMore(res.data?.products?.length > 0 ? true : false);
          dispatch(productActions.setProducts(res.data?.products));
        } else {
          res = await mgtApi.post("/product-by-category-web", {
            page: page,
            slug: category,
            user_id,
          });
          console.log("parent cate: ", res.data);
          setLoadMore(res.data?.data.products?.length > 0 ? true : false);
          dispatch(productActions.setProducts(res.data?.data?.products));
        }
        setPage(page + 1);
      }
    }
  }

  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  function removeTags(txt) {
    var rex = /(<([^>]+)>)/gi;
    return txt?.replace(rex, "");
  }

  const cat_item = headerCategories.filter((item) => item?.slug === category);
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{cat_item[0]?.cate_name}</title>
        <meta name="description" content={cat_item[0]?.description} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={siteUrl} />
        <meta name="twitter:title" content={cat_item[0]?.cate_name} />
        <meta
          name="twitter:description"
          content={removeTags(cat_item[0]?.description)}
        />
        <meta name="twitter:image" content={cat_item[0]?.cate_img} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={cat_item[0]?.cate_name} />
        <meta
          property="og:description"
          content={removeTags(cat_item[0]?.description)}
        />
        <meta property="og:image" content={cat_item[0]?.cate_img} />
      </Helmet>

      <main>
        <ThemeBreadcrumb
          title={stringWithoutHyphens}
          current_route={stringWithoutHyphens}
        />

        <section className="single-wrapper container">
          <div className="flex-space-between pt-4 pb-4">
            {countLength()}
            {products.length > 0 && (
              <div className="d-flex flex-wrap justify-content-end gap-4">
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
            {products.length > 0 && (
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
                products.length > 0 ? "col-lg-9 col-md-8 " : "col-l2"
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
        </section>
      </main>
    </div>
  );
};

export default ProductByCategory;
