import { createSlice } from "@reduxjs/toolkit";
import { mgtApi } from "../store/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

//show the loader
let userDetails = localStorage.getItem("userDetails");
let data = JSON.parse(userDetails);
let user_id = data?.ID;

export const userCheckout = createAsyncThunk(
  "user/userCheckout",
  async (thunkAPI) => {
    try {
      let userDetails = JSON.parse(localStorage.getItem("userDetails"));
      let user_id = userDetails?.ID;
      const { data } = await mgtApi.post("/usercheckout", { user_id });
      return data;
    } catch (error) {
      // console.log(error);
    }
  }
);

const intialCheckoutState = {
  status: "init",
  checkout_data: [],
  cartEmpty: false,
  checkout_address_data: [],
  cartStatus_update: {},
  cart_removestatus: false,
  exp_status: false,
  checkdex: 0,
  exp_gift_status: false,
  checkgift: 0,
  addressList: [],
  add_status: false,
  cartupdateFail: {},
  cartfailStatus: false,
  loaderStatus: false,
};

const checkoutSlice = createSlice({
  name: "checkoutp",
  initialState: intialCheckoutState,
  reducers: {
    checkoutList_cartEmpty(state, action) {
      state.cartEmpty = true;
    },
    default_addressLists(state, action) {
      state.checkout_address_data = action.payload;
    },
    updateCartSuccess(state, action) {
      state.cartStatus_update = action.payload;
    },
    updateCartFailure(state, action) {
      state.cartStatus_update = action.payload;
      state.cartfailStatus = false;
      toast.error(state.cartStatus_update.message)
    },
    updateCart_Failure(state, action) {
      state.cartupdateFail = action.payload;
      state.cartfailStatus = true;
    },
    removeSuccess(state, action) {
      state.cart_removestatus = true;
      state.cartEmpty = true;
    },
    checkexpress_check(state, action) {
      state.exp_status = true;
      state.checkdex = action.payload.is_checked;
    },
    checkexpress_uncheck(state, action) {
      state.exp_status = false;
      state.checkdex = action.payload.is_checked;
    },
    checkgift_check(state, action) {
      state.exp_gift_status = true;
      state.checkgift = action.payload.is_checked;
    },
    checkgift_uncheck(state, action) {
      state.exp_gift_status = false;
      state.checkgift = action.payload.is_checked;
    },
    userAddressDetailsSuccess(state, action) {
      state.addressList = action.payload;
    },
    addressUpdateModalOpen(state, action) {
      state.add_status = action.payload;
    },
    addressUpdate(state, action) {
      state.add_status = false;
    },
    updateLoaderStatus(state, action) {
      state.loaderStatus = action.payload;
    },
    updateQty(state, { payload }) {
      const { index, qty } = payload
      state.checkout_data.data[0].cart_items[index].quantity = qty
      state.checkout_data.data[0].cart_items[index].total_amount = Number(state.checkout_data.data[0].cart_items[index].total_amount) * qty
    }
  },
  extraReducers: {
    [userCheckout.pending]: (state) => {
      state.status = "pending";
    },
    [userCheckout.fulfilled]: (state, { payload }) => {
      state.status = "success";
      state.checkout_data = payload;
      state.cartEmpty = false;
    },
    [userCheckout.failed]: (state) => {
      state.status = "failed";
      state.cartEmpty = true;
    },
  },
});

export const checkoutActions = checkoutSlice.actions;

