import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchUserOrderDetails } from "../store/home";
import ThemeBreadcrumb from "../components/common/ThemeBreadcrumb";

const UserOrderDetails = (props) => {
  const { pathname, state } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserOrderDetails(state.order_id?.id));
  }, [state, dispatch]);

  const state1 = useSelector((state) => state.home);
  const orderDetails = state1.userOrderDetail;

  return (
    <>
      <main>
        <ThemeBreadcrumb title="Order Details" current_route="Order Details" />
      </main>
      <>
        <section className="order-details">
          <div className="order-description">
            <div className="container">
              <article className="card1">
                <div className="card-body">
                  <h6 style={{ marginBottom: "3%" }}>
                    Order ID: {state.order_id?.order_id}
                  </h6>
                  {orderDetails?.items?.map((order) => {
                    return (
                      <>
                        <article
                          className="card1"
                          style={{
                            border: "1px solid grey",
                            paddingLeft: "4%",
                          }}
                        >
                          <div className="card-body row">
                            <div className="col-md-5">
                              {/* <strong>Description</strong> */}
                              <br />
                              <div className="d-flex">
                                <img
                                  src={order?.main_image}
                                  style={{ height: "100px", width: "100px" }}
                                  alt=""
                                />
                                <div className="pr-desc">
                                  <a className="cartLink" href="#">
                                    <h4 className="orderhead">
                                      {order?.product_name}
                                    </h4>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div
                              className="col"
                              style={{ textAlign: "center" }}
                            >
                              <strong>Quantity</strong>
                              <br />
                              {order?.quantity}
                            </div>
                            <div
                              className="col"
                              style={{ textAlign: "center" }}
                            >
                              <strong>Status</strong>
                              <br />
                              {order?.item_order_status}
                            </div>
                            {order?.item_order_status === "Shipped" && (
                              <>
                                <div
                                  className="col"
                                  style={{ textAlign: "center" }}
                                >
                                  <strong>Tracking ID</strong>
                                  <br />
                                  {order?.tracking_id}
                                </div>
                                <div
                                  className="col"
                                  style={{ textAlign: "center" }}
                                >
                                  <strong>Carrier</strong>
                                  <br />
                                  {order?.shipper}
                                </div>
                              </>
                            )}
                            <div
                              className="col"
                              style={{ textAlign: "center" }}
                            >
                              <strong>Price </strong>
                              <br />
                              <span>&#x24;</span> {order?.price}
                            </div>
                            <div
                              className="col"
                              style={{ textAlign: "center" }}
                            >
                              <strong>Total Amount </strong>
                              <br />
                              <span>&#x24;</span>
                              {order?.total_amount}
                            </div>
                          </div>
                        </article>

                        <div className="card-body">
                          <div
                            className={`steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x ${order.item_order_status}`}
                          >
                            <div className="step">
                              <div className="step-icon-wrap">
                                <div className="step-icon">
                                  <i
                                    className="fa fa-shopping-cart"
                                    aria-hidden="true"
                                  ></i>
                                </div>
                              </div>
                              <h4 className="step-title">Confirmed Order</h4>
                            </div>
                            <div className="step">
                              <div className="step-icon-wrap">
                                <div className="step-icon">
                                  <i className="fa fa-user"></i>
                                </div>
                              </div>
                              <h4 className="step-title">Order Processed</h4>
                            </div>
                            <div className="step">
                              <div className="step-icon-wrap">
                                <div className="step-icon">
                                  <i className="fa fa-truck"></i>
                                </div>
                              </div>
                              <h4 className="step-title">On the way</h4>
                            </div>
                            <div className="step">
                              <div className="step-icon-wrap">
                                <div className="step-icon">
                                  <i
                                    className="fa fa-gift"
                                    aria-hidden="true"
                                  ></i>
                                </div>
                              </div>
                              <h4 className="step-title">Product Delivered</h4>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}

                  <hr />
                </div>
                {/* <a href="#" className="btn btn-warning" data-abc="true">
            <i className="fa fa-chevron-left"></i> Back to orders
          </a> */}
              </article>
            </div>
          </div>
        </section>

        <>
          <section>
            <div className="row userbilling" style={{ margin: "5%" }}>
              <h3
                className="wow animated fadeInUp"
                data-wow-delay="0.3s"
                style={{ "text-align": "center" }}
              >
                Address Detail
              </h3>
              <div className="col-md-4 mb-3 mb-sm-0">
                <div className="card">
                  <div className="usercard-body">
                    <h4>Billing Address</h4>
                    <hr className="horizontal-line" />
                    <p>
                      {/* style ={{'padding-top':'20px'}} <h4 className="mb-3" style ={{'padding-top':'20px'}}>Change Password</h4>
                       */}
                      <strong>Name:</strong>
                      <span style={{ "margin-left": "10px" }}>
                        {orderDetails?.billing_address?.name}
                      </span>
                      <br />
                      <strong>Address :</strong>
                      <span style={{ "margin-left": "10px" }}>
                        {orderDetails?.billing_address?.street_address}
                      </span>
                      <br />
                      <strong>Postcode :</strong>
                      <span style={{ "margin-left": "10px" }}>
                        {orderDetails?.billing_address?.postcode}
                      </span>
                      <br />
                      <strong>City :</strong>
                      <span style={{ "margin-left": "10px" }}>
                        {orderDetails?.billing_address?.city}
                      </span>
                      <br />
                      <strong>State : </strong>
                      <span style={{ "margin-left": "10px" }}>
                        {orderDetails?.billing_address?.state}
                      </span>
                      <br />
                      <strong>Country : </strong>
                      <span style={{ "margin-left": "10px" }}>
                        {orderDetails?.billing_address?.country}
                      </span>
                      <br />
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-sm-4 mb-3 mb-sm-0">
                <div className="card">
                  <div className="usercard-body">
                    <h4>Shipping Address</h4>
                    <hr className="horizontal-line" />
                    <p>
                      <strong>Name:</strong>
                      <span style={{ "margin-left": "10px" }}>
                        {orderDetails?.shipping_address?.name}
                      </span>
                      <br />
                      <strong>Address :</strong>
                      <span style={{ "margin-left": "10px" }}>
                        {orderDetails?.shipping_address?.street_address}
                      </span>
                      <br />
                      <strong>Postcode :</strong>
                      <span style={{ "margin-left": "10px" }}>
                        {orderDetails?.shipping_address?.postcode}
                      </span>
                      <br />
                      <strong>City :</strong>
                      <span style={{ "margin-left": "10px" }}>
                        {orderDetails?.shipping_address?.city}
                      </span>
                      <br />
                      <strong>State : </strong>
                      <span style={{ "margin-left": "10px" }}>
                        {orderDetails?.shipping_address?.state}
                      </span>
                      <br />
                      <strong>Country : </strong>
                      <span style={{ "margin-left": "10px" }}>
                        {orderDetails?.shipping_address?.country}
                      </span>
                      <br />
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-sm-4 mb-3 mb-sm-0">
                <div className="card">
                  <div className="usercard-body">
                    <h4>Pricing</h4>
                    <hr className="horizontal-line" />
                    <p>
                      <strong>Subtotal:</strong>
                      <span style={{ "margin-left": "10px" }}>
                        {orderDetails?.subtotal}$
                      </span>
                      <br />
                      <strong>Delivery Charges:</strong>
                      <span style={{ "margin-left": "10px" }}>
                        {orderDetails?.delivery_charge}$
                      </span>
                      <br />
                      <strong>Tax:</strong>
                      <span style={{ "margin-left": "10px" }}>
                        {orderDetails?.tax}$
                      </span>
                      <br />
                      <strong>Discount:</strong>
                      <span style={{ "margin-left": "10px" }}>
                        {orderDetails?.discount}$
                      </span>
                      <br />
                      <strong>Total:</strong>
                      <span style={{ "margin-left": "10px" }}>
                        {orderDetails?.total}$
                      </span>
                      <br />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      </>
    </>
  );
};

export default UserOrderDetails;
