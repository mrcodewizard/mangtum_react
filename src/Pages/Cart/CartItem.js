import React from "react";
import { Link } from "react-router-dom";
import { images } from "../../utils/images";
import { useSelector } from "react-redux";
import { Circles } from "react-loader-spinner";

const CartItem = ({
  cartItem,
  index,
  handleClickOnCloseModalButton,
  handleUpdateQuantity,
}) => {
  const [localQuantity, setLocalQuantity] = React.useState(cartItem.quantity);
  const [selectedItem, setSelectedItem] = React.useState(null);

  const isLoading = useSelector(
    (state) => state.newCart.updateCartItemQuantityLoading
  );

  const handleClickOnClose = (cart_id) => {
    handleClickOnCloseModalButton(cart_id);
  };

  const handleQuantityInc = async (_index) => {
    let quantity = Number(cartItem.quantity);
    if (quantity >= Number(cartItem.stock)) return;
    setLocalQuantity((quantity = quantity + 1));
    setSelectedItem(_index);
    await handleUpdateQuantity(cartItem.cart_id, quantity);
    setSelectedItem(null);
  };

  const handleQuantityDec = async (_index) => {
    let quantity = Number(cartItem.quantity);
    if (quantity === 1) return;
    setLocalQuantity((quantity = quantity - 1));
    setSelectedItem(_index);
    await handleUpdateQuantity(cartItem.cart_id, quantity);
    setSelectedItem(null);
  };

  return (
    <>
      {cartItem && (
        <div className="flex-item col-md-12 d-flex flex-column flex-md-row align-items-center w-100">
          {/*Product Details*/}
          <div className="col-12 col-md-5 d-flex align-items-start gap-3">
            <img
              src={cartItem.main_image}
              className="img-fluid"
              width="100px"
              height="100px"
              style={{
                borderRadius: "5px",
                maxHeight: "100px",
                minHeight: "100px",
                minWidth: "100px",
                objectFit: "cover",
              }}
              title=""
              alt=""
            />
            <div className="cart-item-dtl card_item_width_col">
              <div>
                <div className="d-flex align-items-start justify-content-between">
                  <Link
                    to={`/shop/${cartItem.pro_slug}-${cartItem.product_id}`}
                  >
                    {/*<h4 className="">{fixChar(cartItem.pro_name, 50)}</h4>*/}
                    <div className="checkoutTitle text-one-lined">
                      {cartItem.pro_name.length > 35
                        ? cartItem.pro_name.slice(0, 35) + "..."
                        : cartItem.pro_name}
                    </div>
                  </Link>
                </div>

                {cartItem.attr?.map((attrName, index) => {
                  return (
                    <p key={index}>
                      {attrName.attr_name}:{attrName.attr_value}
                    </p>
                  );
                })}
              </div>

              {Object.keys(cartItem.pro_combinations).map((comb, index) => (
                <React.Fragment key={index}>
                  {index === 0 ? (
                    <div className="d-flex align-items-center mt-2">
                      <label className="customQntFontColor">
                        {comb === "color_code" ? "Color :" : "Color :"}
                      </label>
                      <div className="d-flex align-items-center ms-4">
                        {comb === "color_combi" ? (
                          <>
                            <span
                              style={{
                                backgroundColor:
                                  cartItem["pro_combinations"]["color_combi"][
                                    "color_code"
                                  ],
                                width: "25px",
                                height: "25px",
                                borderRadius: "25px",
                                marginRight: "10px",
                              }}
                            ></span>
                            <span className="customQntFontColor">
                              {
                                cartItem["pro_combinations"]["color_combi"][
                                  "color"
                                ]
                              }
                            </span>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      {cartItem["pro_combinations"]["other_combi"].map((os) => (
                        <div className="d-flex align-items-center w-100 mt-2">
                          <label
                            className="customQntFontColor"
                            style={{ marginRight: "10px" }}
                          >
                            {os.name} :
                          </label>
                          <label className="customQntFontColor">
                            {os.value}
                          </label>
                        </div>
                      ))}
                    </>
                  )}
                </React.Fragment>
              ))}
              <div className="col-md-2 d-flex justify-content-between mt-2 d-md-none">
                <div className="item-price">
                  ${cartItem.unit_price} <br />
                </div>
              </div>
            </div>
          </div>

          {/*Price*/}
          <div className="col-md-2 d-none d-md-block">
            <div className="item-price">
              ${cartItem.unit_price} <br />
            </div>
          </div>

          {/*Quantity*/}
          <div className="col-12 md-row col-md-5 d-flex justify-content-between align-items-center mt-2 mt-md-0">
            <div className="col-md-7">
              <div className="qty-style qty-styleCart">
                <button
                  className="qty-styleCartText"
                  onClick={() => handleQuantityDec(index)}
                >
                  <i className="fa fa-minus"></i>
                </button>

                <div>{localQuantity}</div>

                <button
                  className="qty-styleCartText"
                  onClick={() => handleQuantityInc(index)}
                >
                  <i className="fa fa-plus"></i>
                </button>
              </div>

              {isLoading && selectedItem === index && (
                <div className="d-flex align-items-center gap-2 mt-2">
                  <p>Updating...!</p>
                  <Circles
                    type="Circles"
                    color="#f6a92c"
                    height={15}
                    width={15}
                  />
                </div>
              )}
            </div>

            {/*Total*/}
            <div
              className="col-md-5 d-flex justify-content-between gap-5 gap-md-3"
              style={{ maxWidth: "200px" }}
            >
              <div className="priceItemTotal">${cartItem.total_amount}</div>
              <button
                className="removebtnBin"
                onClick={() => {
                  handleClickOnClose(cartItem.cart_id);
                }}
              >
                <img src={images["Bin.png"]} alt="" />
              </button>
            </div>
          </div>
        </div>
      )}
      <hr style={{ borderColor: "#bdbdbd", margin: "25px 0" }} />
    </>
  );
};

export default CartItem;