export const user_defaultAddress = () => {
  let userDetails = localStorage.getItem("userDetails");
  let data = JSON.parse(userDetails);
  let user_id = data?.ID;
  return async (dispatch) => {
    dispatch(checkoutActions.updateLoaderStatus(true));

    try {
      const response = await mgtApi.post("/user-default-address", { user_id: user_id });
      if (response.data.status === "success") {
        await dispatch(checkoutActions.default_addressLists(response.data));
        dispatch(checkoutActions.updateLoaderStatus(false));
      }
    } catch (e) {
      // console.log('Error while fetching default Address: ', e)
      dispatch(checkoutActions.updateLoaderStatus(false));

    }
  };
};
export const updateMycart = (payload) => {
  let cart_id = payload.cart_id;
  let type = payload.type;
  return async (dispatch) => {
    try {
      await mgtApi
        .post("/user-update-cart", { cart_id: cart_id, type: type })
        .then((response) => {
          if (response.data.status === "ok") {
            dispatch(checkoutActions.updateCartSuccess(response.data));
          }
          if (response.data.status === "nok") {
            dispatch(checkoutActions.updateCart_Failure(response.data));
          }
        });
    } catch (e) {
      return;
    }
  };
};
export const removeCart = (cart_id) => {
  return async (dispatch) => {
    try {
      await mgtApi
        .post("user-remove-cart", { cart_id: cart_id, user_id: user_id })
        .then((response) => {
          if (response.data.status === "ok") {
            dispatch(checkoutActions.removeSuccess(response.data.message));
          } else {
            dispatch(checkoutActions.updateCartFailure(response.data));
          }

          dispatch(userCheckout());
        });
    } catch (e) {
      return;
    }
  };
};
export const checkExpress = (shipping_profile, is_checked) => {
  let userDetails = localStorage.getItem("userDetails");
  let data = JSON.parse(userDetails);
  let user_id = data?.ID;
  return async (dispatch) => {
    try {
      await mgtApi.post('check-express', { shipping_profile: shipping_profile, user_id: user_id, is_checked: is_checked })
        .then((response) => {

          if (response.data.status === 'ok') {
            if (is_checked === 1) {
              dispatch(checkoutActions.checkexpress_check(response.data.status, is_checked));
            }
            if (is_checked === 0) {
              dispatch(checkoutActions.checkexpress_uncheck(response.data.status, is_checked));
            }
          }

        })
    }
    catch (e) {
      return
    }
  }
}
export const checkGift = (shipping_profile, is_checked) => {
  let userDetails = localStorage.getItem("userDetails");
  let data = JSON.parse(userDetails);
  let user_id = data?.ID;
  return async (dispatch) => {
    try {
      await mgtApi.post('check-gift', { shipping_profile: shipping_profile, user_id: user_id, is_checked: is_checked })
        .then((response) => {

          if (response.data.status === 'ok') {
            if (is_checked === 1) {
              dispatch(checkoutActions.checkgift_check(response.data.status, is_checked));
            }
            if (is_checked === 0) {
              dispatch(checkoutActions.checkgift_uncheck(response.data.status, is_checked));
            }
          }
          dispatch(userCheckout())

        })
    }
    catch (e) {
      return
    }
  }
}

export const getUserAddress = (input) => {
  return async (dispatch) => {
    try {
      await mgtApi.get("/get-address", input).then((response) => {
        if (response.data.status == "success") {
          dispatch(
            checkoutActions.userAddressDetailsSuccess(
              response.data.data.address
            )
          );
        }
      });
    } catch (e) {
      return;
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
          if (response.data.status == "success") {
            dispatch(checkoutActions.addressUpdate(response.data.status));
          }
        });
    } catch (e) {
      return;
    }
  };
};

export const addressUpdateModalOpen = () => {
  return async (dispatch) => {
    try {
      dispatch(checkoutActions.addressUpdateModalOpen(true));
    } catch (e) {
      return;
    }
  };
};

export const updateCartQuantity = (payload) => {
  return async (dispatch) => {
    try {
      const productData = new FormData();
      productData.append("product_id", payload.product_id);
      productData.append("quantity", payload.quantity);
      productData.append("inventory_id", payload.inventory_id);
      productData.append("user_id", payload.user_id);

      await mgtApi
        .post("user-create-cart-web", productData)
        .then((response) => {
          if (response.data.status === "ok") {
            dispatch(checkoutActions.updateCartSuccess(response.data.message));
          } else {
            dispatch(checkoutActions.updateCartFailure(response.data));
          }
          dispatch(userCheckout());
        });
    } catch (e) {
      return;
    }
  };
};

export const { updateQty } = checkoutSlice.actions;
export default checkoutSlice.reducer;
