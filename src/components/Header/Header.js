import "../../App.css";
import "spiketip-tooltip/spiketip.min.css";
import React, { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategories,
  getHeaderData,
  getSearch_products,
  getTopbar,
} from "../../store/home";
import MobileHeader from "./MobileHeader";
import { images } from "../../utils/images";
import { getWishlistProduct, productActions } from "../../store/product";
import { setUserData } from "../../store/auth";

function Header() {
  // Hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { userData } = useSelector((state) => state.auth);

  // Variables
  let data = JSON.parse(localStorage.getItem("userDetails"));
  let user_id = data?.ID;

  useEffect(() => {
    dispatch(setUserData(JSON.parse(localStorage.getItem("userDetails"))));
    if (user_id) {
      dispatch(getHeaderData({ user_id: user_id }));
    }
  }, [pathname]);

  // Selector
  const state = useSelector((state) => state.auth);
  const headerCategories = useSelector((state) => state.home.headerCategories);
  const Topbar = useSelector((state) => state.home.Topbar);
  const headerData = useSelector((state) => state.home.headerData);
  const wishlists = useSelector((state) => state.prodLi.wishList);

  const [activeCategory, setActiveCategory] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [inputValue, setInputValue] = useState({ clicked: false, value: "" });
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user_id) {
      dispatch(getWishlistProduct());
    }
    dispatch(getCategories());
    dispatch(getTopbar());
  }, [user_id]);
  // Watch
  useEffect(() => {
    if (user_id) {
      dispatch(getHeaderData({ user_id }));
    }
  }, [user_id]);

  // Methods
  const handleLogout = () => {
    localStorage.removeItem("userDetails");
    window.location.reload();
  };
  const handleSearch = () => {
    dispatch(productActions.setFetchPermit(false));
    dispatch(getSearch_products(inputValue.value, 1));
    dispatch(productActions.setFilterData(""));
    navigate("/product-search?search=" + inputValue.value);
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // console.log(inputValue)
      event.preventDefault();
      dispatch(getSearch_products(inputValue.value, 1));
      setInputValue({ clicked: false, value: "" });
      setShowModal(false);
      navigate("/product-search?search=" + inputValue.value);
    }
  };
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const toggleSubcategory = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  const onProductCategoryClick = (category) => {
    dispatch(productActions.setFetchPermit(false));
  };

  return (
    <div className="App">
      <div className="top-header">
        <div className="container">
          <div className="flex-header">
            <div className="newsflash">
              <p dangerouslySetInnerHTML={{ __html: Topbar.data }}></p>
            </div>
            <div className="clgrid">
              {/* <i className="ri-customer-service-2-line"></i> Toll Free : <b>{Topbar.contact}</b> */}
              {Topbar.contact}
            </div>
          </div>
        </div>
      </div>

      <div className="navbar_header">
        <div className="container">
          <div className="flex-header my-3">
            <Link
              className="navbar-brand"
              to="/"
              onClick={() => {
                setActiveCategory(null);
                setHoveredCategory(null);
              }}
            >
              <img
                src={images["logo.png"]}
                className="img-fluid"
                title=""
                alt=""
                style={{ width: "192px; height:42px" }}
              />
            </Link>

            {/* <!-- search --> */}
            <div className="search_box">
              <div
                className="searchtxt"
                spiketip-title="🔍 Search Anything"
                spiketip-pos="left"
                spiketip-color="error"
              >
                <input
                  type="search"
                  name="search"
                  className="form-control"
                  placeholder="Search Product"
                  id="search_item"
                  value={inputValue.value}
                  onKeyDown={(e) => handleKeyPress(e)}
                  onChange={(e) =>
                    setInputValue({
                      clicked: false,
                      value: e.currentTarget.value,
                    })
                  }
                />
                {/* <AutoComplete setSearchTerm={setInputValue} searchTerm={inputValue} /> */}
                <span to="" className="search_icon" onClick={handleSearch}>
                  <i className="fa fa-search" aria-hidden="true"></i>
                </span>
                {/* <ul>
                  {suggestions.map((suggestion) => (
                    <li key={suggestion}>{suggestion}</li>
                  ))}
                </ul> */}
              </div>
            </div>
            {/* <!-- nav line  --> */}
            <div className="navLine w-100">
              <div className="searchdesg">
                <Link
                  to={process.env.REACT_APP_JOIN_URL}
                  target="_blank"
                  spiketip-title="💰 Partner with us & Sell Your Products!"
                  spiketip-pos="top"
                  className="d-flex align-items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    className="sellProductIcon me-2"
                  >
                    <g clipPath="url(#clip0_5_20)">
                      <path
                        d="M14.875 8.24924V14.875C14.875 15.0629 14.8004 15.243 14.6675 15.3759C14.5347 15.5087 14.3545 15.5833 14.1667 15.5833H2.83333C2.64546 15.5833 2.4653 15.5087 2.33246 15.3759C2.19962 15.243 2.12499 15.0629 2.12499 14.875V8.24924C1.66763 7.73213 1.41563 7.06534 1.41666 6.37499V2.12499C1.41666 1.93713 1.49129 1.75696 1.62413 1.62412C1.75696 1.49128 1.93713 1.41666 2.12499 1.41666H14.875C15.0629 1.41666 15.243 1.49128 15.3759 1.62412C15.5087 1.75696 15.5833 1.93713 15.5833 2.12499V6.37499C15.5833 7.09324 15.3156 7.74916 14.875 8.24924ZM13.4583 9.11907C12.9518 9.24921 12.4191 9.23685 11.9191 9.08336C11.4191 8.92986 10.9713 8.6412 10.625 8.24924C10.3594 8.55105 10.0324 8.79272 9.666 8.95811C9.29955 9.1235 8.90203 9.2088 8.49999 9.20832C8.09795 9.2088 7.70044 9.1235 7.33399 8.95811C6.96755 8.79272 6.6406 8.55105 6.37499 8.24924C6.02955 8.64232 5.58175 8.93177 5.08149 9.08535C4.58124 9.23893 4.04816 9.25061 3.54166 9.11907V14.1667H13.4583V9.11907ZM9.91666 6.37499C9.91666 6.18713 9.99129 6.00696 10.1241 5.87412C10.257 5.74128 10.4371 5.66666 10.625 5.66666C10.8129 5.66666 10.993 5.74128 11.1259 5.87412C11.2587 6.00696 11.3333 6.18713 11.3333 6.37499C11.3333 6.75071 11.4826 7.11105 11.7483 7.37672C12.0139 7.6424 12.3743 7.79166 12.75 7.79166C13.1257 7.79166 13.4861 7.6424 13.7517 7.37672C14.0174 7.11105 14.1667 6.75071 14.1667 6.37499V2.83332H2.83333V6.37499C2.83333 6.75071 2.98258 7.11105 3.24826 7.37672C3.51393 7.6424 3.87427 7.79166 4.24999 7.79166C4.62572 7.79166 4.98605 7.6424 5.25173 7.37672C5.5174 7.11105 5.66666 6.75071 5.66666 6.37499C5.66666 6.18713 5.74129 6.00696 5.87413 5.87412C6.00696 5.74128 6.18713 5.66666 6.37499 5.66666C6.56285 5.66666 6.74302 5.74128 6.87586 5.87412C7.0087 6.00696 7.08333 6.18713 7.08333 6.37499C7.08333 6.75071 7.23258 7.11105 7.49826 7.37672C7.76394 7.6424 8.12427 7.79166 8.49999 7.79166C8.87572 7.79166 9.23605 7.6424 9.50173 7.37672C9.7674 7.11105 9.91666 6.75071 9.91666 6.37499Z"
                        // fill="white"
                        className="sellProductIcon"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_5_20">
                        <rect
                          width="17"
                          height="17"
                          className="sellProductIcon"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  {/* <i className="fa fa-home vendor-icon" aria-hidden="true"></i>{" "} */}
                  <span className="d-none d-md-inline">Sell your Product</span>
                </Link>
              </div>
              <a
                href="/wishlist"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasNavbar"
                aria-controls="offcanvasNavbar"
                className="nav-link cart dbookmark"
                spiketip-title="💟 Your Dream Cart!"
                spiketip-pos="left"
                spiketip-color="success"
              >
                <i className="fa fa-heart-o" aria-hidden="true"></i>
                <span>
                  {wishlists && wishlists?.total_products > 0
                    ? wishlists.total_products
                    : 0}
                </span>
              </a>
              <a
                href="/cart"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasNavbar"
                aria-controls="offcanvasNavbar"
                className="nav-link cart"
                spiketip-title="🛒 View Cart!"
                spiketip-pos="bottom"
                spiketip-color="success"
              >
                {/* <i className="fa fa-shopping-cart" aria-hidden="true"></i> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <g clipPath="url(#clip0_27_24)">
                    <path
                      d="M4 16V4H2V2H5C5.26522 2 5.51957 2.10536 5.70711 2.29289C5.89464 2.48043 6 2.73478 6 3V15H18.438L20.438 7H8V5H21.72C21.872 5 22.022 5.03466 22.1586 5.10134C22.2952 5.16801 22.4148 5.26495 22.5083 5.38479C22.6019 5.50462 22.6668 5.6442 22.6983 5.79291C22.7298 5.94162 22.7269 6.09555 22.69 6.243L20.19 16.243C20.1358 16.4592 20.011 16.6512 19.8352 16.7883C19.6595 16.9255 19.4429 17 19.22 17H5C4.73478 17 4.48043 16.8946 4.29289 16.7071C4.10536 16.5196 4 16.2652 4 16ZM6 23C5.46957 23 4.96086 22.7893 4.58579 22.4142C4.21071 22.0391 4 21.5304 4 21C4 20.4696 4.21071 19.9609 4.58579 19.5858C4.96086 19.2107 5.46957 19 6 19C6.53043 19 7.03914 19.2107 7.41421 19.5858C7.78929 19.9609 8 20.4696 8 21C8 21.5304 7.78929 22.0391 7.41421 22.4142C7.03914 22.7893 6.53043 23 6 23ZM18 23C17.4696 23 16.9609 22.7893 16.5858 22.4142C16.2107 22.0391 16 21.5304 16 21C16 20.4696 16.2107 19.9609 16.5858 19.5858C16.9609 19.2107 17.4696 19 18 19C18.5304 19 19.0391 19.2107 19.4142 19.5858C19.7893 19.9609 20 20.4696 20 21C20 21.5304 19.7893 22.0391 19.4142 22.4142C19.0391 22.7893 18.5304 23 18 23Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_27_24">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span>
                  {headerData && headerData.cart_count > 0
                    ? headerData.cart_count
                    : 0}
                </span>
              </a>
              {/* <Link className="dropdown-item" to="/user-dashboard" spiketip-title="Your Dashboard" spiketip-pos="top">My Profile</Link></li> */}
              {/* href="javascript:void(0)"  */}
              {userData && userData?.username ? (
                <>
                  <ul className="list-unstyled m-0" style={{ zIndex: 1000 }}>
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link"
                        role="button"
                        id="navbarDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <strong>{userData?.username}</strong>
                      </a>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="navbarDropdown"
                      >
                        <li>
                          <Link
                            className="dropdown-item"
                            spiketip-title="Your Dashboard"
                            to="/profile"
                            spiketip-pos="top"
                          >
                            My Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            to="/"
                            onClick={handleLogout}
                          >
                            Logout
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </>
              ) : (
                <Link to="/login" className="signbtn">
                  Sign in
                </Link>
              )}
              {/* <!-- cart modal  --> */}
              <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel"
              >
                <div className="offcanvas-header">
                  <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                    Shop Cart
                  </h5>
                  <button
                    type="button"
                    className="btn-close text-reset"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="offcanvas-body">
                  {/* <!-- cart list  --> */}
                  <div className="cartList">
                    <div className="cart_img">
                      <img
                        src={images["product-cover-3.png"]}
                        className="img-fluid"
                        title=""
                        alt=""
                      />
                    </div>
                    <div className="cartDt">
                      <h5>Pearl Necklace</h5>
                      <div className="weight font-s">50g</div>
                      <div className="remove font-s">
                        <Link to="#link">
                          <i className="ri-delete-bin-4-line"></i> Remove
                        </Link>
                      </div>
                    </div>
                    <div className="qty">
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
                        onChange={(e) => {}}
                      />
                      <button className="qtyplus" aria-hidden="true">
                        +
                      </button>
                    </div>
                    {/* <!-- price  --> */}
                    <div className="price">₹32.00</div>
                  </div>
                  {/* <!-- cart list  --> */}
                  <div className="cartList">
                    <div className="cart_img">
                      <img
                        src={images["product-cover-4.png"]}
                        className="img-fluid"
                        title=""
                        alt=""
                      />
                    </div>
                    <div className="cartDt">
                      <h5>Pearl Necklace</h5>
                      <div className="weight font-s">500g</div>
                      <div className="remove font-s">
                        <Link to="#link">
                          <i className="ri-delete-bin-4-line"></i> Remove
                        </Link>
                      </div>
                    </div>
                    <div className="qty">
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
                        onChange={(e) => {}}
                      />
                      <button className="qtyplus" aria-hidden="true">
                        +
                      </button>
                    </div>
                    {/* <!-- price  --> */}
                    <div className="price">₹32.00</div>
                  </div>
                  <div className="offcanvas-footer d-flex mt-4">
                    <Link to="/" className="btn btn-dark">
                      Continue Shopping
                    </Link>
                    <Link to="/" className="btn btn-warning ms-3">
                      Continue to Pay
                    </Link>
                  </div>
                </div>
              </div>
              {/* <!-- end modal  --> */}
            </div>
          </div>
        </div>
      </div>

      <nav
        className="navbar navbar-expand-lg navbar-light nav-scroll-fixed"
        id="mainNav"
      >
        <div className="container position-relative">
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleMenu}
            data-bs-toggle="collapse"
            data-bs-target="/magNav"
            aria-controls="magNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
            id="magNav"
          >
            <ul className="navbar-nav">
              {headerCategories?.map((category, index) => {
                return (
                  <li
                    onClick={() => {
                      setHoveredCategory(category.cat_id);
                    }}
                    className={`nav-item ${
                      window.innerWidth < 768 ? "" : "dropdown"
                    }`}
                    key={index}
                    {...(window.innerWidth < 768
                      ? {
                          onClick: () => {
                            toggleSubcategory(category.cat_id);
                            setHoveredCategory(category.cat_id);
                          },
                        }
                      : null)}
                    // onMouseEnter={() => setHoveredCategory(category.cat_id)}
                    // onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <NavLink
                      className={
                        category.slug.includes(pathname) ||
                        category.cat_id === activeCategory ||
                        category.cat_id === hoveredCategory
                          ? "nav-link text-warning "
                          : "nav-link "
                      }
                      // to={`/product-by-category/${category.slug}`}
                      to={`/${category.slug}`}
                      onClick={() => {
                        onProductCategoryClick(category.slug);
                        setActiveCategory(category.cat_id);
                      }}
                    >
                      {category.cate_name}
                      {/* <img
                        src={
                          category.cat_id === hoveredCategory
                            ? images["chevron-up.svg"]
                            : images["chevron-down.svg"]
                        }
                        className=" ms-1 colorImge"
                        title=""
                        alt=""
                        width="13px"
                        // style={{ width: "192px; height:42px" }}
                      /> */}
                      {category.cat_id === hoveredCategory ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="15"
                          height="15"
                          viewBox="0 0 18 19"
                          fill="none"
                          className="ms-2"
                        >
                          <path
                            d="M14.9396 11.7876L10.0496 6.8976C9.47207 6.3201 8.52707 6.3201 7.94957 6.8976L3.05957 11.7876"
                            stroke="#F6A92C"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="15"
                          height="15"
                          viewBox="0 0 18 19"
                          fill="none"
                          className="ms-2"
                        >
                          <path
                            d="M14.9396 7.2124L10.0496 12.1024C9.47207 12.6799 8.52707 12.6799 7.94957 12.1024L3.05957 7.2124"
                            stroke="#051441"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                      {/* <i
                        className={
                          category.cat_id === hoveredCategory
                            ? "ms-2 fa fa-chevron-up"
                            : "ms-2 fa fa-chevron-down"
                        }
                      ></i> */}
                    </NavLink>
                    {category.sub_categories?.length > 0 && (
                      <ul
                        className={`dropdown-menu ${
                          selectedCategory === category.cat_id ? "show" : ""
                        }`}
                      >
                        {category.sub_categories?.map((sub_category, index) => {
                          return (
                            <li key={index}>
                              <Link
                                className="dropdown-item"
                                // to={`/product-category/${category.slug}/${sub_category.sub_cate_slug}`}
                                to={`/${category.slug}/${sub_category.sub_cate_slug}`}
                                onClick={() => {
                                  onProductCategoryClick(category.slug);
                                  setActiveCategory(category.cat_id);
                                  setHoveredCategory(category.cat_id);
                                }}
                              >
                                {sub_category.subcate_name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>

      {/* small screen header */}
      <MobileHeader
        headerCategories={headerCategories}
        setSearchTerm={setInputValue}
        searchTerm={inputValue}
        handleSearch={handleKeyPress}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </div>
  );
}

export default Header;
