import { createSlice } from "@reduxjs/toolkit";
import { mgtApi } from "./axios";
import { toast } from "react-toastify";
import { getHeaderData } from "./home";

//show the loader
let userDetails = localStorage.getItem("userDetails");
let data = JSON.parse(userDetails);

const initialCheckoutState = {
    loaderStatus: false,
    status: "init",
    cart: {},
    cartData: [],
    toastMessage: { text: "", status: "" },
    loggedInUser: data?.ID,
    updateCartItemQuantityLoading: false,
    stripeCredentials: {},
    paypalCredentials: {},

    checkoutAddressData: [],
    cartStatusUpdate: {},
    expStatus: false,
    checkDex: 0,
    expGiftStatus: false,
    checkDexGift: 0,
    addressList: [],
    addStatus: false,
    cartUpdateFail: {},
    cartFailStatus: false,
};

const newCartSlice = createSlice({
    name: "newCart",
    initialState: initialCheckoutState,
    reducers: {
        setCart(state, action) {
            state.cart = action.payload
        },
        setCartData(state, action) {
            state.cartData = action.payload
        },
        setErrorMsgInToast(state, action) {
            state.toastMessage.text = action.payload;
            state.toastMessage.status = "error";
            toast.error(action.payload, {
                position: "bottom-center",
                autoClose: 1500,
                theme: "dark",
            });
        },
        setSuccessMsgInToast(state, action) {
            state.toastMessage.text = action.payload;
            state.toastMessage.status = "success";
            toast.success(action.payload, {
                position: "bottom-center",
                autoClose: 1500,
                theme: "dark",
            });
        },
        setUpdateCartItemQuantityLoading(state, action) {
            state.updateCartItemQuantityLoading = action.payload;
        },
        setStripeCredentials(state, action) {
            state.stripeCredentials = action.payload
        },
        setPaypalCredentials(state, action) {
            state.paypalCredentials = action.payload
        },

        defaultAddressLists(state, action) {
            state.checkoutAddressData = action.payload;
        },
        updateCartSuccess(state, action) {
            state.cartStatusUpdate = action.payload;
        },
        updateCartFailure(state, action) {
            state.cartStatusUpdate = action.payload;
            state.cartFailStatus = false;
            toast.error(state.cartStatusUpdate.message);
        },

        checkExpressCheck(state, action) {
            state.expStatus = true;
            state.checkDex = action.payload.is_checked;
        },
        checkExpressUncheck(state, action) {
            state.expStatus = false;
            state.checkDex = action.payload.is_checked;
        },
        checkDexGiftCheck(state, action) {
            state.expGiftStatus = true;
            state.checkDexGift = action.payload.is_checked;
        },
        checkDexGiftUncheck(state, action) {
            state.expGiftStatus = false;
            state.checkDexGift = action.payload.is_checked;
        },
        userAddressDetailsSuccess(state, action) {
            state.addressList = action.payload;
        },
        addressUpdateModalOpen(state, action) {
            state.addStatus = action.payload;
        },
        addressUpdate(state, action) {
            state.addStatus = false;
        },
        updateLoaderStatus(state, action) {
            state.loaderStatus = action.payload;
        },
        updateQty(state, { payload }) {
            const { index, qty } = payload;
            state.cartItemsData.data[0].cart_items[index].quantity = qty;
            state.cartItemsData.data[0].cart_items[index].total_amount =
                Number(state.cartItemsData.data[0].cart_items[index].total_amount) *
                qty;
        },
    },
    // extraReducers: {
    //     [getCartData.pending]: (state) => {
    //         state.status = "pending";
    //     },
    //     [getCartData.fulfilled]: (state, { payload }) => {
    //         state.status = "success";
    //         state.cartItemsData = payload;
    //     },
    //     [getCartData.failed]: (state) => {
    //         state.status = "failed";
    //     },
    // },
});

// export const getCartData = createAsyncThunk(
//     "user/getCartData",
//     async (thunkAPI) => {
//         try {
//             let userDetails = JSON.parse(localStorage.getItem("userDetails"));
//             let user_id = userDetails?.ID;
//             const { data } = await mgtApi.post("/usercheckout", { user_id });
//             console.log('data: ', data)
//             return data;
//         } catch (error) {
//             console.log(error);
//         }
//     }
// );

