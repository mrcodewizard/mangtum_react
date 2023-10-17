import React, { useEffect, useState } from "react";
import { images } from "../../utils/images";
import { Link, useLocation, useParams } from "react-router-dom";
import SearchModal from "../General/SearchModal";
import { useOnClickOutside } from "../../utils/customHooks";
import { useRef } from "react";
import { useSelector } from "react-redux";

const data = [{ name: "apple" }, { name: "peas" }, { name: "mango" }];
const MobileHeader = ({
  headerCategories,
  setSearchTerm,
  searchTerm,
  handleSearch,
  ...otherProps
}) => {
  //to reduce size of props
  const { showModal, setShowModal } = otherProps;
  const [icon, seticon] = useState(true);

  const { userData } = useSelector((state) => state.auth);

  const ref = useRef();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openReplyMenuIndex, setOpenReplyMenuIndex] = useState(-1);

  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
    setOpenReplyMenuIndex(-1);
  }, [location]);

  useOnClickOutside(ref, () => setSidebarOpen(false));
  const [iconStates, setIconStates] = useState({});
  const handleReplyClick = (index) => {
    setIconStates((prevStates) => ({
      ...prevStates,
      [index]: !prevStates[index], // Toggle the icon state for the clicked category
    }));
    if (openReplyMenuIndex === index) {
      setOpenReplyMenuIndex(-1);
    } else {
      setOpenReplyMenuIndex(index);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userDetails");
    window.location.reload();
  };
  return (
    <div className="container">
      <div className="small-header">
        <button
          className="header-icon"
          onClick={(e) => setShowModal((prev) => !prev)}
        >
          <i className="fa fa-search" />
        </button>
        <Link to={"/"}>
          <img src={images["logo.png"]} alt="" />
        </Link>
        <div>
          <button
            className="header-icon"
            onClick={(e) => setSidebarOpen((prev) => !prev)}
          >
            <i className="fa fa-bars" />
          </button>
          <div
            ref={ref}
            className="drawer"
            style={{
              transform: `translateX(${sidebarOpen ? "0%" : "100%"})`,
            }}
          >
            <button
              className="svg-icon"
              onClick={(e) => setSidebarOpen((prev) => !prev)}
            >
              <img src={images["x.svg"]} alt="" />
            </button>
            <ul className="drawer-list bg-white" style={{ zIndex: 500 }}>
              {headerCategories &&
                headerCategories.map((item, index) => {
                  return (
                    <li onClick={(e) => handleReplyClick(index)} key={index}>
                      <Link to={`/${item.slug}`}>{item.cate_name}</Link>
                      <img
                        src={
                          iconStates[index]
                            ? images["chevron-up.svg"]
                            : images["chevron-down.svg"]
                        }
                        className=" ms-1 mt-1"
                        title=""
                        alt=""
                        width="13px"
                        style={{ float: "right" }}

                        // style={{ width: "192px; height:42px" }}
                      />
                      <ul
                        className="subcategory"
                        style={{
                          height: `${
                            openReplyMenuIndex === index ? "auto" : "0px"
                          }`,
                        }}
                      >
                        {item?.sub_categories &&
                          item.sub_categories.map((subCategory, index) => {
                            return (
                              <li key={index}>
                                <Link
                                  to={`/${item.slug}/${subCategory.sub_cate_slug}`}
                                  onClick={(e) => setSidebarOpen(false)}
                                >
                                  {subCategory.subcate_name}
                                </Link>
                              </li>
                            );
                          })}
                      </ul>
                    </li>
                  );
                })}
              <li>
                <Link to={"/"}>Sell Your Product</Link>
              </li>
              <li>
                <Link to={"/"}>View Cart</Link>
              </li>
              {userData ? (
                <>
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item text-danger"
                      to="/"
                      onClick={handleLogout}
                    >
                      Logout
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link to={"/"}>Sign In</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      {showModal && (
        <SearchModal
          setShowModal={setShowModal}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          handleSearch={handleSearch}
        />
      )}
    </div>
  );
};

export default MobileHeader;
