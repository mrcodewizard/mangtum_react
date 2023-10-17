import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { mgtApi } from "./axios";
import { userFetchCart } from "./newCart";

// import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

// import { loaderStop } from "./product";

const localProducts = JSON.parse(localStorage.getItem("cart"));
const localTotalQty = localStorage.getItem("totalQty");
const localSubTotal = localStorage.getItem("subTotal");
const isLogin = localStorage.getItem("user_info") ? true : false;

const storeProduct = localProducts && !isLogin ? localProducts : [];
const storeTotalQty = localProducts && !isLogin ? parseInt(localTotalQty) : 0;
const storeSubTotal = localSubTotal && !isLogin ? parseFloat(localSubTotal) : 0;

const initialCartState = {
  cart_data: "",
  newcartData: "",
  reCupn: "",
  couponStatus: false,
  coupon: "",
  allShippingData: "",
  products: storeProduct,
  totalQty: storeTotalQty,
  subTotal: storeSubTotal,
  // status: null,
  // msg: "",
  loader: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    addToCartPro(state, action) {
      const newProduct = action.payload;
      if (state.products.length === 0) {
        localStorage.setItem("subTotal", 0);
      }
      const existProduct = state.products.find(
        (product) => product.cart_id === newProduct.cartId
      );
      if (!existProduct) {
        state.products.push({
          cart_id: newProduct.cartId,
          price: parseFloat(newProduct.sellPrice),
          inventory_id: newProduct.invId,
          product: {
            img_url: newProduct.img_url,
            pro_name: newProduct.proName,
            pro_slug: newProduct.pro_slug,
            sell_price: newProduct.sellPrice,
            short_desc: newProduct.short_desc,
            product_url: {
              web: newProduct.web,
            },
            selectedVarients: newProduct.selectedVarients,
          },
          quantity: newProduct.qty,
        });
        // state.products.push({ slug: newProduct.slug, qty: newProduct.qty, name: newProduct.proName, invId: newProduct.invId, price: newProduct.sellPrice, cartId: newProduct.cartId });
      } else {
        existProduct.quantity += newProduct.qty;
        existProduct.price += parseFloat(newProduct.sellPrice);
      }
      state.totalQty += newProduct.qty;
      state.subTotal +=
        parseFloat(newProduct.sellPrice) * parseFloat(newProduct.qty);
      !isLogin && localStorage.setItem("cart", JSON.stringify(state.products));
      !isLogin && localStorage.setItem("totalQty", state.totalQty);
      !isLogin && localStorage.setItem("subTotal", state.subTotal);
      toast.success("Product added to cart", {
        autoClose: 1500,
      });
    },
    fetchUserCart(state, action) {
      state.products = action.payload.carts;
      state.subTotal = action.payload.subTotal;
      state.totalQty = action.payload.totalItems;
      state.allShippingData = action.payload;
    },
    fetchUserCartNew(state, action) {
      state.products = action.payload.carts;
      state.subTotal = action.payload.subTotal;
      state.totalQty = action.payload.totalItems;
      state.allShippingData = action.payload;
    },
    cartCoupon(state, action) {
      state.coupon = action.payload;
    },
    couponStatus(state, action) {
      state.couponStatus = action.payload;
    },
    removeAllCartPro(state, action) {
      state.products = [];
      !isLogin && localStorage.setItem("cart", JSON.stringify([]));
      !isLogin && localStorage.setItem("totalQty", "0");
      !isLogin && localStorage.setItem("subTotal", "0");
    },
    removeCartPro(state, action) {
      const cartId = action.payload;
      const existProduct = state.products.find(
        (product) => product.cart_id === cartId
      );
      if (existProduct) {
        state.totalQty -= existProduct.quantity;
        state.subTotal -= existProduct.price;
        state.products = state.products.filter(
          (product) => product.cart_id !== cartId
        );
        !isLogin &&
          localStorage.setItem("cart", JSON.stringify(state.products));
        !isLogin && localStorage.setItem("totalQty", state.totalQty);
        !isLogin && localStorage.setItem("subTotal", state.subTotal);
      }
    },
    increaseProduct(state, action) {
      const cartId = action.payload;
      const existProduct = state.products.find(
        (product) => product.cart_id === cartId
      );
      if (existProduct) {
        existProduct.quantity++;
        existProduct.price =
          parseFloat(existProduct.product.sell_price) +
          parseFloat(existProduct.price);
        state.totalQty++;
        state.subTotal =
          parseFloat(existProduct.product.sell_price) +
          parseFloat(state.subTotal);
      }
      !isLogin && localStorage.setItem("cart", JSON.stringify(state.products));
      !isLogin && localStorage.setItem("totalQty", state.totalQty);
      !isLogin && localStorage.setItem("subTotal", state.subTotal);
    },
    decreaseProduct(state, action) {
      const cartId = action.payload;
      const existProduct = state.products.find(
        (product) => product.cart_id === cartId
      );
      if (existProduct) {
        existProduct.quantity--;
        existProduct.price -= parseFloat(existProduct.product.sell_price);
        state.totalQty--;
        state.subTotal -= parseFloat(existProduct.product.sell_price);
      }
      !isLogin && localStorage.setItem("cart", JSON.stringify(state.products));
      !isLogin && localStorage.setItem("totalQty", state.totalQty);
      !isLogin && localStorage.setItem("subTotal", state.subTotal);
    },
    // cartError(state, action) {
    //   state.msg = action.payload;
    //   state.status = "error";
    //   toast.error(action.payload, {
    //     position: 'bottom-center',
    //     autoClose: 1500,
    //     theme:"dark",
    //   });
    // toast.error(action.payload, {
    //   transition:"slide",
    //   position: "bottom-center",
    //   autoClose: 1500,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: false,
    //   draggable: true,
    //   progress: false,
    //   theme: "dark",
    //   });
    // state.cart_error = action.pay
    // },
    userFetchShippingCart(state, action) {
      state.msg = action.payload;
      state.status = "success";
    },
    removeCoupon(state, action) {
      state.reCupn = action.payload;
    },
    updateCartQty(state, action) {
      state.totalQty = action.payload;
    },
    clearCart(state, action) {
      state.newcartData = action.payload;
    },
    user_cart_data(state, action) {
      state.cart_data = action.payload;
    },
    loaderStart(state, action) {
      state.loader = true;
    },
    loaderStop(state, action) {
      state.loader = false;
    },
  },
});

