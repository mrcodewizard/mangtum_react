import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { useLocation, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteProfilePic,
  deleteUserAddress,
  fetchOrderDetails,
  fetchOrderStatus,
  getAddressDetails,
  getChangepassword,
  getCountry,
  getProfile,
  getStatesList,
  getUpdateuserprofile,
  getUserAddresses,
  manageAddressField,
  saveUserAddress,
  setPassStatus,
  updateAddressDetails,
  updateAddressFor,
  updateProfileImage,
} from "../../store/home";
import { Input } from "reactstrap";

const UserSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const state = useSelector((state) => state.home);
  const profile_details = state.user_profile;
  const [selectedFile, setSelectedFile] = useState("");
  const [updated, setUpdated] = useState(false);

  /** Change user avatar */
  const handleFileChange = (e) => {
    const selectedImage = e.target.files[0];
    dispatch(updateProfileImage(selectedImage, profile_details?.ID));
    const selectedUrl = URL.createObjectURL(selectedImage);
    setSelectedFile(selectedUrl);
  };

  /** Delete user avatar */
  const handleFileDelete = () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this image ?"
    );
    if (confirm) {
      dispatch(deleteProfilePic(profile_details.email)).then(() => {
        window.location.reload();
        dispatch(getProfile());
        setSelectedFile(profile_details.avatar);
      });
    }
  };

  /**Fetch profile Details start */
  useEffect(
    () => {
      dispatch(getProfile());
    },
    [],
    [updated]
  );

  return (
    <div className="user-sidebar">
      <div className="user-info">
        <div className="user-avatar">
          <img
            src={selectedFile ? selectedFile : profile_details.avatar}
            alt="avatar"
            width={100}
            height={100}
          />
          <label className="btn-edit" htmlFor="btnAvatar">
            <i className="bi bi-pen"></i>
            <Input
              type="file"
              name="user_image"
              id="btnAvatar"
              onChange={handleFileChange}
            />
          </label>
          <div className="delete-avatar">
            <label
              className="btn-delete"
              onClick={handleFileDelete}
              htmlFor="icon-tarsh"
            >
              <i className="bi bi-trash" id="icon-tarsh"></i>
            </label>
          </div>
        </div>
        <p>Welcome Back</p>
        <h5>{profile_details.full_name ? profile_details.full_name : ""}</h5>
      </div>
      <Nav className="nav nav-tabs d-block" id="actionTab" role="tablist">
        <Nav.Item>
          <NavLink
            id="account-tab"
            to="/profile"
            exact
            activeClassName="active"
          >
            <i className="ri-account-circle-line" /> Profile
          </NavLink>
        </Nav.Item>

        <Nav.Item>
          <NavLink id="orders-tab" to="/orders" exact activeClassName="active">
            <i className="ri-shopping-cart-2-line" /> Orders
          </NavLink>
        </Nav.Item>

        <Nav.Item>
          <NavLink
            id="address-tab"
            to="/address"
            exact
            activeClassName="active"
          >
            <i className="ri-map-pin-user-line" /> Address
          </NavLink>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default UserSidebar;
