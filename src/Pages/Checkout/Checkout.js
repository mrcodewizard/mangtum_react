import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { getUserDefaultAddress } from "../../store/checkout";
import {
  getCountry,
  getHeaderData,
  getStatesList,
  getUserAddresses,
  homeActions,
  manageAddressField,
  saveUserAddress,
} from "../../store/home";
import StripeCheckout from "react-stripe-checkout";
import SiteLoader from "../../SiteLoader";
import SiteLogo from "../../components/img/logo.png";
import {
  getCartData,
  getPayPalCredentials,
  getStripeCredentials,
  placeOrder,
  placeOrderAfterPayPalPayment,
  placeOrderAfterStripePayment,
} from "../../store/newCart";
import { Circles } from "react-loader-spinner";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { Button, Modal } from "react-bootstrap";
import ThemeBreadcrumb from "../../components/common/ThemeBreadcrumb";

const Checkout = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Const Variables
  let userDetails = localStorage.getItem("userDetails");
  let data = JSON.parse(userDetails);
  let name = data?.full_name;
  let phone = data?.mobile;
  let mail = data?.email;
  let tokenId = "";

  const mainstate = useSelector((state) => state.home);
  const metaTags = mainstate.allmeta;
  const siteUrl = window.location.href;

  // UseSelectors
  const cart = useSelector((state) => state.newCart.cart);
  const myCartLists = useSelector((state) => state.newCart.cartData);
  const myAddressLists = useSelector(
    (state) => state.checkout.checkout_address_data
  );
  const isLoading = useSelector((state) => state.checkout.loaderStatus);
  const addressList = useSelector((state) => state.home.addressList);
  const addStatus = useSelector((state) => state.checkout.add_status);
  const userAddress = useSelector((state) => state.home.user_Address);
  const countries = useSelector((state) => state.home.Country);
  const states_list = useSelector((state) => state.home.states_list);
  const state = useSelector((state) => state.checkout);
  const stripeCredentials = useSelector(
    (state) => state.newCart.stripeCredentials
  );
  const paypalCredentials = useSelector(
    (state) => state.newCart.paypalCredentials
  );
  // console.log('cart: ', cart);
  // console.log('myCartLists: ', myCartLists);
  // console.log('addressList: ', addressList);
  // console.log('myAddressLists: ', myAddressLists);
  // console.log('stripeCredentials: ', stripeCredentials)
  // console.log('paypalCredentials: ', paypalCredentials)

  // UseStates
  const [showSelectShippingModal, setShowSelectShippingModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({});
  const [selectedValue, setSelectedValue] = useState(
    myAddressLists?.shipping_address?.id
  );
  const [errors, setErrors] = useState(false);
  const [showStates, setShowStates] = useState(false);

  const [loading, setLoading] = useState(true);

  // Methods
  const onToken = async (token) => {
    if (token) {
      tokenId = token.id;

      let isSuccess = await dispatch(
        await placeOrderAfterStripePayment({
          token: tokenId,
          shipping_address: Number(shippingAddress.id),
        })
      );

      dispatch(getHeaderData({ user_id: userDetails?.ID }));

      if (isSuccess) {
        navigate("/thank-you");
      } else {
        navigate("/checkout");
        // console.log('Something went wrong!')
      }
    }
  };

  // Select shipping modal
  const onOpenSelectShippingModal = async () => {
    // dispatch(addressUpdateModalOpen());
    await dispatch(getUserAddresses());
    setShowSelectShippingModal(true);
  };
  const onCloseSelectShippingModal = () => {
    setShowSelectShippingModal(false);
  };
  // Add address modal
  const onOpenAddAddressModal = () => {
    setShowAddAddressModal(true);
  };
  const onCloseAddAddressModal = () => {
    setShowAddAddressModal(false);
  };
  const handleChange = (event) => {
    // console.log('selected value: ', event.target.value)
    setShippingAddress(
      addressList.find((address) => address.id === Number(event.target.value))
    );
    // console.log('setShippingAddress after set: ', shippingAddress);
    setShowSelectShippingModal(false);
    // setSelectedValue(event.target.value);
    // dispatch(updateDefaultAddress(event.target.value))
    // dispatch(getUserDefaultAddress())
    // toast("Shipping address changed successfully.");
  };
  const createOrder = (data, actions) => {
    // console.log('actions: ', actions)
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "USD", // Change this to the appropriate currency code if needed
            value: cart.total, // Change this to the appropriate amount for the order
          },
        },
      ],
    });
  };
  const onApprove = async (data, actions) => {
    try {
      const response = await actions.order.capture();
      if (response) {
        let isSuccess = await dispatch(
          await placeOrderAfterPayPalPayment({
            shipping_address: Number(shippingAddress.id),
            response_data: response,
          })
        );

        dispatch(getHeaderData({ user_id: userDetails?.ID }));

        if (isSuccess) {
          navigate("/thank-you");
        } else {
          navigate("/checkout");
          // console.log('Something went wrong!')
        }
      }
      return response;
    } catch (e) {
      // console.log('something went wrong in paypal: ', e)
    }

    // return actions.order.capture().then(function (details) {
    //     // Show a success message or perform any other actions after successful payment
    //     console.log("Payment completed successfully:", details);
    //
    //     let isSuccess = dispatch(placeOrderAfterPayPalPayment({
    //         shipping_address: Number(shippingAddress.id),
    //         response_data: details,
    //     }))
    //
    //     console.log('isSuccess: ', isSuccess)
    //
    //     if (isSuccess) {
    //         navigate('/thank-you');
    //     } else {
    //         navigate('/checkout');
    //         console.log('Something went wrong!')
    //     }
    // });
  };
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
  // Add New Address function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateInputs(userAddress)) {
      await dispatch(saveUserAddress(userAddress));
      await dispatch(await getCartData(true));
      await dispatch(await getUserDefaultAddress());
      await dispatch(await getUserAddresses());
      await dispatch(getCountry());
      await dispatch(
        homeActions.updateUserAddressDetails({
          user_id: data?.ID,
          name: "",
          phone: "",
          street_address: "",
          city: "",
          state: "",
          postcode: "",
          country: "",
          address_for: "",
        })
      );
      toast("Address updated successfully.");
      setShowAddAddressModal(false);
    }
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    if (name === "country" && ["United States", "Canada"].includes(value)) {
      const selectElement = e.target;
      const selectedIndex = selectElement.selectedIndex;
      const selectedOption = selectElement.options[selectedIndex];
      if (selectedOption) {
        const id = selectedOption.getAttribute("data-id");
        dispatch(getStatesList(id));
      }

      setShowStates(true);
    } else if (name === "country") {
      setShowStates(false);
    }

    let input = { field: name, value: value };
    dispatch(manageAddressField(input));
  };
  const validateInputs = (values, key) => {
    const errors = {};
    const regex =
      /^(|(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6})$/i;

    if (!values.name) {
      errors.name = "Your Name is required!";
    }

    // if (!values.email) {
    //   errors.email = "Email is required!";
    // } else if (!regex.test(values.email)) {
    //   errors.email = "Please enter the correct format of the email.";
    // }

    if (!values.phone) {
      errors.phone = "Phone Number is required!";
    }

    if (!values.street_address) {
      errors.street_address = "Street Address is required!";
    }

    if (!values.city) {
      errors.city = "City is required!";
    }

    if (!values.state) {
      errors.state = "State is required!";
    }

    // if (!values.postcode) {
    //     errors.postcode = "Postcode is required!";
    // }

    if (!values.country) {
      errors.country = "Country is required!";
    }
    // if (key === "new") {
    //   if (!values.address_for) {
    //     errors.address_for = "Address Type is required!";
    //   }
    // }
    setErrors(errors);
    return Object.values(errors).length <= 0;
  };

  useEffect(() => {
    dispatch(getCartData());
    dispatch(getStripeCredentials());
    dispatch(getPayPalCredentials());
    dispatch(getUserDefaultAddress());
    dispatch(getUserAddresses());
    dispatch(getCountry());
  }, []);

  // console.log(paypalCredentials)
  // console.log(stripeCredentials)

  useEffect(() => {
    // console.log('shipping address changes')
    if (addressList && addressList.length) {
      let shippingAddress = addressList.find(
        (address) => address.is_shipping === 1
      );
      // console.log('shipping address: ', shippingAddress);
      if (shippingAddress) setShippingAddress(shippingAddress);
      else setShippingAddress({});
    }
  }, [addressList]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [pathname]);

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
        <main>
          <ThemeBreadcrumb title="Checkout" current_route="Checkout" />

          <section
            className="single-wrapper section-wrapper"
            style={{ marginTop: "50px" }}
          >
            <div className="container">
              <div className="row">
                {/* <!-- personal details  --> */}
                <div className="col-md-8">
                  <div className="cart-billing">
                    {/* <!-- personal details  --> */}
                    <div className="cart-bill-card">
                      <div className="bill-between">
                        <h4>
                          Personal Details
                          <i className="ri-checkbox-circle-fill text-warning"></i>
                        </h4>
                        <div className="flex-content d-block mt-3">
                          <div className="fl-item mb-2">
                            <input
                              type="text"
                              name="name"
                              className="form-control"
                              defaultValue={name}
                            />
                          </div>
                          <div className="fl-item mb-2">
                            <input
                              type="number"
                              name="phone"
                              className="form-control"
                              defaultValue={phone}
                            />
                          </div>
                          <div className="fl-item mb-2">
                            <input
                              type="email"
                              name="email"
                              className="form-control"
                              defaultValue={mail}
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
                              <i className="ri-bank-card-2-line"></i> Debit Card
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
                          {/*{myAddressLists?.shipping_address &&*/}
                          {shippingAddress && (
                            <div style={{ width: "100% " }}>
                              <div
                                className="d-flex justify-content-between"
                                style={{ width: "100% " }}
                              >
                                <h4>
                                  Shipping Address{" "}
                                  <i className="ri-checkbox-circle-fill text-warning"></i>
                                </h4>
                                <button
                                  onClick={onOpenSelectShippingModal}
                                  className="theme-btn px-3 py-2"
                                >
                                  Change
                                </button>
                              </div>
                              <div className="flex-content">
                                <h5 className="card-title mt-2">
                                  {shippingAddress?.name}
                                </h5>
                                <p className="card-text">{}</p>
                                <h6 className="card-subtitle my-2 text-muted">
                                  {`${shippingAddress?.street_address}, ${shippingAddress?.city}, ${shippingAddress?.state},  ${shippingAddress?.country}`}
                                </h6>
                                <p className="card-text">{`Zip: ${shippingAddress?.postcode}, Phone # ${shippingAddress?.phone}`}</p>
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
                              <Button
                                onClick={onOpenAddAddressModal}
                                className="btn btn-warning"
                              >
                                Add Address
                              </Button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* <!-- order  --> */}
                <div className="col-md-4">
                  {cart ? (
                    <>
                      <div className="order-wrap border-line">
                        <h3
                          className="heading-3"
                          style={{ marginBottom: "10px" }}
                        >
                          Your Order
                        </h3>
                        <hr
                          style={{ borderColor: "#bdbdbd", margin: "25px 0" }}
                        />
                        <div className="flex-item">
                          <div className="flex-bill">
                            <div className="flex-list">
                              <div>Quantity</div>
                              <div className="bold">
                                {cart.cart_count ? cart.cart_count : 0}
                              </div>
                            </div>
                            <div className="flex-list">
                              <div>Subtotal</div>
                              <div className="bold">
                                ${cart.subtotal ? cart.subtotal : 0}
                              </div>
                            </div>
                            <div className="flex-list">
                              <div>Discount</div>
                              <div className="bold">
                                ${cart.discount ? cart.discount : 0}
                              </div>
                            </div>
                            <div className="flex-list">
                              <div>Shipping & Processing</div>
                              <div className="bold">
                                $
                                {cart.shipping_charge
                                  ? cart.shipping_charge
                                  : 0}
                              </div>
                            </div>
                            {cart.express_charge && (
                              <div className="flex-list">
                                <div>Express Charges</div>
                                <div className="bold">
                                  $
                                  {cart.express_charge
                                    ? cart.express_charge
                                    : 0}
                                </div>
                              </div>
                            )}
                            {cart.gift_charge && (
                              <div className="flex-list">
                                <div>Gift Charges</div>
                                <div className="bold">
                                  ${cart.gift_charge ? cart.gift_charge : 0}
                                </div>
                              </div>
                            )}
                            {cart.tax_amount && (
                              <div className="flex-list">
                                <div>Tax</div>
                                <div className="bold">
                                  ${cart.tax_amount ? cart.tax_amount : 0}
                                </div>
                              </div>
                            )}

                            {/*<div className="flex-list">*/}
                            {/*    <div>Delivery Charges</div>*/}
                            {/*    <div*/}
                            {/*        className="bold">${cart.delivery_charge ? cart.delivery_charge : 0}</div>*/}
                            {/*</div>*/}
                            <hr />
                            <div className="flex-list">
                              <div>Total</div>
                              <div className="bold">
                                ${cart.total ? cart.total : 0}
                              </div>
                            </div>
                          </div>

                          {loading ? (
                            <div className="mx-auto d-flex justify-content-center">
                              <Circles
                                type="Circles"
                                color="#f6a92c"
                                height={30}
                                width={30}
                              />
                            </div>
                          ) : (
                            <Link to="/checkout">
                              {/*<span>{stripeKey}</span>*/}

                              {Object.keys(paypalCredentials).length > 0 && (
                                <PayPalScriptProvider
                                  // options={{ clientId: paypalCredentials?.paypal_key }}
                                  options={{
                                    clientId: paypalCredentials?.wobble_key
                                      ? paypalCredentials?.wobble_key
                                      : process.env.REACT_APP_PAYPAL_ID,
                                  }}
                                >
                                  {/*options={{clientId: paypalCredentials?.paypal_key}}>*/}
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
                              )}

                              {Object.keys(stripeCredentials).length > 0 && (
                                <StripeCheckout
                                  className="btn btn-md
                                                                btn-warningw-100"
                                  style={{ width: "100%" }}
                                  name="Mangtum"
                                  amount={cart.total * 100}
                                  token={onToken}
                                  stripeKey={stripeCredentials?.bouncy_key}
                                  // stripeKey={stripeCredentials?.stripe_key ? stripeCredentials?.stripe_key : process.env.REACT_APP_STRIPE_KEY}
                                />
                              )}
                            </Link>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="d-flex justify-content-center accordian">
                        <Circles
                          type="Circles"
                          color="#f6a92c"
                          height={80}
                          width={80}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
          {/* <!-- clients  --> */}

          {/* Modal */}
          <Modal
            show={showAddAddressModal}
            onHide={onCloseAddAddressModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                <h5 className="modal-title" id="addAddressLabel">
                  Add Address
                </h5>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="container">
                <div className="row">
                  <div className="col-md-12 login-wrap">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-6 form-group mb-3">
                          <label htmlFor="name">Name</label>
                          <input
                            type="text"
                            name="name"
                            maxLength={50}
                            onChange={onChangeInput}
                            className="form-control"
                            placeholder="Your Full Name"
                            defaultValue={userAddress.name}
                          />
                          <p className="register_error">{errors.name}</p>
                        </div>

                        <div className="col-md-6 form-group mb-3">
                          <label htmlFor="street_address">Street Address</label>
                          <input
                            type="text"
                            name="street_address"
                            onChange={onChangeInput}
                            className="form-control"
                            placeholder="Address"
                            defaultValue={userAddress.street_address}
                          />
                          <p className="register_error">
                            {errors.street_address}
                          </p>
                        </div>

                        <div className="col-md-6 form-group mb-3">
                          <label htmlFor="country">Country</label>
                          <select
                            name="country"
                            id="country"
                            onChange={onChangeInput}
                            className="form-control"
                            defaultValue={userAddress.country}
                          >
                            <option value="">Choose Your Country</option>
                            {countries.map((country) => (
                              <option
                                key={country.id}
                                data-id={country.id}
                                value={country.country_name}
                              >
                                {country.country_name}
                              </option>
                            ))}
                          </select>
                          <p className="register_error">{errors.country}</p>
                        </div>

                        <div className="col-md-6 form-group mb-3">
                          <label htmlFor="state">State</label>
                          {showStates ? (
                            <select
                              name="state"
                              id="state"
                              onChange={onChangeInput}
                              className="form-control"
                              defaultValue={userAddress.state}
                            >
                              <option value="">Choose Your State</option>
                              {states_list.length > 0 &&
                                states_list.map((state) => (
                                  <option value={state.state_name}>
                                    {state.state_name}
                                  </option>
                                ))}
                            </select>
                          ) : (
                            <input
                              type="state"
                              name="state"
                              onChange={onChangeInput}
                              className="form-control"
                              placeholder="State"
                              defaultValue={userAddress.state}
                            />
                          )}

                          <p className="register_error">{errors.state}</p>
                        </div>

                        <div className="col-md-6 form-group mb-3">
                          <label htmlFor="city">City</label>
                          <input
                            type="text"
                            name="city"
                            onChange={onChangeInput}
                            className="form-control"
                            placeholder="Your City Name"
                            defaultValue={userAddress.city}
                          />
                          <p className="register_error">{errors.city}</p>
                        </div>

                        <div className="col-md-6 form-group mb-3">
                          <label htmlFor="postcode">Zipcode</label>
                          <input
                            type="text"
                            name="postcode"
                            onChange={onChangeInput}
                            className="form-control"
                            placeholder="Pincode"
                            defaultValue={userAddress.postcode}
                          />
                          <p className="register_error">{errors.postcode}</p>
                        </div>

                        <div className="col-md-12 form-group mb-3">
                          <label htmlFor="phone">Phone Number</label>
                          <input
                            type="text"
                            name="phone"
                            onChange={onChangeInput}
                            className="form-control"
                            placeholder="Phone Number/Mobile Number"
                            defaultValue={userAddress.phone}
                          />
                          <p className="register_error">{errors.phone}</p>
                        </div>

                        <div className="col-md-12 center-btn">
                          <button
                            type="submit"
                            disabled={state.loaderStatus}
                            className="btn btn-sm btn-warning w-50"
                          >
                            Add Address
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </Modal.Body>
            {/*<Modal.Footer>*/}
            {/*    <button onClick={handleModalClose}>Cancel</button>*/}
            {/*</Modal.Footer>*/}
          </Modal>

          {/* modal start */}
          <Modal
            show={showSelectShippingModal}
            onHide={onCloseSelectShippingModal}
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
              <div className="containerr row">
                <div className="col-lg-12">
                  <ul className="address-ul">
                    {addressList?.map((addresslist, key) => {
                      return (
                        <li key={key}>
                          <input
                            type="radio"
                            id={addresslist.id}
                            name="address"
                            className="form-check-input"
                            defaultValue={addresslist.id}
                            defaultChecked={
                              shippingAddress?.id === addresslist.id
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
            </Modal.Body>
          </Modal>
          {/* modal end */}
        </main>
      )}
    </>
  );
};

export default Checkout;
