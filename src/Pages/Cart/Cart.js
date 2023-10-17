import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  checkExpress,
  checkGift,
  getCartData,
  removeCart,
  updateCartQuantity,
} from "../../store/newCart";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

import CartItem from "./CartItem";
import { images } from "../../utils/images";
import SiteLogo from "../../components/img/logo.png";
import SiteLoader from "../../SiteLoader";
import { getHeaderData, get_meta } from "../../store/home";
import ThemeBreadcrumb from "../../components/common/ThemeBreadcrumb";

export const Cart = () => {
  let userDetails = localStorage.getItem("userDetails");
  let user = JSON.parse(userDetails);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const newCartState = useSelector((state) => state.newCart);
  const cart = useSelector((state) => state.newCart.cart);
  const cartData = useSelector((state) => state.newCart.cartData);
  const isLoading = useSelector((state) => state.newCart.loaderStatus);
  const isLoadingGiftAndExpress = useSelector(
    (state) => state.newCart.loadingGiftAndExpress
  );
  const loggedInUser = useSelector((state) => state.newCart.loggedInUser);
  const checkDex = useSelector((state) => state.newCart.checkDex);
  const checkDexGift = useSelector((state) => state.newCart.checkDexGift);

  // console.log("cart: ", cart);
  // console.log("cartData: ", cartData);
  // console.log("isLoading: ", isLoading);

  const [cartItems, setCartItems] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [prodQty, setProdQty] = useState(1);
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedGift, setIsCheckedGift] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cartItemId, setCardItemId] = useState(null);

  const handleClickOnCloseModalButton = (cart_id) => {
    setCardItemId(cart_id);
    setShowDeleteModal(true);
  };
  const toggleModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };
  const removeFromUserCart = async () => {
    if (cartItemId) {
      await dispatch(removeCart(cartItemId));
      await dispatch(await getCartData());
      setCardItemId(null);
      toggleModal();
      await dispatch(getHeaderData({ user_id: loggedInUser }));
      toast("Cart Item deleted successfully!");
    }
  };
  const handleUpdateQuantity = async (cart_id, quantity) => {
    const cartItemsData = [];

    cartData?.map((data) => {
      data?.cart_items?.map((item) => {
        cartItemsData.push(item);
      });
    });

    let cartItem = cartItemsData.find((item) => item.cart_id === cart_id);
    // console.log('cartItem: ', cartItem)

    await dispatch(
      updateCartQuantity({
        pro_slug: cartItem.pro_slug,
        user_id: user?.ID,
        product_id: cartItem.product_id,
        quantity,
        sku: cartItem.pro_sku,
      })
    );
    await dispatch(getHeaderData({ user_id: loggedInUser }));
  };

  const expStatus = useSelector((state) => state.newCart.expStatus);
  // const checkDex = useSelector((state) => state.newCart.checkDex);
  const expStatusGift = useSelector((state) => state.newCart.expGiftStatus);

  // useEffect(() => {
  //     if (cartItemsData?.data) {
  //         setCartItems(cartItemsData.data);
  //         console.log('cartItemsData: ', cartItemsData);
  //         setUpdated(!updated);
  //     }
  // }, [cartItemsData]);
  //
  useEffect(() => {
    if (typeof checkDex !== "undefined" && typeof expStatus !== "undefined") {
      if (checkDex === 1) {
        setIsChecked(true);
      }
      if (checkDex === 0) {
        setIsChecked(false);
      }
    }
  }, [expStatus, checkDex]);
  //
  useEffect(() => {
    if (
      typeof checkDexGift !== "undefined" &&
      typeof expStatusGift !== "undefined"
    ) {
      if (checkDexGift === 1) {
        setIsCheckedGift(true);
      }
      if (checkDexGift === 0) {
        setIsCheckedGift(false);
      }
    }
  }, [expStatusGift, checkDexGift]);

  // const updateCart = (cart_id, type) => {
  //     // console.log('hii');
  //     dispatch(updateMycart({cart_id, type}));
  //     if (cartStatus.cartfailStatus) {
  //         // dispatch(userCheckout());
  //         getMyCart();
  //         toast("cart updated successfully");
  //     } else {
  //         toast(cartStatus.cartupdateFail.message);
  //     }
  // };
  //

  useEffect(() => {
    dispatch(getCartData(true));
  }, []);

  // console.log(cart.subtotal)

  function calculateTotalCostWithQuantity(cart_items) {
    const totalCost = cart_items.reduce((total, item) => {
      const unitPrice = parseFloat(item.unit_price);
      const quantity = item.quantity;

      return total + unitPrice * quantity;
    }, 0);

    return totalCost;
  }

  /** get all meta information */
  const mainstate = useSelector((state) => state.home);
  const metaTags = mainstate.allmeta;
  const siteUrl = window.location.href;

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{metaTags?.meta_title}</title>
        <meta name="description" content={metaTags?.meta_description} />

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
      {isLoading ? (
        <SiteLoader status={isLoading} />
      ) : (
        <main className="">
          {/*Breadcrumb Area*/}
          <ThemeBreadcrumb title="Cart" current_route="Cart" />

          <section className="container mx-auto">
            {cartData && cartData.length > 0 ? (
              <>
                <div className="row" style={{ marginTop: "50px" }}>
                  <>
                    {/*Cart Area*/}
                    <div className="col-12 col-lg-8 section-wrapper row">
                      {/* <!-- order  --> */}
                      <div className="col-md-12 order-wrap">
                        {cartData &&
                          cartData.map((cart, cartDataKey) => {
                            // console.log('cart: ', cart);
                            return (
                              <>
                                <div key={cartDataKey} className="row">
                                  <div className="col-md-12 d-flex align-items-center gap-3 my-2">
                                    <h4>{cart.store_name}</h4>
                                  </div>

                                  <div className="flex-item col-md-12 px-2 mt-2">
                                    <div className="row g-0">
                                      <div className="col-5 cartTH mb-4 d-none d-md-block">
                                        Product
                                      </div>
                                      <div className="col-2 cartTH mb-4 d-none d-md-block">
                                        Price
                                      </div>
                                      <div className="col-3 cartTH mb-4 d-none d-md-block">
                                        Quantity
                                      </div>
                                      <div className="col-2 cartTH mb-4 d-none d-md-block">
                                        Total
                                      </div>

                                      {cart.cart_items.map((item, index) => {
                                        return (
                                          <CartItem
                                            key={index}
                                            cartItem={item}
                                            index={index}
                                            handleClickOnCloseModalButton={
                                              handleClickOnCloseModalButton
                                            }
                                            handleUpdateQuantity={
                                              handleUpdateQuantity
                                            }
                                          />
                                        );
                                      })}
                                    </div>
                                  </div>

                                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center w-full">
                                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3">
                                      {cart.gift_status && (
                                        <div className="form-check form-check-inline pointer">
                                          <input
                                            className="form-check-input pointer"
                                            type="checkbox"
                                            id="inlineCheckbox2"
                                            checked={
                                              cart.is_gift ? true : false
                                            }
                                            onChange={(e) =>
                                              dispatch(
                                                checkGift(
                                                  cart.shipping_id,
                                                  e.target.checked
                                                )
                                              )
                                            }
                                          />
                                          <label
                                            className="form-check-label pointer"
                                            htmlFor="inlineCheckbox2"
                                          >
                                            Gift Packing
                                          </label>
                                        </div>
                                      )}

                                      {cart.express_status && (
                                        <div className="form-check form-check-inline pointer">
                                          <input
                                            className="form-check-input pointer"
                                            type="checkbox"
                                            id="inlineCheckbox1"
                                            checked={
                                              cart.is_express ? true : false
                                            }
                                            onChange={(e) =>
                                              dispatch(
                                                checkExpress(
                                                  cart.shipping_id,
                                                  e.target.checked
                                                )
                                              )
                                            }
                                          />
                                          <label
                                            className="form-check-label pointer"
                                            htmlFor="inlineCheckbox1"
                                          >
                                            Express Shipping
                                          </label>
                                        </div>
                                      )}
                                    </div>
                                    <div
                                      className="d-flex justify-content-between justify-content-md-evenly align-items-center w-100"
                                      style={{ maxWidth: "390px" }}
                                    >
                                      <div className="item-price">Subtotal</div>
                                      <div className="sub-price">
                                        $
                                        {calculateTotalCostWithQuantity(
                                          cart?.cart_items
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <hr
                                    style={{
                                      borderColor: "#bdbdbd",
                                      margin: "25px 0",
                                    }}
                                  />
                                </div>
                              </>
                            );
                          })}
                      </div>
                    </div>

                    <Modal isOpen={showDeleteModal} toggle={toggleModal}>
                      <ModalHeader toggle={toggleModal}>
                        Confirm Remove Item
                      </ModalHeader>
                      <ModalBody>
                        Are you sure you want to remove this item ?
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          type="button"
                          className="btn-sm btn-secondary"
                          onClick={toggleModal}
                        >
                          Cancel
                        </Button>

                        <Button
                          type="button"
                          className="btn-sm btn-warning"
                          onClick={() => {
                            removeFromUserCart();
                          }}
                        >
                          Remove
                        </Button>
                      </ModalFooter>
                    </Modal>

                    {/*Modal*/}
                    <Modal isOpen={showDeleteModal} toggle={toggleModal}>
                      <ModalHeader toggle={toggleModal}>
                        Confirm Remove Item
                      </ModalHeader>
                      <ModalBody>
                        Are you sure you want to remove this item ?
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          type="button"
                          className="btn-sm btn-secondary"
                          onClick={toggleModal}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          className="btn-sm btn-warning"
                          onClick={() => {
                            removeFromUserCart(showDeleteModal);
                          }}
                        >
                          Remove
                        </Button>
                      </ModalFooter>
                    </Modal>
                  </>

                  {cart && (
                    <div
                      className="col-12 col-lg-4 order-section ms-lg-4"
                      style={{ padding: "30px 0" }}
                    >
                      <div className="px-30">
                        <h3 className="order-title">Your Order</h3>
                        <hr
                          style={{ borderColor: "#bdbdbd", margin: "25px 0" }}
                        />
                      </div>

                      <div className="flex-bill px-30">
                        <div className="flex-list">
                          <h1 className="order-list">Quantity</h1>
                          <div className="order-price">
                            {cart.cart_count ? cart.cart_count : 0}
                          </div>
                        </div>
                        <div className="flex-list">
                          <h1 className="order-list">Subtotal</h1>
                          <div className="order-price">
                            ${cart.subtotal ? cart.subtotal : 0}
                          </div>
                        </div>
                        <div className="flex-list">
                          <h1 className="order-list">Discount</h1>
                          <div className="order-price">
                            ${cart.discount ? cart.discount : 0}
                          </div>
                        </div>
                        <div className="flex-list">
                          <h1 className="order-list">Shipping & Processing</h1>
                          <div className="order-price">
                            ${cart.shipping_charge ? cart.shipping_charge : 0}
                          </div>
                        </div>
                        {cart.express_charge && (
                          <div className="flex-list">
                            <h1 className="order-list">Express Charges</h1>
                            <div className="order-price">
                              ${cart.express_charge ? cart.express_charge : 0}
                            </div>
                          </div>
                        )}
                        {cart.gift_charge && (
                          <div className="flex-list">
                            <h1 className="order-list">Gift Charges</h1>
                            <div className="order-price">
                              ${cart.gift_charge ? cart.gift_charge : 0}
                            </div>
                          </div>
                        )}
                        {cart?.tax_amount && (
                          <div className="flex-list">
                            <h1 className="order-list">Tax</h1>
                            <div className="order-price">
                              ${cart.tax_amount ? cart.tax_amount : 0}
                            </div>
                          </div>
                        )}

                        {/*<div className="flex-list">*/}
                        {/*    <h1 className="order-list">Delivery Charges</h1>*/}
                        {/*    <div*/}
                        {/*        className="order-price">${cart.delivery_charge ? cart.delivery_charge : 0}</div>*/}
                        {/*</div>*/}
                        <hr
                          style={{ borderColor: "#bdbdbd", margin: "25px 0" }}
                        />
                        <div className="flex-list mb-0">
                          <h1 className="total">Total</h1>
                          <h1 className="total">
                            ${cart.total ? cart.total : 0}
                          </h1>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className="d-flex justify-content-end w-100"
                  style={{ gap: "30px", marginTop: "70px" }}
                >
                  <Link to="/">
                    <button className="continueShopping">Continue</button>
                  </Link>
                  <Link to="/checkout">
                    <button className="chekoutProceed">Checkout</button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="d-flex justify-content-center align-items-center">
                <div className="not-found1">
                  <img
                    src={images["emptycart.png"]}
                    className="img-fluid"
                    title=""
                    alt=""
                    style={{ height: "250px", width: "250px" }}
                  />

                  <div
                    className="not-found1 col-md-12"
                    style={{ lineHeight: "30px" }}
                  >
                    <p style={{ fontSize: "35px" }}>
                      <strong>Your cart is empty</strong>
                    </p>

                    <h5 style={{ color: "green" }}>Continue shopping</h5>

                    <strong>
                      <span className="explore-more">
                        <Link to="/">
                          <div className="waviy">
                            <span style={{ "--i": "1" }}>S</span>
                            <span style={{ "--i": "2" }}>H</span>
                            <span style={{ "--i": "3" }}>O</span>
                            <span style={{ "--i": "4" }}>P</span>
                            &nbsp; &nbsp;
                            <span style={{ "--i": "5" }}>N</span>
                            <span style={{ "--i": "6" }}>O</span>
                            <span style={{ "--i": "7" }}>W</span>
                          </div>
                        </Link>
                      </span>
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      )}
    </>
  );
};

export default Cart;
