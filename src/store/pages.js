import { createSlice } from "@reduxjs/toolkit";
import { mgtApi } from "./axios";
import { toast } from "react-toastify";
import { userFetchShippingCart } from './cart';

const initialPageState = { checkoutData: [], stripeKey: [], paypalKey: [], orderCancel: '', orderRefund: '' }

const pagesSlice = createSlice({
    name: 'pages',
    initialState: initialPageState,
    reducers: {
        checkoutData(state, action) {
            state.checkoutData = action.payload;
        },
        stripeData(state, action) {
            state.stripeKey = action.payload;
        },
        paypalData(state, action) {
            state.paypalKey = action.payload;
        },
        orderCancelData(state, action) {
            state.orderCancel = action.payload;
        },
        orderRefundData(state, action) {
            state.orderRefund = action.payload;
        }
    }
})


export const pagesActions = pagesSlice.actions;
export const checkoutData = (payload) => {
    const Check = new FormData();
    Check.append('shipping_address', payload)

    return async (dispatch) => {
        try {
            await mgtApi.post("user/checkout", Check)
                .then((response) => {
                    if (response.data.status === 'success') {
                        dispatch(pagesActions.checkoutData(response.data.data));
                        dispatch(userFetchShippingCart());
                    }
                    else {
                        dispatch(pagesActions.checkoutData(response.data));
                    }
                })
        }

        catch (e) {
        }
    }
}
// export const stripeData = (payload) => {
//     return async (dispatch) => {
//         try {
//             await mgtApi.get("stripe-credential")
//                 .then((response) => {
//                     if (response.data.status === 'success') {
//                         dispatch(pagesActions.stripeData(response.data.data));
//                     }
//                 })
//         }

//         catch (e) {
//         }
//     }
// }

export const paypalData = (payload) => {
    return async (dispatch) => {
        try {
            await mgtApi.get("paypal-credential")
                .then((response) => {
                    if (response.data.status === 'success') {
                        dispatch(pagesActions.paypalData(response.data.data));
                    }
                })
        }

        catch (e) {
        }
    }
}


export const expresShip = (payload) => {
    const Check = new FormData();
    Check.append('cart_id', payload?.id)
    Check.append('is_express', payload?.val)


    return async (dispatch) => {
        try {
            await mgtApi.post("user/cart/express", Check)
                .then((response) => {
                })
        }

        catch (e) {
        }
    }
}

export const giftShipNew = (payload) => {

    const Check = new FormData();
    Check.append('cart_id', payload?.id)
    Check.append('is_gift', payload?.val)

    return async (dispatch) => {
        try {
            await mgtApi.post("user/cart/gift", Check)
                .then((response) => {
                })
        }

        catch (e) {
        }
    }
}

export const orderCancelApiMethod = (payload) => {
    return async (dispatch) => {
        try {
            await mgtApi.get(`order/cancel/${payload}`)
                .then((response) => {
                    if (response.data.status === 'success') {
                        dispatch(pagesActions.orderCancelData(response.data.data));
                        toast.success(response.data.msg);
                    }
                    else {
                        dispatch(pagesActions.orderCancelData(response.data.data));
                        toast.error(response.data.msg);
                    }
                })
        }

        catch (e) {
        }
    }
}


export const orderRefundApiMethod = (payload) => {
    const Check = new FormData();
    Check.append('quantity', payload?.quantity)
    Check.append('reason', payload?.reason)

    return async (dispatch) => {
        try {
            await mgtApi.post(`order/refund/${payload?.oerderId}`, Check)
                .then((response) => {
                    if (response.data.status === 'success') {
                        dispatch(pagesActions.orderRefundData(response.data.data));
                        toast.success(response.data.msg);
                    }
                    else {
                        dispatch(pagesActions.orderRefundData(response.data.data));
                        toast.error(response.data.msg);
                    }
                })
        }

        catch (e) {
        }
    }
}


export default pagesSlice.reducer;