export const userDefaultAddress = () => {
    let userDetails = localStorage.getItem("userDetails");
    let data = JSON.parse(userDetails);
    let user_id = data?.ID;
    return async (dispatch) => {
        dispatch(newCartActions.updateLoaderStatus(true));

        try {
            const response = await mgtApi.post("/user-default-address", {
                user_id: user_id,
            });
            if (response.data.status === "success") {
                await dispatch(newCartActions.defaultAddressLists(response.data));
                dispatch(newCartActions.updateLoaderStatus(false));
            }
        } catch (e) {
            // console.log("Error while fetching default Address: ", e);
            dispatch(newCartActions.updateLoaderStatus(false));
        }
    };
};
export const updateDefaultAddress = (addressId) => {
    return async (dispatch) => {
        try {
            await mgtApi
                .post("/update-address-type", {
                    address_for: "shipping",
                    id: addressId,
                })
                .then((response) => {
                    if (response.data.status === "success") {
                        dispatch(newCartActions.addressUpdate(response.data.status));
                    }
                });
        } catch (e) {
        }
    };
};
export const getMyCart = (payload) => {
    return async (dispatch) => {
        let user_id = payload.user_id;
        try {
            await mgtApi.post("/home", { user_id: user_id }).then((res) => {
                if (res.data.status === "1") {
                    // dispatch(homeActions.cartActions(res.data));
                }

                if (res.data.status === "error") {
                    // dispatch(homeActions.cartActions(res.data.msg));
                }
            });
        } catch (e) {
        }
    };
};
export const updateMyCart = (payload) => {
    let cart_id = payload.cart_id;
    let type = payload.type;
    return async (dispatch) => {
        try {
            await mgtApi
                .post("/user-update-cart", { cart_id: cart_id, type: type })
                .then((response) => {
                    if (response.data.status === "ok") {
                        dispatch(newCartActions.updateCartSuccess(response.data));
                    }
                    if (response.data.status === "nok") {
                        dispatch(newCartActions.updateCartFailure(response.data));
                    }
                });
        } catch (e) {
        }
    };
};
export const addressUpdateModalOpen = () => {
    return async (dispatch) => {
        try {
            dispatch(newCartActions.addressUpdateModalOpen(true));
        } catch (e) {
        }
    };
};
export const getUserAddress = (input) => {
    return async (dispatch) => {
        try {
            await mgtApi.get("/get-address", input).then((response) => {
                if (response.data.status === "success") {
                    dispatch(
                        newCartActions.userAddressDetailsSuccess(response.data.data.address)
                    );
                }
            });
        } catch (e) {
        }
    };
};