export const cartActions = cartSlice.actions;

// export const userAddToCart = (payload) => {
//   const productData = new FormData();
//   let quantity = ( payload.qty)? ( payload.qty) : 1;
//   productData.append("pro_slug", payload.pro_slug);
//   productData.append("inventory_id", payload.inven_id);
//   // productData.append("quantity", payload.qty);
//   productData.append("quantity", quantity);
//   productData.append("product_id",payload.product_id)
//   productData.append("user_id",payload.user_id)
//   productData.append("type","increment")
//   productData.append("sku", payload.sku)
//   productData.append("color", payload.color)
//
//   console.log("payload ", payload.selectedAttributes)
//   payload.selectedAttributes?.forEach((item, index) => {
//     productData.append(`attribute_id_${index + 1}`, item.value)
//   });
//
//
//   return async (dispatch) => {
//     // dispatch()
//     dispatch(cartActions.loaderStart())
//     try {
//         await mgtApi.post("user-create-cart-web", productData).then((response) => {
//         if (response.data.status === "fail") {
//           toast.error(response.data.msg);
//           dispatch(cartActions.cartError(response.data.msg));
//         } else if (response.data.status === "success" || response.data.status === "ok") {
//
//           toast.success(response.data.msg);
//           dispatch(cartActions.userFetchShippingCart(response.data.msg));
//           dispatch(userFetchCart());
//           dispatch(getHeaderData({user_id:payload.user_id}));
//         }
//         dispatch(cartActions.loaderStop())
//       });
//     } catch (e) {
//       dispatch(cartActions.cartError("Error Occured"));
//       dispatch(cartActions.loaderStop())
//       // ERROR HANDLE HERE REMAINING
//     }
//   };
// };

// export const userFetchCart = (payload) => {
//   return async (dispatch) => {
//     try {
//       await mgtApi.get("user/cart").then((response) => {
//         dispatch(cartActions.user_cart_data(response.data));
//         if (response.data.status === "fail") {
//           dispatch(cartActions.cartError(response.data.msg));
//         } else if (response.data.status === "success") {
//           if (response.data.msg === "Cart is empty") {
//             dispatch(
//               cartActions.fetchUserCart({
//                 carts: [],
//                 subTotal: 0,
//                 totalItems: 0,
//               })
//             );
//           } else {
//             dispatch(cartActions.fetchUserCart(response.data.data));
//           }
//         }
//       });
//     } catch (e) {
//       // ERROR HANDLE HERE REMAINING
//     }
//   };
// };

