import React, { useEffect } from "react";
import ThemeBreadcrumb from "../components/common/ThemeBreadcrumb";

const ShippingChange = () => {
  return (
    <div>
      <main>
        <ThemeBreadcrumb title="My Cart" current_route="Shop / Cart" />

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
                      <div className="flex-content">
                        <div className="fl-item">Deepak Kumar Behera</div>
                        <div className="fl-item">7978730692</div>
                        <div className="fl-item">emaple@email.com</div>
                      </div>
                    </div>
                    <div className="bill-between">
                      <a className="btn btn-light btn-md" href="/personal">
                        Change
                      </a>
                    </div>
                  </div>
                  {/* <!-- shipping address  --> */}
                  <div className="cart-bill-card align-items-start">
                    <div className="bill-between">
                      <h4>
                        Shipping Address{" "}
                        <i className="ri-checkbox-circle-fill text-warning"></i>
                      </h4>
                      <div className="flex-content">
                        <div className="fl-item">
                          <textarea
                            name=""
                            id=""
                            cols="30"
                            rows="4"
                            className="form-control"
                          >
                            DL Colony, Vss Nagar, Bhubaneswar, Odisha - 751007
                          </textarea>
                        </div>
                      </div>
                    </div>
                    <div className="bill-between">
                      <a className="btn btn-light btn-md" href="/Cart/Cart">
                        Save
                      </a>
                    </div>
                  </div>
                  {/* <!-- Payment Method  --> */}
                  <div className="cart-bill-card ">
                    <div className="bill-between">
                      <h4>Payment Method </h4>
                      <div className="form-check mt-3">
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
              </div>
              {/* <!-- order  --> */}
              <div className="col-md-4">
                <div className="order-wrap">
                  <h3 className="heading-3">Your Order</h3>
                  <div className="flex-item border-line">
                    <div className="flexItm">
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
                    <hr />
                    <div className="flex-bill">
                      <div className="flex-list">
                        <div>Delivery Charges</div>
                        <div className="bold">$20.00</div>
                      </div>
                      <div className="flex-list">
                        <div>GST(18%)</div>
                        <div className="bold">$40.00</div>
                      </div>
                      <div className="flex-list">
                        <div>Discount</div>
                        <div className="bold">$40.00</div>
                      </div>
                      <div className="flex-list mt-5">
                        <div>Total</div>
                        <div className="bold">$1,159.33</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <hr />
        {/* <!-- clients  --> */}
        <section className="section-wrapper">
          <div className="container">
            <div className="clients-wrap">
              <h4 className="text-center">
                Trusted By Over 4000 Big Companies
              </h4>
              <div className="clientLogo">
                <a href="#link">
                  <img
                    src="assets/img/logo1.png"
                    className="img-fluid"
                    title=""
                    alt=""
                  />
                </a>
                <a href="#link">
                  <img
                    src="assets/img/logo2.png"
                    className="img-fluid"
                    title=""
                    alt=""
                  />
                </a>
                <a href="#link">
                  <img
                    src="assets/img/logo3.png"
                    className="img-fluid"
                    title=""
                    alt=""
                  />
                </a>
                <a href="#link">
                  <img
                    src="assets/img/logo4.png"
                    className="img-fluid"
                    title=""
                    alt=""
                  />
                </a>
                <a href="#link">
                  <img
                    src="assets/img/logo5.png"
                    className="img-fluid"
                    title=""
                    alt=""
                  />
                </a>
                <a href="#link">
                  <img
                    src="assets/img/logo6.png"
                    className="img-fluid"
                    title=""
                    alt=""
                  />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ShippingChange;