export const getStripeCredentials = (shouldShowLoading = false) => {
    return async (dispatch) => {
        if (shouldShowLoading) dispatch(newCartActions.updateLoaderStatus(true));
        try {
            // const response = await mgtApi.get("/stripe-credential");
            const response = await mgtApi.get("/bouncy-bubble");

            if (response?.data.status === "success" || response?.data.status === "ok") {
                dispatch(newCartActions.setStripeCredentials(response?.data?.data));
            }

            dispatch(newCartActions.updateLoaderStatus(false));

        } catch (error) {
            // console.log("Error while getting stripeCredentials: ", error);
            dispatch(newCartActions.updateLoaderStatus(false));
        }
    };
};
export const getPayPalCredentials = (shouldShowLoading = false) => {
    return async (dispatch) => {
        if (shouldShowLoading) dispatch(newCartActions.updateLoaderStatus(true));
        try {
            const response = await mgtApi.get("/wobble-bubble");

            if (response?.data.status === "success" || response?.data.status === "ok") {
                dispatch(newCartActions.setPaypalCredentials(response?.data?.data));
            }

            dispatch(newCartActions.updateLoaderStatus(false));

        } catch (error) {
            // console.log("Error while getting payPalCredentials: ", error);
            dispatch(newCartActions.updateLoaderStatus(false));
        }
    };
};
export const userFetchCart = (payload) => {
    return async (dispatch) => {
        dispatch(newCartActions.updateLoaderStatus(true));
        try {
            const response = await mgtApi.get("user/cart");
            // dispatch(cartActions.user_cart_data(response.data));
            if (response.data.status === "fail") {
                dispatch(newCartActions.setErrorMsgInToast(response.data.msg));
            }
            // else if (response.data.status === "success") {
            //     if (response.data.msg === "Cart is empty") {
            //         // dispatch(
            //         //     cartActions.fetchUserCart({
            //         //         carts: [],
            //         //         subTotal: 0,
            //         //         totalItems: 0,
            //         //     })
            //         // );
            //     } else {
            //         // dispatch(cartActions.fetchUserCart(response.data.data));
            //     }
            // }
            dispatch(newCartActions.updateLoaderStatus(false));
        } catch (e) {
            dispatch(
                newCartActions.setErrorMsgInToast("Error! Something Went Wrong.")
            );
            dispatch(newCartActions.updateLoaderStatus(false));
        }
    };
};
export const checkGift = (shipping_profile, is_checked) => {
    let userDetails = JSON.parse(localStorage.getItem("userDetails"));
    return async (dispatch) => {
        try {
            await mgtApi
                .post("/check-gift", {
                    shipping_profile: shipping_profile,
                    user_id: userDetails.ID,
                    is_checked: is_checked ? 1 : 0,
                })
                .then((response) => {
                    dispatch(getCartData());
                    if (response.data.status === "ok") {
                        if (is_checked) {
                            dispatch(newCartActions.checkDexGiftCheck(response.data.status, is_checked));
                            toast.success("Gift charge applied");
                        }
                        if (!is_checked) {
                            dispatch(newCartActions.checkDexGiftUncheck(response.data.status, is_checked));
                            toast.success("Gift charge removed");
                        }
                    }
                });
        } catch (e) {
            // console.log('Error while updating gift: ', e);
        }
    };
};
export const checkExpress = (shipping_profile, is_checked) => {
    let userDetails = JSON.parse(localStorage.getItem("userDetails"));
    return async (dispatch) => {
        try {
            await mgtApi
                .post("/check-express", {
                    shipping_profile: shipping_profile,
                    user_id: userDetails.ID,
                    is_checked: is_checked ? 1 : 0,
                })
                .then((response) => {
                    dispatch(getCartData());
                    if (response.data.status === "ok") {
                        if (is_checked) {
                            dispatch(newCartActions.checkExpressCheck(response.data.status, is_checked));
                            toast.success("Expedited fee added");
                        }
                        if (!is_checked) {
                            dispatch(newCartActions.checkExpressUncheck(response.data.status, is_checked));
                            toast.success("Expedited fee removed");
                        }
                    }
                });
        } catch (e) {
            // console.log('Error while updating express: ', e);
        }
    };
};
export const getCartData = (shouldShowLoading = false) => {
    return async (dispatch) => {
        if (shouldShowLoading) dispatch(newCartActions.updateLoaderStatus(true));
        try {
            let userDetails = JSON.parse(localStorage.getItem("userDetails"));
            const { data } = await mgtApi.post("/usercheckout", { user_id: userDetails.ID });
            dispatch(newCartActions.setCart(data));
            if (data?.data && data?.data?.length) {
                dispatch(newCartActions.setCartData([...data.data]));
            }
            dispatch(newCartActions.updateLoaderStatus(false));
        } catch (error) {
            // console.log("Error while getting cartData: ", error);
            dispatch(newCartActions.updateLoaderStatus(false));
        }
    };
};

export const updateLoader = (payload) => {
    return async (dispatch) => {
        dispatch(newCartActions.updateLoaderStatus(payload));
    };
}

export const placeOrderAfterStripePayment = (payload) => {
    return async (dispatch) => {
        dispatch(newCartActions.updateLoaderStatus(true));

        // console.log('placeOrderPayload: ', payload)
        // console.log('playOrder: ', JSON.stringify(payload.response_data))

        let data = new FormData();
        data.append("shipping_address", payload.shipping_address);
        data.append("stripe_token", payload.token);

        let isSuccess = false;
        try {
            const response = await mgtApi.post("stripe-transaction", data);
            dispatch(getCartData());
            isSuccess = response.status === 200 || response?.data?.status === 'success';
            dispatch(newCartActions.updateLoaderStatus(false));
            return isSuccess;
        } catch (e) {
            // console.log('Error while returning response: ', e)
            dispatch(newCartActions.updateLoaderStatus(false));
        }
    };
}
export const placeOrderAfterPayPalPayment = (payload) => {
    return async (dispatch) => {
        dispatch(newCartActions.updateLoaderStatus(true));
        // console.log('payment_response: ', JSON.stringify(payload.response_data));
        let data = new FormData();
        data.append("shipping_address", payload.shipping_address);
        data.append('payment_response', JSON.stringify(payload.response_data));
        let isSuccess = false;
        try {
            const response = await mgtApi.post("paypal-transaction", data);
            dispatch(getCartData());
            isSuccess = response.status === 200 || response?.data?.status === 'success';
            dispatch(newCartActions.updateLoaderStatus(false));
            return isSuccess;
        } catch (e) {
            // console.log('Error while returning response: ', e)
            dispatch(newCartActions.updateLoaderStatus(false));
        }
    };
}