export const userFetchShippingCart = (payload) => {
  return async (dispatch) => {
    try {
      await mgtApi.get("user/getcart").then((response) => {
        if (response.data.status === "fail") {
        } else if (response.data.status === "success") {
          if (response.data.msg === "Cart  is empty") {
            dispatch(
              cartActions.fetchUserCartNew({
                carts: [],
                subTotal: 0,
                totalItems: 0,
              })
            );
          } else {
            dispatch(cartActions.fetchUserCartNew(response.data.data));
          }
        }
      });
    } catch (e) {
      // ERROR HANDLE HERE REMAINING
    }
  };
};

export const userDeleteCart = (payload) => {
  const productData = new FormData();
  productData.append("cart_id", payload);
  return async (dispatch) => {
    try {
      await mgtApi.post("user/cart/delete", productData).then((response) => {
        if (response.data.status === "fail") {
          dispatch(cartActions.cartError(response.data.msg));
        } else if (response.data.status === "success") {
          dispatch(cartActions.userFetchShippingCart(response.data.msg));
          dispatch(userFetchCart());
        }
      });
    } catch (e) {
      // ERROR HANDLE HERE REMAINING
    }
  };
};

export const userUpdateCart = (payload) => {
  const productData = new FormData();
  productData.append("cart_id", payload.cart_id);
  productData.append("action", payload.action);

  return async (dispatch) => {
    try {
      await mgtApi.post("user/cart/update", productData).then((response) => {
        if (response.data.status === "fail") {
          toast.error(response.data.msg);
          dispatch(cartActions.cartError(response.data.msg));
        } else if (response.data.status === "success") {
          toast.success("Cart updated successfully", {
            autoClose: 1500,
          });
          dispatch(cartActions.userFetchShippingCart(response.data.msg));
          dispatch(userFetchCart());
        }
      });
    } catch (e) {
      // ERROR HANDLE HERE REMAINING
    }
  };
};

export const couponApply = (payload) => {
  const couponData = new FormData();
  couponData.append("coupon_code", payload);
  return async (dispatch) => {
    try {
      await mgtApi
        .post("user/cart/apply-coupon", couponData)
        .then((response) => {
          if (response.data.status === "success") {
            dispatch(cartActions.cartCoupon(response.data.data));
            dispatch(userFetchShippingCart());
            dispatch(cartActions.couponStatus(true));
            toast.success("Coupon added successfully");
          }
          if (response.data.status === "fail") {
            toast.error(response.data.msg);
          }
        });
    } catch (e) {}
  };
};

export const removeCoupon = (payload) => {
  return async (dispatch) => {
    try {
      await mgtApi.get("user/cart/remove-coupon").then((response) => {
        if (response.data.status === "success") {
          dispatch(cartActions.removeCoupon(response.data.data));
          dispatch(userFetchCart());
          dispatch(userFetchShippingCart());
          dispatch(cartActions.couponStatus(false));
          toast.success("Coupon removed successfully");
        }
      });
    } catch (e) {}
  };
};

export const fetchCartQty = () => {
  return async (dispatch) => {
    try {
      await mgtApi.get("total-items-cart").then((response) => {
        if (response.data.status === "success") {
          dispatch(cartActions.updateCartQty(response.data.data));
        }
      });
    } catch (e) {}
  };
};

export const cartClear = () => {
  return async (dispatch) => {
    try {
      await mgtApi.get("all-cart-remove").then((response) => {
        if (response.data.status === "success") {
          dispatch(cartActions.clearCart(response.data));
          toast.success(response?.data?.msg);
        } else toast.error(response?.data?.msg);
      });
    } catch (e) {}
  };
};

// export const loaderStart = () => {
//   return async(dispatch) => {
//       dispatch(loaderStart())
//   }
// }

// export const loaderStop = () => {
//   return async(dispatch) => {
//     dispatch(loaderStop())
//   }
// }

// export const C

export default cartSlice.reducer;
