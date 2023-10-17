import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./index.css";
import Home from "./Pages/Home/Home.js";
import Header from "./components/Header/Header.js";
import Footer from "./components/Footer/Footer.js";
import Productlist from "./Pages/Productlist";
import Productdetail from "./Pages/Productdetail";
import Contact from "./Pages/Contact";
import Personal from "./Pages/Personal";
import ShippingChange from "./Pages/ShippingChange";
import Category from "./Pages/Category";
import SellerStore from "./Pages/SellerStore";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import Termscondition from "./Pages/Termscondition";
import Pagenotfound from "./Pages/Pagenotfound";
import Usercartlist from "./Pages/Usercartlist";
import HelpTopics from "./Pages/HelpTopics";
import Test from "./Pages/Test";
import Faq from "./Pages/Faq";
import Login from "./user/Login";
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";
import Register from "./user/Register";
import Authentication from "./user/Authentication";
import ProductlistBySubcat from "./product/ProductlistBySubcat";
import SingleProduct from "./product/SingleProduct";
import ProductByCategory from "./product/ProductByCategory";
import Productsearch from "./product/Productsearch";
import TempDashboard from "./user/UserDashboard.js";
import UserDashboard from "./dashboard/UserDashboard.js";
import UserAccount from "./dashboard/Account.js";
import UserOrders from "./dashboard/Order.js";
import UserAddress from "./dashboard/Address.js";
import { Helmet } from "react-helmet";

import UserOrderDetails from "./product/UserOrderDetails";
import UserWishlist from "./user/UserWishlist";
import About from "./Pages/About/About.js";

// rehman
import Cart from "./Pages/Cart/Cart";
import CheckoutOldCode from "./Pages/Checkout/CheckoutOldCode";
import Checkout from "./Pages/Checkout/Checkout";
import ThankYou from "./Pages/Checkout/ThankYou";

import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "./store/auth.js";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

function App() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const dispatch = useDispatch();
  const auth = JSON.parse(localStorage.getItem("userDetails"));
  const { userData } = useSelector((state) => state.auth);
  const user = userData || auth;

  useEffect(() => {
    dispatch(setUserData(auth));
  }, []);

  return (
    <>
      <Router>
        <ScrollToTop />
        <Header />
        <Helmet>
          <title>Gems, Jewelry, Beads, and Art Marketplace - Your One-Stop for Exquisite Creations.</title>
          <meta name="robots" content={process.env.REACT_APP_META_ROBOTS} />
          <meta
            name="description"
            content="Explore a world of beauty and craftsmanship with our stunning collection of gems, jewelry, beads, and art. Find unique, handcrafted treasures for every occasion."
          />
          <meta
            name="keywords"
            content="Gemstones, Beads, Fine Jewelry, Art, Marketplace."
          />
        </Helmet>
        <Routes>
          {/*Auth*/}
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route path="/reset-password/*" element={<ResetPassword />} />
          <Route exact path="/authentication" element={<Authentication />} />
          <Route exact path="/forgot-password" element={<ForgotPassword />} />

          {/*User Dashboard*/}
          <Route exact path="/personal" element={<Personal />} />
          <Route
            exact
            path="/my-cart"
            element={user ? <Usercartlist /> : <Login />}
          />

          <Route
            exact
            path="/dashboard"
            element={user | auth ? <UserDashboard /> : <Navigate to="/login" />}
          />

          <Route
            exact
            path="/profile"
            element={user ? <UserAccount /> : <Navigate to="/login" />}
          />
          <Route
            exact
            path="/orders"
            element={user ? <UserOrders /> : <Navigate to="/login" />}
          />
          <Route
            exact
            path="/address"
            element={user ? <UserAddress /> : <Navigate to="/login" />}
          />
          {/* <Route exact path="/wishlist" element={user ? <UserWishlist /> : <Login />}/> */}
          <Route
            exact
            path="/wishlist"
            element={user ? <UserWishlist /> : <Navigate to="/login" />}
          />
          <Route
            exact
            path="/user-order-details"
            element={<UserOrderDetails />}
          />

          {/*Static Web Page*/}
          <Route exact path="/" element={<Home />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/faq" element={<Faq />} />
          <Route
            exact
            path="/terms-and-condition"
            element={<Termscondition />}
          />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route exact path="/store/:storeSlug" element={<SellerStore />} />
          <Route exact path="/page-not-found" element={<Pagenotfound />} />
          <Route exact path="/help-topics" element={<HelpTopics />} />

          {/*Product, Category, SubCategory*/}
          <Route exact path="/productlist" element={<Productlist />} />
          <Route exact path="/productdetail" element={<Productdetail />} />
          <Route exact path="/categories" element={<Category />} />
          <Route exact path="/shop/:productTitle" element={<SingleProduct />} />
          <Route
            exact
            path="/:category/:subCategory"
            element={<ProductlistBySubcat />}
          />
          <Route exact path="/:category" element={<ProductByCategory />} />
          <Route exact path="/product-search" element={<Productsearch />} />

          {/*Cart CheckOut Page*/}
          <Route
            exact
            path="/cart"
            element={user ? <Cart /> : <Navigate to="/login" />}
          />

          {/* <Route exact path="/checkout" element={<ShippingInfo />} /> */}

          <Route
            exact
            path="/checkout"
            element={user ? <Checkout /> : <Navigate to="/login" />}
          />
          <Route
            exact
            path="/thank-you"
            element={user ? <ThankYou /> : <Navigate to="/login" />}
          />
          <Route exact path="/shippingchange" element={<ShippingChange />} />

          <Route exact path="/test" element={<Test />} />
          {/*<Route exact path="/checkout" element={user ? <CheckoutOldCode /> : <Login />}/>*/}
          {/* <Route path="/reset-password/1edee312-9141-6170-8bed-6bbc4f1719e0" element={<ResetPassword/>} /> */}
          {/* <Route path='/blogs' element={<Blogs/>} /> */}
          {/* <Route path='/sign-up' element={<SignUp/>} /> */}
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