export const AddToCart = (payload) => {
    // console.log("payload: ", payload);

    const productData = new FormData();
    productData.append("pro_slug", payload.pro_slug);
    productData.append("quantity", payload.quantity ? payload.quantity : 1);
    productData.append("product_id", payload.product_id);
    productData.append("user_id", payload.user_id);

    productData.append("type", "increment");
    if (payload.sku) productData.append("sku", payload.sku);
    if (payload.color) productData.append("color", payload.color);
    if (payload?.selectedAttributes && payload?.selectedAttributes?.length) {
        payload?.selectedAttributes?.forEach((item, index) => {
            productData.append(`attribute_id_${item.id}`, item.value);
        });
    }

    return async (dispatch) => {
        dispatch(newCartActions.updateLoaderStatus(true));
        try {
            const response = await mgtApi.post("user-create-cart-web", productData);
            if (response.data.status === "fail") {
                // dispatch(newCartActions.setErrorMsgInToast(response?.data.msg));
            } else if (
                response?.data.status === "success" ||
                response?.data.status === "ok"
            ) {
                // dispatch(newCartActions.setSuccessMsgInToast(response?.data.msg));
                dispatch(userFetchCart());
                dispatch(getHeaderData({ user_id: payload.user_id }));
            }
            dispatch(newCartActions.updateLoaderStatus(false));
        } catch (e) {
            dispatch(
                newCartActions.setErrorMsgInToast("Error! Something Went Wrong.")
            );
            dispatch(newCartActions.updateLoaderStatus(false));
            // ERROR HANDLE HERE REMAINING
        }
    };
};
export const updateCartQuantity = (payload) => {
    return async (dispatch) => {
        dispatch(newCartActions.setUpdateCartItemQuantityLoading(true));
        try {
            const productData = new FormData();

            productData.append("pro_slug", payload.pro_slug);
            productData.append("product_id", payload.product_id);
            productData.append("quantity", payload.quantity);
            productData.append("user_id", payload.user_id);
            if (payload.sku) productData.append("sku", payload.sku);

            const response = await mgtApi.post("user-create-cart-web", productData);
            dispatch(getCartData());
            dispatch(getHeaderData({ user_id: payload.user_id }))
            if (response.data.status === "ok") {
                dispatch(newCartActions.setUpdateCartItemQuantityLoading(false));
                //     dispatch(newCartActions.updateCartSuccess(response.data.message));
            } else {
                //     dispatch(newCartActions.updateCartFailure(response.data));
            }
        } catch (e) {
            dispatch(newCartActions.setUpdateCartItemQuantityLoading(false));
            // console.log("Error while updating cartItem: ", e);
        }
    };
};
export const removeCart = (cart_id) => {
    return async (dispatch, getState) => {
        try {
            const currentState = getState();
            const response = await mgtApi.post("user-remove-cart", {
                cart_id: cart_id,
                user_id: currentState.newCart.loggedInUser,
            });
            if (response.data.status === "ok" || response.data.status === "success") {
                const cartItemsData = [].concat(...currentState.newCart?.cartData?.map(obj => obj.cart_items));
                if (cartItemsData && cartItemsData.length === 1) {
                    dispatch(newCartActions.setCart({}));
                    dispatch(newCartActions.setCartData([]));
                }

            }
        } catch (e) {
            // console.log("Error while deleting item in cart: ", e);
        }
    };
};

export const newCartActions = newCartSlice.actions;
export default newCartSlice.reducer;
