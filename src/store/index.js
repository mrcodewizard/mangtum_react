import { configureStore } from "@reduxjs/toolkit";
import homeReducer from './home';
import authReducer from './auth';
import productReducer from './product';
import newCartReducer from "../../src/store/newCart";

// import pages from "./pages";
import cart from "./cart";
import checkOutReducer from "./checkout";

const store = configureStore({
    reducer: {
        home: homeReducer,
        auth: authReducer,
        prodLi:productReducer,
        // pages: pages,
        cart: cart,

        newCart: newCartReducer,
        checkout:checkOutReducer,
    }
})



export default store;