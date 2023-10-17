import "../App.css";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addWishlist, productActions } from "../store/product";
import SiteLoader from "../SiteLoader";
import { images } from "../utils/images";
import InfiniteScroll from "react-infinite-scroller";
import { Circles } from "react-loader-spinner";
import { mgtApi } from "../store/axios";
import Filters from "../components/General/Filters";
import { useLocation, useSearchParams } from "react-router-dom";
import { getSearch_products } from "../store/home";
import { Link } from "react-router-dom";
import { fixChar } from "../utils/helper";
import Dropdown from "../components/General/DropDown";
import ThemeBreadcrumb from "../components/common/ThemeBreadcrumb";

const options = [
  { label: "Low to high", value: "Low to high" },
  { label: "High to low", value: "High to low" },
];

const Productsearch = () => {
  let [searchParams] = useSearchParams();

  const {
    products,
    fetchPermit,
    priceRange,
    keyword,
    filterData,
    total_page,
    loaderStatus,
  } = useSelector((state) => state.prodLi);

  const { filters, search_array } = useSelector((state) => state.home);

  const dispatch = useDispatch();
  const [listStyle, setListStyle] = useState(false);
  const st = useSelector((state) => state.home);

  const addToWishList = (product_id, index) => {
    dispatch(addWishlist(product_id));

    var heartIcon = document.getElementById("heartIcon-" + index);
    heartIcon.classList.toggle("selected");
    heartIcon.classList.toggle("hearticoncolor");
  };
  // -------------------------------------------------------

  const [searchState, setSearchState] = useState(false);

  const [page, setPage] = useState(2);
  const [loadMore, setLoadMore] = useState(true);

  useEffect(() => {
    setPage(2);
    setLoadMore(true);
  }, [searchState]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    setSearchState(false);
    setPage(2);
    setLoadMore(true);
    if (!fetchPermit) {
      dispatch(getSearch_products(searchParams.get("search"), 1));
    }
  }, []);

  const [selectedOption, setSelectedOption] = useState(null);
  const [smallScreen, setSmallScreen] = useState(false);

  useEffect(() => {
    setPage(2);
    setLoadMore(true);
  }, [search_array]);

  async function loadMoreProducts() {
    dispatch(productActions.setFetchPermit(true));
    if (page > 1 && loadMore && fetchPermit) {
      if (page > total_page) {
        setLoadMore(false);
      } else {
        console.log(filterData);
        const res = await mgtApi.post(
          `/productsearch?${keyword && `keyword=${keyword}`}&price_between=${
            priceRange[0]
          },${priceRange[1]}&page=${page}${filterData && `&${filterData}`}`
        );
        console.log("search initially");
        setLoadMore(res.data?.products.length > 0 ? true : false);
        dispatch(productActions.setProducts(res.data?.products));
        setPage(page + 1);
      }
    }
  }

  return (
    <>
      {st.loaderStatus ? (
        <SiteLoader status={st.loaderStatus} />
      ) : (
        <>
          <div>
            <main>
              <ThemeBreadcrumb
                title={`Search Product`}
                current_route="Search Product"
              />

              <div>
                <section className="single-wrapper">
                  <div className="container set-margin-btm">
                    <div className="filter-head row">
                      <div className="col-lg-5 col-12">
                        <div className="counter grey-text">
                          Showing all {products.length} results{" "}
                        </div>
                      </div>
                      <div className="col-lg-7 col-12 mt-4 mt-md-0">
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
                            <Dropdown
                              options={options}
                              onSelect={handleOptionSelect}
                            />
                            <button
                              className="filter-btn"
                              onClick={(e) => setSmallScreen(true)}
                            >
                              Filters
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      {products.length > 0 && (
                        <div
                          className={`col-lg-3 col-md-4 ${
                            smallScreen ? "resp-show" : "resp-hide"
                          }`}
                        >
                          <Filters
                            options={filters}
                            setSmallScreen={setSmallScreen}
                            setSearchState={setSearchState}
                            setPage={setPage}
                            categoryId=""
                            subCategoryId=""
                          />
                        </div>
                      )}
                      <div
                        className={`${
                          products.length > 0 ? "col-lg-9 col-md-8 " : "col-l2"
                        }`}
                      >
                        {loaderStatus ? (
                          <SiteLoader status={loaderStatus} />
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
                            {products?.map((plist, index) => {
                              return (
                                <div
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
                                    to={`/shop/${plist.pro_slug}-${plist?.id}`}
                                    className={
                                      listStyle
                                        ? "list-item"
                                        : "item product-card me-2  mb-3 "
                                    }
                                    keys={plist.id}
                                  >
                                    <div className="wow animated fadeInUp mt-0">
                                      <div
                                        className={
                                          listStyle
                                            ? "wishListIconPosition"
                                            : "product-cover"
                                        }
                                      >
                                        <div className="image-container">
                                          <img
                                            src={plist.main_image}
                                            className="img-size"
                                            title=""
                                            alt=""
                                            onError={(e) =>
                                              (e.target.src =
                                                images["defaultImg.png"])
                                            }
                                          />
                                        </div>
                                      </div>
                                      {/* </span> */}
                                      {/* <!-- product-cont  --> */}
                                      <div
                                        style={{
                                          width: `${
                                            listStyle ? "75%" : "auto"
                                          }`,
                                        }}
                                        className={`product-content ${
                                          listStyle ? "p-0" : "py-3"
                                        }`}
                                      >
                                        <div className="category_title">
                                          {plist.pro_name.length > 18
                                            ? plist.pro_name.slice(0, 18) +
                                              "..."
                                            : plist.pro_name}
                                        </div>
                                        <div className="categoryCartDes text-wrap">
                                          {plist.short_desc?.length > 37
                                            ? plist.short_desc?.slice(0, 37) +
                                              "..."
                                            : plist.short_desc}
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
                                              <p>
                                                {fixChar(plist?.short_desc, 50)}
                                              </p>
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
                            })}
                          </InfiniteScroll>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </main>
          </div>
        </>
      )}
    </>
  );
};

export default Productsearch;
