/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateMycart,
  removeCart,
  checkExpress,
  checkGift,
  updateCartQuantity,
} from "../checkoutpage/checkout_reducer";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { getHeaderData, get_meta } from ".././store/home";
import SiteLoader from "../SiteLoader";
import { images } from "../utils/images";
import { userCheckout } from "../checkoutpage/checkout_reducer";
import CartItem from "../Pages/Cart/CartItem";
import { toast } from "react-toastify";
// import { Helmet } from "react-helmet";

const Checkout = () => {
  let userDetails = localStorage.getItem("userDetails");
  let user = JSON.parse(userDetails);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  /** get all meta information */
  const mainstate = useSelector((state) => state.home);
  const metaTags = mainstate.allmeta;
  const siteUrl = window.location.href;

  useEffect(() => {
    dispatch(get_meta("home_page"));
  }, []);

  const totalCart = useSelector((state) => state.home.cartrecords);
  useEffect(() => {
    dispatch(userCheckout());
  }, []);
  const cartStatus = useSelector((state) => state.checkoutp);

  const [cartItems, setCartItems] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [prodQty, setProdQty] = useState(1);

  const mycartLists = useSelector((state) => state.checkoutp.checkout_data);

  useEffect(() => {
    if (mycartLists?.data) {
      setCartItems(mycartLists?.data);
      setUpdated(!updated);
    }
  }, [mycartLists]);
  const updatecart = (cart_id, type) => {
    // console.log('hii');
    dispatch(updateMycart({ cart_id, type }));
    if (cartStatus.cartfailStatus) {
      dispatch(userCheckout());
      //getHeaderData();
      getHeaderData();
      toast("cart updated successfully");
    } else {
      toast(cartStatus.cartupdateFail.message);
    }
  };

  const updateQuantity = () => {};

  // useEffect(() => {
  //   dispatch(stripeData());
  // }, []);

  const [showModal, setShowModal] = useState(null);
  const toggleModal = () => {
    setShowModal(null);
  };

  const checkout_state = useSelector((state) => state.checkoutp);

  const expStatus = checkout_state.exp_status;
  const checkdex = checkout_state.checkdex;

  const expStatus_gift = checkout_state.exp_gift_status;
  const checkdex_gift = checkout_state.checkgift;

  const userDeleteCart = (cart_id) => {
    dispatch(removeCart(cart_id));
    dispatch(getHeaderData(cart_id));
    setShowModal(null);
  };

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e, shipping_id) => {
    setIsChecked((prevState) => !prevState);

    let is_checked = e.target.checked ? 1 : 0; // use the updated value of isChecked

    dispatch(checkExpress(shipping_id, is_checked));

    if (is_checked) {
      dispatch(userCheckout());
      toast("Expedited fee added");
    } else {
      dispatch(userCheckout());
      toast("Expedited fee removed");
    }
  };
  useEffect(() => {
    if (typeof checkdex !== "undefined" && typeof expStatus !== "undefined") {
      if (checkdex === 1) {
        setIsChecked(true);
      }
      if (checkdex === 0) {
        setIsChecked(false);
      }
    }
  }, [expStatus, checkdex]);

  const handleQuantityChange = (itemId, value) => {
    // setCartItems((prevItems) =>
    //   // console.log("prevItems", prevItems),
    //   prevItems.map((item) =>
    //     // console.log("item", item),
    //     item.cart_id === itemId ? { ...item, quantity: Number(value) } : item
    //   )
    // );
    setCartItems((prevItems) =>
      prevItems.map((store) => ({
        ...store,
        cart_items: store.cart_items.map((item) =>
          item.cart_id === itemId
            ? { ...item, quantity: Number(value), isUpdated: true }
            : item
        ),
      }))
    );
    setUpdated(!updated);
  };

  const handleCustomQuantityChange = (itemId, e) => {
    if (e.target.value < 9) return;
    const customQuantity = e.target.value;

    // setCartItems((prevItems) =>
    //   prevItems.map((item) =>
    //     item.cart_id === itemId ? { ...item, quantity: Number(customQuantity) } : item
    //   )
    // );

    setCartItems((prevItems) =>
      prevItems.map((store) => ({
        ...store,
        cart_items: store.cart_items.map((item) =>
          item.cart_id === itemId
            ? { ...item, quantity: Number(customQuantity), isUpdated: true }
            : item
        ),
      }))
    );
    setUpdated(!updated);
  };

  const handleUpdateQuantity = (itemId, qty) => {
    const cart = cartItems.find((store) =>
      store.cart_items.some((item) => item.cart_id === itemId)
    );
    if (cart) {
      const product = cart.cart_items.find((item) => item.cart_id === itemId);
      dispatch(
        updateCartQuantity({
          inventory_id: product.inventory_id,
          quantity: `${qty}`,
          product_id: product.product_id,
          user_id: user?.ID,
        })
      );
    }
  };

  const [isCheckedgift, setIsCheckedGift] = useState();
  const handleCheckboxChange_Gift = (e, shipping_id) => {
    let userDetails = localStorage.getItem("userDetails");
    let data = JSON.parse(userDetails);
    let user_id = data?.ID;
    setIsCheckedGift(e.target.checked);

    dispatch(checkGift(shipping_id, e.target.checked));

    if (e.target.checked) {
      toast("Gift charge applied");
    } else {
      toast("Gift charge removed");
    }
  };

  useEffect(() => {
    if (
      typeof checkdex_gift !== "undefined" &&
      typeof expStatus_gift !== "undefined"
    ) {
      if (checkdex_gift === 1) {
        setIsCheckedGift(true);
      }
      if (checkdex_gift === 0) {
        setIsCheckedGift(false);
      }
    }
  }, [expStatus_gift, checkdex_gift]);
  //==============================================
  return (
    <>
      {/* <Helmet>
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
      </Helmet> */}
      <>
        {checkout_state.loaderStatus || cartStatus.status === "pending" ? (
          <SiteLoader
            status={
              checkout_state.loaderStatus || cartStatus.status === "pending"
            }
          />
        ) : (
          <>
            <main>
              <div className="bg-light inner-breadcrumb">
                <div className="container">
                  <div className="breadcrumb-head">
                    <nav className="breadcrumb-wrap">
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                          <a href="#">Home</a>
                        </li>
                        <li className="breadcrumb-item">
                          <a href="#"> Shop</a>
                        </li>
                        <li className="breadcrumb-item " aria-current="page">
                          <span className="breadcrumb_active">Cart</span>
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
              <section className="single-wrapper section-wrapper">
                <div className="container">
                  <div className="row">
                    {/* <!-- order  --> */}
                    <div className="col-md-8">
                      <div className="order-wrap">
                        {checkout_state.cartEmpty ? (
                          <>
                            {/* <li className="breadcrumb-item make-list-style-none">
                              Looks like your cart is feeling a bit empty. Why not add some goodies and give it a reason to smile?
                              <br /><a href="/" style={{ 'color': 'green' }}><strong>Continue shopping</strong></a>
                            </li> */}
                            <div className="not-found1 col-md-6 offset-md-6">
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
                                <h5 style={{ color: "green" }}>
                                  Continue shopping
                                </h5>
                                <br />
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
                          </>
                        ) : (
                          <>
                            <h5 className="heading-3 p-3 bg-light mb-4 ">
                              {mycartLists.cart_count}
                              <span className="text-capitalize">
                                {" "}
                                {mycartLists.cart_count == 1
                                  ? "item in your basket"
                                  : mycartLists.cart_count > 1
                                  ? "items in your basket"
                                  : "your cart is empty "}{" "}
                              </span>
                            </h5>
                          </>
                        )}
                        <div className="flex-item col-md-12 p-0 ">
                          {cartItems?.map((cart, index) => {
                            return (
                              <>
                                {checkout_state.cartEmpty === false ? (
                                  <>
                                    <>
                                      <h5 className="mb-2">
                                        {cart.store_name}
                                      </h5>
                                      {cartStatus?.checkout_data.data[0].cart_items.map(
                                        (carts, index) => {
                                          return (
                                            <CartItem
                                              carts={carts}
                                              setShowModal={setShowModal}
                                              updated={updated}
                                              setUpdated={setUpdated}
                                              handleUpdateQuantity={
                                                handleUpdateQuantity
                                              }
                                            />
                                          );
                                        }
                                      )}
                                      <Modal
                                        isOpen={showModal ? true : false}
                                        toggle={toggleModal}
                                      >
                                        <ModalHeader toggle={toggleModal}>
                                          Confirm Remove Item
                                        </ModalHeader>
                                        <ModalBody>
                                          Are you sure you want to remove this
                                          item ?
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
                                              userDeleteCart(showModal);
                                            }}
                                          >
                                            Remove
                                          </Button>
                                        </ModalFooter>
                                      </Modal>
                                      <div
                                        className=" flex-item col-md-12"
                                        style={{
                                          display: "flex",
                                          columnGap: "5%",
                                        }}
                                      >
                                        {cart.gift_status === 1 && (
                                          <div className="form-check form-check-inline">
                                            {/* checked={mycarts.is_gift === true} */}
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              id="inlineCheckbox2"
                                              value={isCheckedgift}
                                              defaultChecked={cart.is_gift}
                                              onChange={(e) =>
                                                handleCheckboxChange_Gift(
                                                  e,
                                                  cart.shipping_id
                                                )
                                              }
                                            />
                                            <label
                                              className="form-check-label"
                                              for="inlineCheckbox2"
                                            >
                                              Gift Packing
                                            </label>
                                          </div>
                                        )}
                                        {cart.express_status === 1 && (
                                          <div className="form-check form-check-inline">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              id="inlineCheckbox1"
                                              defaultChecked={cart.is_express}
                                              onChange={(e) =>
                                                handleCheckboxChange(
                                                  e,
                                                  cart.shipping_id
                                                )
                                              }
                                            />
                                            <label
                                              className="form-check-label"
                                              for="inlineCheckbox1"
                                            >
                                              Express Shipping
                                            </label>
                                          </div>
                                        )}
                                      </div>
                                    </>

                                    <hr />
                                  </>
                                ) : (
                                  // Render the JSX code when there are no cart items
                                  <p></p>
                                )}
                                {/* </div>
                                </div> */}
                              </>
                            );
                          })}
                        </div>
                        {/* pramodini */}
                      </div>
                    </div>
                    <div
                      className={`col-md-4 ${
                        checkout_state.cartEmpty ? "hide" : ""
                      }`}
                    >
                      <div className="cart-billing ">
                        {/* <!-- Payment Method  --> */}
                        <div className="cart-bill-card align-items-start py-4 manage-text-size">
                          <div className="bill-between w-100">
                            <h4>Payment Method </h4>
                            <br />
                            <div className="form-check hide">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="radios"
                                id="radios1"
                                value="option1"
                                checked
                              />
                              <label className="form-check-label" for="radios1">
                                <div className="cards-list">
                                  <div className="check-head mb-0">
                                    <i className="ri-visa-line"></i> Credit Card
                                    / Debit Card
                                  </div>
                                </div>
                              </label>
                            </div>
                            <div className="form-check mt-3 hide">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="radios"
                                id="radios2"
                                value="option2"
                              />
                              <label className="form-check-label" for="radios2">
                                <div className="check-head">
                                  <i className="ri-bank-line"></i> Net Banking
                                </div>
                              </label>
                            </div>
                            <div className="form-check hide">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="radios"
                                id="radios3"
                                value="option3"
                              />
                              <label className="form-check-label" for="radios3">
                                <div className="check-head">
                                  <i className="ri-fingerprint-line"></i> UPI
                                </div>
                              </label>
                            </div>
                            <div className="flex-bill">
                              {/* <div className="flex-list">
                          <div>GST(18%)</div>
                          <div className="bold">$40.00</div>
                        </div> */}
                              <div className="flex-list">
                                <div>Subtotal</div>
                                <div>${mycartLists.subtotal}</div>
                              </div>
                              <div className="flex-list">
                                <div>Shipping Charges</div>
                                <div>
                                  $
                                  {mycartLists.delivery_charge
                                    ? mycartLists.delivery_charge
                                    : 0}
                                </div>
                              </div>
                              <div className="flex-list">
                                <div>Discount</div>
                                <div>
                                  $
                                  {mycartLists.discount
                                    ? mycartLists.discount
                                    : 0}
                                </div>
                              </div>
                              <hr />
                              <div className="flex-list mt-2">
                                <div>Total</div>
                                <div>${mycartLists.total}</div>
                              </div>
                            </div>
                            <Link to="/shipping-info">
                              <button className="chekout">Checkout</button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>

            <div
              className=""
              style={{ float: "right", paddingLeft: "5%", paddingTop: "13px" }}
            >
              <Modal isOpen={showModal ? true : false} toggle={toggleModal}>
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
                      userDeleteCart(showModal);
                    }}
                  >
                    Remove
                  </Button>
                </ModalFooter>
              </Modal>
            </div>
          </>
        )}
      </>
    </>
  );
};

export default Checkout;
