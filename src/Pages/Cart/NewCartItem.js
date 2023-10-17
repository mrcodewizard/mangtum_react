import React from "react";
import { Link } from "react-router-dom";
import { images } from "../../utils/images";
import { useDispatch, useSelector } from "react-redux";
import { Circles } from "react-loader-spinner";
import { newCartActions } from "../../store/newCart";
import { toast } from "react-toastify";

const NewCartItem = ({ cartItem, index, handleClickOnCloseModalButton, handleUpdateQuantity, }) => {
    const dispatch = useDispatch();
    const [localQuantity, setLocalQuantity] = React.useState(cartItem.quantity);
    const [selectedItem, setSelectedItem] = React.useState(null);

    const isLoading = useSelector((state) => state.newCart.updateCartItemQuantityLoading)

    const increaseProductQuantity = (cartItemId) => {
        const cartData = JSON.parse(localStorage.getItem("cart-items")) || [];
        const cartItem = cartData.find((item) => item.id === cartItemId);

        if (cartItem) {
            cartItem.quantity += 1;

            if (cartItem.sell_price) {
                cartItem.totalPrice = cartItem.quantity * cartItem.sell_price;
            }

            localStorage.setItem("cart-items", JSON.stringify(cartData));
        }
        const newData = JSON.parse(localStorage.getItem("cart-items"))
        dispatch(newCartActions.setCartItems(newData));
    };

    const decreaseProductQuantity = (cartItemId) => {
        // Get the current cart data from localStorage
        const cartData = JSON.parse(localStorage.getItem("cart-items")) || [];
        const cartItem = cartData.find((item) => item.id === cartItemId);
        if (cartItem && cartItem.quantity > 1) {
            cartItem.quantity -= 1;

            if (cartItem.sell_price) {
                cartItem.totalPrice = cartItem.quantity * cartItem.sell_price;
            }
            localStorage.setItem("cart-items", JSON.stringify(cartData));
        }
        const newData = JSON.parse(localStorage.getItem("cart-items"))
        dispatch(newCartActions.setCartItems(newData));
    };


    const removeCartItemById = (cartItemId) => {
        const oldData = JSON.parse(localStorage.getItem("cart-items")) || [];
        const updatedData = oldData.filter((item) => item.id !== cartItemId);
        localStorage.setItem("cart-items", JSON.stringify(updatedData));
        const newData = JSON.parse(localStorage.getItem("cart-items"))
        dispatch(newCartActions.setCartItems(newData));
        toast.success("Add Cart Product Delete Successful")
    };

    return (
        <>
            {cartItem && (
                <div className="flex-item col-md-12 checkout">
                    {/*Product Details*/}
                    <div className="col-6 d-flex align-items-center">
                        <div className="item-img">
                            <img
                                src={cartItem.main_image}
                                className="img-fluid"
                                title=""
                                alt=""
                            />
                        </div>


                        <div className="cart-item-dtl card_item_width_col">
                            <div>
                                <div className="d-flex align-items-center justify-content-between">
                                    <Link to={`/shop/${cartItem?.category?.slug}/${cartItem?.subcat_slug}/${cartItem?.pro_slug}`}>
                                        {/*<h4 className="">{fixChar(cartItem.pro_name, 50)}</h4>*/}
                                        <div className="checkoutTitle">
                                            {cartItem?.pro_name?.length > 35
                                                ? cartItem?.pro_name.slice(0, 35) + "..."
                                                : cartItem?.pro_name}
                                        </div>
                                    </Link>
                                </div>

                                {cartItem.attr?.map((attrName, index) => {
                                    return (
                                        <p key={index}>
                                            {attrName?.attr_name}:{attrName?.attr_value}
                                        </p>
                                    );
                                })}
                            </div>
                            {/* 
                            {Object.keys(cartItem.pro_combinations).map((comb, index) => (
                                <React.Fragment key={index}>
                                    {index === 0 ? (
                                        <div className="d-flex align-items-center">
                                            <label className="customQntFontColor mt-1">
                                                {comb === "color_code" ? "Color :" : "Color :"}
                                            </label>
                                            <div className="d-flex align-items-center ms-4">
                                                {comb === "color_combi" ? (
                                                    <>
                                                        <span style={{
                                                            backgroundColor:
                                                                cartItem["pro_combinations"]["color_combi"][
                                                                "color_code"
                                                                ],
                                                            width: "25px",
                                                            height: "25px",
                                                            borderRadius: "25px",
                                                            marginRight: "10px",
                                                        }}></span>
                                                        <span className="customQntFontColor">
                                                            {cartItem["pro_combinations"]["color_combi"]["color"]}
                                                        </span>
                                                    </>
                                                ) : ''}
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {cartItem["pro_combinations"]["other_combi"]
                                                .map((os) =>
                                                    <div className="d-flex align-items-center">
                                                        <label className="customQntFontColor mt-1">
                                                            {os.name} :
                                                        </label>
                                                        <div className="ms-2 customQntFontColor">
                                                            {os.value}
                                                        </div>
                                                    </div>)}
                                        </>
                                    )}
                                </React.Fragment>
                            ))} */}
                        </div>
                    </div >

                    {/*Price*/}
                    <div div className="col-2" >
                        <div className="priceItemCart">
                            ${cartItem.sell_price} <br />
                        </div>
                    </div >

                    {/*Quantity*/}
                    <div div className="col-2" >
                        <div className="priceDiv mt-1 qty-style qty-styleCart">
                            <button className="qty-styleCartText" onClick={() => decreaseProductQuantity(cartItem?.id)}>
                                <i className="fa fa-minus"></i>
                            </button>

                            <div>{cartItem?.quantity}</div>

                            <button className="qty-styleCartText" onClick={() => increaseProductQuantity(cartItem?.id)}>
                                <i className="fa fa-plus"></i>
                            </button>
                        </div>

                        {
                            isLoading && selectedItem === index &&
                            <div className="d-flex align-items-center gap-2 mt-2">
                                <p>Updating...!</p>
                                <Circles
                                    type="Circles"
                                    color="#f6a92c"
                                    height={15}
                                    width={15}
                                />
                            </div>
                        }

                    </div >

                    {/*Total*/}
                    < div className="col-2 d-flex justify-content-between" >
                        <div className="priceItemTotal">${cartItem.totalPrice.toFixed(2)}</div>
                        <button className="removebtnBin" onClick={() => {
                            removeCartItemById(cartItem.id)
                        }}>
                            <img src={images["Bin.png"]} alt="" />
                        </button>
                    </div >
                </div >
            )}
        </>
    );
};

export default NewCartItem;
