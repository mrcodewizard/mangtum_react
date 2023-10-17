import React from "react";
import { useEffect } from "react";
import SiteLoader from "../SiteLoader";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";

import { addWishlist, getWishlistProduct } from "../store/product";
import emptyWishImg from "../components/img/nowish.jpg";
import { get_meta } from "../store/home";
import SiteLogo from "../components/img/logo.png";
import ThemeBreadcrumb from "../components/common/ThemeBreadcrumb";

const UserWishlist = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getWishlistProduct());
  }, []);

  const wishlists = useSelector((state) => state.prodLi.wishList);
  const wishlist_status = useSelector((state) => state.prodLi.wishlist_status);
  const loaderStatus = useSelector((state) => state.prodLi.loaderStatus);

  const DeleteFromWishList = (wishlist) => {
    dispatch(addWishlist(wishlist.id));
  };

  useEffect(() => {
    if (wishlist_status === 0) {
      dispatch(getWishlistProduct());
    }
  }, [wishlist_status]);

  // meta information
  const mainstate = useSelector((state) => state.home);
  const metaTags = mainstate.allmeta;
  const siteUrl = window.location.href;

  useEffect(() => {
    dispatch(get_meta("home-page"));
  }, ["home-page"]);

  return (
    <>
      {loaderStatus ? (
        <SiteLoader status={loaderStatus} />
      ) : (
        <>
          <ThemeBreadcrumb title="Wishlist" current_route="Wishlist" />
          <Helmet>
            <meta charSet="utf-8" />
            <title>{metaTags?.meta_title}</title>
            <meta name="description" content={metaTags?.meta_description} />

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
            <meta
              property="og:description"
              content={metaTags?.meta_data?.og_description}
            />
            <meta property="og:image" content={SiteLogo} />
          </Helmet>

          <section id="cart-view">
            <div className="container">
              <div className="row">
                {wishlists?.products?.map((wishlist, index) => (
                  <>
                    <div
                      className="responsiveWishlidtCards mb-5"
                      style={{ width: "300px" }}
                    >
                      <div className="d-flex align-items-center flex-column justify-content-center">
                        <Link
                          className=" wishimg"
                          to={`/shop/${wishlist.pro_slug}-${wishlist?.id}`}
                        >
                          <img
                            src={wishlist.main_image}
                            alt="website template image"
                            width={200}
                          />
                        </Link>
                        <div className="">
                          {" "}
                          <Link
                            className="card_font wishimg"
                            to={`/shop/${wishlist.pro_slug}-${wishlist?.id}`}
                          >
                            {wishlist?.product_name.length > 12
                              ? wishlist.product_name.slice(0, 12) + "..."
                              : wishlist.product_name}
                          </Link>
                        </div>
                        <div className="">
                          {" "}
                          <Link
                            className="card_font wishimg text-warning"
                            to={`/shop/${wishlist.pro_slug}-${wishlist?.id}`}
                          >
                            ${wishlist?.regular_price}
                          </Link>
                        </div>
                        <button
                          onClick={() => DeleteFromWishList(wishlist)}
                          type="button"
                          className="removebtn"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <hr className="responsiveWishlidtCards" />
                  </>
                ))}

                {wishlists?.products?.length > 0 ? (
                  <>
                    <div className="col-md-12 responsiveWishlidtCardsTwo">
                      <div className="cart-view-area">
                        <div className="cart-view-table aa-wishlist-table">
                          <form action="#" method="post">
                            <div className="table-responsive">
                              <table className="table">
                                <thead>
                                  <tr className="">
                                    <th>Image</th>
                                    <th>Product</th>
                                    <th>Regular Price</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {wishlists?.products?.map((wishlist) => {
                                    return (
                                      <tr key={wishlist.id}>
                                        <td>
                                          <Link
                                            className="aa-cart-title wishimg"
                                            to={`/shop/${wishlist.pro_slug}-${wishlist?.id}`}
                                          >
                                            <img
                                              src={wishlist.main_image}
                                              alt="website template image"
                                              style={{ height: "100px" }}
                                            />
                                          </Link>
                                        </td>
                                        <td className="table-padding">
                                          <Link
                                            className="aa-cart-title wishimg"
                                            to={`/shop/${wishlist.pro_slug}-${wishlist?.id}`}
                                          >
                                            {wishlist?.product_name.length > 20
                                              ? wishlist.product_name.slice(
                                                  0,
                                                  20
                                                ) + "..."
                                              : wishlist.product_name}
                                          </Link>
                                        </td>
                                        <td className="table-padding">
                                          <Link
                                            className="aa-cart-title wishimg"
                                            to={`/shop/${wishlist.pro_slug}-${wishlist?.id}`}
                                          >
                                            ${wishlist?.regular_price}
                                          </Link>
                                        </td>
                                        <td className="table-padding">
                                          <button
                                            onClick={() =>
                                              DeleteFromWishList(wishlist)
                                            }
                                            type="button"
                                            className="removebtn"
                                          >
                                            Delete
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="not-found col-md-6 offset-md-3">
                      <img
                        src={emptyWishImg}
                        className="img-fluid"
                        title=""
                        alt=""
                        style={{ height: "300px", width: "300px" }}
                      />
                      <div
                        className="not-found col-md-12"
                        style={{ lineHeight: "30px" }}
                      >
                        <p style={{ fontSize: "35px" }}>
                          <strong>Your wishlist is empty</strong>
                        </p>
                        <h5>Create your first wishlist request</h5>
                        <br />
                        <strong>
                          <span className="explore-more">
                            <Link to="/">
                              <div className="waviy">
                                <span style={{ "--i": "1" }}>S</span>
                                <span style={{ "--i": "2" }}>H</span>
                                <span style={{ "--i": "3" }}>O</span>
                                <span style={{ "--i": "4" }}>P</span>&nbsp;
                                &nbsp;
                                <span style={{ "--i": "5" }}>N</span>
                                <span style={{ "--i": "6" }}>O</span>
                                <span style={{ "--i": "7" }}>W</span>
                              </div>
                            </Link>
                          </span>
                        </strong>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default UserWishlist;
