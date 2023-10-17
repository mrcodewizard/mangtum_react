import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMycartList } from "../store/home";
import ThemeBreadcrumb from "../components/common/ThemeBreadcrumb";
const Usercartlist = () => {
  const dispatch = useDispatch();
  const totalCart = useSelector((state) => state.home.cartrecords);
  useEffect(() => {
    dispatch(getMycartList());
  }, []);
  const mycart = useSelector((state) => state.home.cartArr);
  return (
    <>
      {/* <link href="assets/css/style.css" rel="stylesheet"/> */}
      <main>
        <ThemeBreadcrumb title="User List" current_route="User" />

        <section className="single-wrapper section-wrapper">
          <div className="container">
            <div className="row">
              {/* <!-- order  --> */}
              <div className="col-md-12">
                <div className="order-wrap">
                  <h5 className="heading-3 p-3 bg-light mb-4">
                    2 items in your basket
                  </h5>
                  <div className="flex-item p-0">
                    {mycart?.map((carts) => {
                      return (
                        <>
                          <div className="flexItm mb-3">
                            <div className="item-img">
                              <img
                                src={carts.main_image}
                                className="img-fluid"
                                title=""
                                alt=""
                              />
                            </div>
                            <div className="cart-item-dtl pe-4">
                              <h4 className="mb-2">{carts.pro_name}</h4>
                              {/* <p>Handmade Elegant Jodhpuri Sky Blue Nehru Modi Jacket with Kurta Pajama Set.</p> */}
                              {carts.attr?.map((attrname) => {
                                return (
                                  <p>
                                    {attrname.attr_name}: {attrname.attr_value}
                                  </p>
                                );
                              })}
                              <a href="#link" className="btn btn-light">
                                <i className="ri-heart-3-line"></i> Save for
                                Later
                              </a>
                              <a href="#link" className="btn btn-light">
                                <i className="ri-delete-bin-4-line"></i> Remove
                              </a>
                            </div>
                            <div className="pricedetl text-right">
                              <div className="price-item">
                                ${carts.total_amount} <br />
                                {/* <small style={{ fontWeight: "400" }}>
                      <del>$1,853.00</del>
                      </small> */}
                              </div>
                              <div className="content">
                                Delivery:{" "}
                                <span className="text-success">FREE</span>
                                <p>
                                  Estimated delivery:{" "}
                                  <abbr title="delivery time">
                                    27 Feb-01 Mar
                                  </abbr>{" "}
                                  from India
                                </p>
                              </div>
                              <div className="qty mt-3">
                                <button className="qtyminus" aria-hidden="true">
                                  −
                                </button>
                                <input
                                  type="number"
                                  name="qty"
                                  id="qty"
                                  min="1"
                                  max="10"
                                  step="1"
                                  value="1"
                                />
                                <button className="qtyplus" aria-hidden="true">
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                          <hr />
                        </>
                      );
                    })}
                    <Link to="/checkout">
                      <button className="btn btn-md btn-warning continue-btn">
                        Continue
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Usercartlist;
