import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
// import { CheckoutBanner, StripeLogo } from "../Images";
import {
  updateDefaultAddress,
  user_defaultAddress,
} from "../checkoutpage/checkout_reducer";
import { getUserAddresses } from "../store/home";

import Modal from "react-bootstrap/Modal";

import { mgtApi } from "../store/axios";

import StripeCheckout from "react-stripe-checkout";
import SiteLoader from "../SiteLoader";

const ShippingInfo = () => {
  const [stripeKey, setStripeKey] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(user_defaultAddress());
  }, []);

  const myCartLists = useSelector((state) => state.checkoutp?.checkout_data);
  const myAddressLists = useSelector(
    (state) => state.checkoutp?.checkout_address_data
  );
  const stripeCred = useSelector((state) => state.checkout?.stripeKey);
  const isLoading = useSelector((state) => state.checkoutp?.loaderStatus);

  // console.log("myAddressLists: ", myAddressLists);

  let userDetails = localStorage.getItem("userDetails");
  let data = JSON.parse(userDetails);
  let name = data?.full_name;
  let phone = data?.mobile;
  let mail = data?.email;

  // useEffect(() => {
  //   let shipId = props.location.state?.shipid;
  //   dispatch(checkoutData(shipId));
  // }, []);

  // print hello wold

  const onToken = (token) => {
    let shipId = myAddressLists?.shipping_address?.id;
    let stripeData = new FormData();
    stripeData.append("stripe_token", token.id);
    stripeData.append("shipping_address", shipId);
    let userDetails = localStorage.getItem("userDetails");
    let data = JSON.parse(userDetails);
    let user_id = data?.ID;
    mgtApi.post("stripe-transaction", stripeData).then((response) => {
      if (response.status === "success") {
        navigate("/user-dashboard", {
          state: {
            user_id: user_id,
          },
        });
      }
    });
  };

  const [showModal, setShowModal] = useState(false);

  const handleModalOpen = () => {
    // dispatch(addressUpdateModalOpen());
    dispatch(getUserAddresses());
    setShowModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
  };

  const addressLists = useSelector((state) => state.home.addressList);

  const [selectedValue, setSelectedValue] = useState(
    myAddressLists?.shipping_address?.id
  );

  function handleChange(event) {
    setSelectedValue(event.target.value);

    setShowModal(false);
    dispatch(updateDefaultAddress(event.target.value));
    dispatch(user_defaultAddress());
    toast("Shipping address changed successfully.");
  }

  const addStatus = useSelector((state) => state.checkoutp?.add_status);
  useEffect(() => {
    setShowModal(false);
  }, [addStatus]);
  // if(addStatus == true){
  //   setShowModal(false);
  // }

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "USD", // Change this to the appropriate currency code if needed
            value: myCartLists.total, // Change this to the appropriate amount for the order
          },
        },
      ],
    });
  };

  // Function to handle the onApprove event (when the payment is approved by the user)
  const onApprove = (data, actions) => {
    return actions.order.capture().then(function (details) {
      // Show a success message or perform any other actions after successful payment
      // console.log("Payment completed successfully:", details);
    });
  };

  // Function to handle any errors that might occur during the payment process
  const onError = (err) => {
    // console.log("Error occurred during payment:", err);
    // Handle the error appropriately (e.g., show an error message to the user)
  };

  const loadingSpinner = () => {
    return (
      <>
        <div
          className="d-flex"
          style={{ border: "1px solid red", gap: "10px" }}
        >
          <div className="spinner-border text-warning mr-2">
            <span className="sr-only"></span>
          </div>
          <span className="ml-4 text-warning">Loading</span>
        </div>
      </>
    );
  };

  return (
    <>
      {isLoading ? (
        <SiteLoader status={isLoading} />
      ) : (
        <>
          <main>
            <div className="bg-light inner-breadcrumb">
              <div className="container">
                <div className="breadcrumb-head">
                  <h3>Checkout Page</h3>
                  <nav className="breadcrumb-wrap">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a href=" ">Home</a>
                      </li>
                      <li className="breadcrumb-item">
                        <a href=" ">Shop</a>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Cart
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
            <section className="single-wrapper section-wrapper">
              <div className="container">
                <div className="row">
                  <div className="col-md-8">
                    <div className="cart-billing">
                      {/* <!-- personal details  --> */}
                      <div className="cart-bill-card">
                        <div className="bill-between">
                          <h4>
                            Personal Details{" "}
                            <i className="ri-checkbox-circle-fill text-warning"></i>
                          </h4>
                          <div className="flex-content d-block mt-3">
                            <div className="fl-item mb-2">
                              <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={name}
                              />
                            </div>
                            <div className="fl-item mb-2">
                              <input
                                type="number"
                                name="phone"
                                className="form-control"
                                value={phone}
                              />
                            </div>
                            <div className="fl-item mb-2">
                              <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={mail}
                                style={{ width: "100%" }}
                              />
                            </div>
                          </div>
                        </div>
                        {/* <!-- Payment Method  --> */}
                        <div className="cart-bill-card align-items-start hide">
                          <div className="bill-between">
                            <h4>Payment Method </h4>
                            <div className="form-check">
                              <div className="check-head">
                                <i className="ri-bank-card-2-line"></i> Debit
                                Card
                              </div>
                            </div>
                          </div>
                          <div className="bill-between">
                            <a href=" " className="btn btn-light btn-md">
                              Change
                            </a>
                          </div>
                        </div>
                      </div>

                      {myAddressLists?.billing_address &&
                        myAddressLists?.shipping_address ? (
                        <>
                          {/*Billing Address*/}
                          <div className="cart-bill-card">
                            {myAddressLists?.billing_address && (
                              <div className="bill-between">
                                <h4>
                                  Billing Address{" "}
                                  <i className="ri-checkbox-circle-fill text-warning"></i>
                                </h4>
                                <div className="flex-content">
                                  <h5 className="card-title mt-2">
                                    {myAddressLists?.billing_address?.name}
                                  </h5>
                                  <p className="card-text">{ }</p>
                                  <h6 className="card-subtitle my-2 text-muted">
                                    {`${myAddressLists?.billing_address?.street_address}, ${myAddressLists?.billing_address?.city}, ${myAddressLists?.billing_address?.state},  ${myAddressLists?.billing_address?.country}`}
                                  </h6>
                                  <p className="card-text">{`Zip: ${myAddressLists?.billing_address?.postcode}, Phone # ${myAddressLists?.billing_address?.phone}`}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/*Shipping Address*/}
                          <div className="cart-bill-card">
                            {myAddressLists?.shipping_address && (
                              <div style={{ width: "100% " }}>
                                <div
                                  className="d-flex justify-content-between"
                                  style={{ width: "100% " }}
                                >
                                  <h4>
                                    Shipping Address{" "}
                                    <i className="ri-checkbox-circle-fill text-warning"></i>
                                  </h4>
                                  <div>
                                    <Link
                                      to="#"
                                      onClick={handleModalOpen}
                                      className="btn btn-warning"
                                    >
                                      Change
                                    </Link>
                                  </div>
                                </div>
                                <div className="flex-content">
                                  <h5 className="card-title mt-2">
                                    {myAddressLists?.shipping_address?.name}
                                  </h5>
                                  <p className="card-text">{ }</p>
                                  <h6 className="card-subtitle my-2 text-muted">
                                    {`${myAddressLists?.shipping_address?.street_address}, ${myAddressLists?.shipping_address?.city}, ${myAddressLists?.shipping_address?.state},  ${myAddressLists?.shipping_address?.country}`}
                                  </h6>
                                  <p className="card-text">{`Zip: ${myAddressLists?.shipping_address?.postcode}, Phone # ${myAddressLists?.shipping_address?.phone}`}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          {/*Add New Address*/}
                          <div className="cart-bill-card">
                            <div style={{ width: "100% " }}>
                              <div
                                className="d-flex justify-content-between"
                                style={{ width: "100% " }}
                              >
                                <h4>Add Address</h4>
                                <div>
                                  <Link to="#" className="btn btn-warning">
                                    Add New
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    {/* <!-- order  --> */}
                  </div>
                  <div className="col-md-4">
                    <div className="order-wrap">
                      <h3 className="heading-3">Your Order</h3>
                      <div className="flex-item border-line">
                        <div className="flexItm hide">
                          <div className="item-img">
                            <img
                              src="assets/img/img3.jpg"
                              className="img-fluid"
                              title=""
                              alt=""
                            />
                          </div>
                          <div className="cart-item-dtl">
                            <h4>Pearl Necklace</h4>
                            <div className="dropdown item-dropdown">
                              <a
                                className="btn dropdown-toggle"
                                href=" "
                                role="button"
                                id="dropdownItem"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                1 Item
                              </a>
                              <ul
                                className="dropdown-menu"
                                aria-labelledby="dropdownItem"
                              >
                                <li>
                                  <a className="dropdown-item" href=" ">
                                    1 Item
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href=" ">
                                    2 Item
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href=" ">
                                    3 Item
                                  </a>
                                </li>
                              </ul>
                            </div>
                            <div className="price-item">$1,139.33</div>
                          </div>
                        </div>
                        {/* <hr /> */}
                        <div className="flex-bill">
                          <div className="flex-list">
                            <div>Quantity</div>
                            <div className="bold">
                              {myCartLists?.cart_count}
                            </div>
                          </div>
                          <div className="flex-list">
                            <div>Subtotal</div>
                            <div className="bold">${myCartLists?.subtotal}</div>
                          </div>
                          <div className="flex-list">
                            <div>Delivery Charges</div>
                            <div className="bold">
                              $
                              {myCartLists?.delivery_charge
                                ? myCartLists?.delivery_charge
                                : 0}
                            </div>
                          </div>
                          <div className="flex-list">
                            <div>Discount</div>
                            <div className="bold">
                              $
                              {myCartLists?.discount
                                ? myCartLists?.discount
                                : 0}
                            </div>
                          </div>
                          <div className="flex-list mt-5">
                            <div>Total</div>
                            <div className="bold">${myCartLists?.total}</div>
                          </div>
                        </div>
                        <br />
                        {stripeCred ? (
                          <Link to="/shipping-info">
                            <span>{stripeKey}</span>
                            <PayPalScriptProvider
                              options={{
                                clientId: process.env.REACT_APP_PAYPAL_ID,
                              }}
                            >
                              <PayPalButtons
                                style={{ layout: "horizontal" }} // You can customize the layout of the PayPal button
                                createOrder={(data, actions) =>
                                  createOrder(data, actions)
                                } // Call the createOrder function when the button is clicked
                                onApprove={(data, actions) =>
                                  onApprove(data, actions)
                                } // Call the onApprove function after the payment is approved
                                onError={(err) => onError(err)} // Call the onError function if an error occurs during the payment process
                              />
                            </PayPalScriptProvider>
                            <StripeCheckout
                              className="btn btn-md btn-warning w-100"
                              name="Mangtum"
                              amount={myCartLists.total * 100}
                              token={onToken}
                              stripeKey={process.env.REACT_APP_STRIPE_KEY}
                            />
                            {/* <button className="btn btn-md btn-warning w-100">Proceed to Pay</button> */}
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <hr />
            {/* <!-- clients  --> */}
          </main>

          {/* modal start */}

          <Modal
            show={showModal}
            onHide={handleModalClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                <h5 className="modal-title" id="addAddressLabel">
                  Select an address for shipping:
                </h5>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="containerr">
                <div className="row">
                  <div className="col-lg-12">
                    <ul className="address-ul">
                      {addressLists?.map((addresslist) => {
                        return (
                          <li>
                            <input
                              type="radio"
                              id={addresslist.id}
                              name="address"
                              className="form-check-input"
                              defaultValue={addresslist.id}
                              defaultChecked={
                                myAddressLists?.shipping_address?.id ===
                                addresslist.id
                              }
                              onChange={handleChange}
                            />
                            <label
                              htmlFor={addresslist.id}
                              style={{ color: "#ffc107" }}
                            >
                              <strong>{addresslist.name}</strong>,&nbsp;
                            </label>
                            <span>
                              {addresslist.street_address},{" "}
                              {addresslist.street_address2}, {addresslist.city},{" "}
                              {addresslist.state}, {addresslist.country}-{" "}
                              {addresslist.postcode}
                            </span>
                            <div className="check"></div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="col-md-12 center-btn">
                    {/* <button className="btn btn-sm btn-warning w-50" onClick={() => updateAddress()}>Update Address</button> */}
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              {/* <button onClick={handleModalClose}>Cancel</button> */}
            </Modal.Footer>
          </Modal>
          {/* modal end */}
        </>
      )}
    </>
  );
};

export default ShippingInfo;
