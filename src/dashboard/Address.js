import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert, Col, Container, Row } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import { Helmet } from "react-helmet";

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
} from "../store/home";

import SiteLoader from "../SiteLoader";
import SiteLogo from "../components/img/logo.png";
import UserSidebar from "../components/Sidebar/UserSidebar";
import { get_meta } from "../store/home";
import "../styles/dashboard.css";
import ThemeBreadcrumb from "../components/common/ThemeBreadcrumb";

// import ImageCropModal from './ImageCropModal'; // Create a separate component for the image cropping modal
// import ImageCropModal from "./ImageCropModal";
// import AvatarEditor from 'react-avatar-editor';

const Address = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Getting meta info
  const mainstate = useSelector((state) => state.home);
  const metaTags = mainstate.allmeta;
  const siteUrl = window.location.href;

  useEffect(() => {
    dispatch(get_meta("home_page"));
  }, ["home_page"]);

  const country_code = useRef();
  const [activeTab, setActiveTab] = useState("dashboard");

  const [editAddress, setEditAddress] = useState(false);
  const [showStates, setShowStates] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const [showModal, setShowModal] = useState(false);

  const handleAddAddressModal = () => {
    dispatch(getAddressDetails({}));
    setEditAddress(false);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setEditAddress(false);
    setShowModal(false);
  };
  const dispatch = useDispatch();
  const initialValues = {
    name: "",
    email: "",
    phone: "",
    street_address: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
    address_for: "",
  };
  const userAddress = useSelector((state) => state.home.user_Address);
  const state = useSelector((state) => state.home);

  const states_list = useSelector((state) => state.home.states_list);
  const { total_orders, paid_orders, pending_orders, failed_orders } =
    useSelector((state) => state.home);

  // console.log("states list", states_list)
  const address_status = state.addAddressStatus;
  // useEffect(() => {
  //     if (address_status) {
  //         setShowModal(false);
  //     }
  // }, [address_status]);

  useEffect(() => {
    dispatch(getUserAddresses());
  }, []);

  const addressList = useSelector((state) => state.home.addressList);

  // if (addressList) {
  useEffect(() => {
    const defaultBillingAddress = addressList.find(
      (address) => address.is_billing === (1 || "1")
    );
    const defaultShippingAddress = addressList.find(
      (address) => address.is_shipping === (1 || "1")
    );

    if (defaultBillingAddress)
      setSelectedBillingAddressId(defaultBillingAddress.id);
    if (defaultShippingAddress)
      setSelectedShippingAddressId(defaultShippingAddress.id);
  }, [addressList]);
  // }

  useEffect(() => {
    dispatch(getCountry());
  }, [dispatch]);

  const countries = useSelector((state) => state.home.Country);

  const [errors, setErrors] = useState(false);

  const handleChangeUpdate = (e) => {
    const { name, value } = e.target;
    if (name === "country" && ["United States", "Canada"].includes(value)) {
      const selectElement = e.target;
      const selectedIndex = selectElement.selectedIndex;
      const selectedOption = selectElement.options[selectedIndex];
      if (selectedOption) {
        const id = selectedOption.getAttribute("data-id");
        dispatch(getStatesList(id));
      }

      setShowStates(true);
    } else if (name === "country") {
      setShowStates(false);
    }

    let input = { field: name, value: value };
    dispatch(manageAddressField(input));
  };

  useEffect(() => {}, [userAddress]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editAddress && validate(userAddress)) {
      dispatch(updateAddressDetails(userAddress));
      setShowModal(false);
      setEditAddress(false);
      // toast('Address updated successfully.');
    } else if (validate(userAddress)) {
      await dispatch(saveUserAddress(userAddress));
      setShowModal(false);
      toast("New Address added successfully!");
    }
  };
  const validate = (values, key) => {
    const errors = {};
    const regex =
      /^(|(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6})$/i;

    if (!values.name) {
      errors.name = "Your Name is required!";
    }

    // if (!values.email) {
    //   errors.email = "Email is required!";
    // } else if (!regex.test(values.email)) {
    //   errors.email = "Please enter the correct format of the email.";
    // }

    if (!values.phone) {
      errors.phone = "Phone Number is required!";
    }

    if (!values.street_address) {
      errors.street_address = "Street Address is required!";
    }

    if (!values.city) {
      errors.city = "City is required!";
    }

    if (!values.state) {
      errors.state = "State is required!";
    }

    // if (!values.postcode) {
    //     errors.postcode = "Postcode is required!";
    // }

    if (!values.country) {
      errors.country = "Country is required!";
    }
    // if (key === "new") {
    //   if (!values.address_for) {
    //     errors.address_for = "Address Type is required!";
    //   }
    // }
    setErrors(errors);
    return Object.values(errors).length <= 0;
  };

  let userDetails = localStorage.getItem("userDetails");
  let data = JSON.parse(userDetails);
  let name = data?.full_name;
  let phone = data?.mobile;
  let email = data?.email;
  let profile_pic = data?.avatar;

  // USER ORDER
  useEffect(() => {
    dispatch(fetchOrderDetails());
  }, []);
  const all_Order = state.allOrder;
  var i = 0;
  const [selectedOption, setSelectedOption] = useState("");

  const addStatus = state.add_status;

  // const [defaultAddress, setDefaultAddress] = useState("");
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState("");
  const [selectedShippingAddressId, setSelectedShippingAddressId] =
    useState("");
  useEffect(() => {
    if (addStatus) {
      //console.log('addStatus', addStatus);
      //console.log('adressFor_status', state.adressFor_status);
      //   toast('Your address updated successfully');
    }
  }, [addStatus]);

  const updateDefaultAddressBilling = async (id, address_for) => {
    if (address_for === "billing") setSelectedBillingAddressId(id);
    if (address_for === "shipping") setSelectedShippingAddressId(id);

    // update address status
    await dispatch(updateAddressFor(id, address_for));

    // get Latest addressList
    await dispatch(getUserAddresses());
  };

  // USER ORDER DETAILS
  const all_Order_Details = state.userOrderDetail;
  var i = 0;
  useEffect(() => {
    dispatch(fetchOrderStatus());
  }, []);

  function handleOrderClick(order) {
    // Perform API call or other actions with the order ID
    // console.log('orderId', orderId)
    navigate("/user-order-details", {
      state: {
        order_id: order,
      },
    });
  }

  /**Fetch profile Details start */
  useEffect(() => {
    dispatch(getProfile());
  }, []);

  const [phoneNumber, setPhoneNumber] = useState(null);
  const [countryCode, setCountryCode] = useState(null);

  const profile_details = state.user_profile;

  useEffect(() => {
    // console.log('profile_details',profile_details);
    if (Object.keys(profile_details).length > 0) {
      const phoneNumber = profile_details.mobile;
      const minLength = 10; // Minimum length of the phone number excluding the country code
      //     console.log("phonenumber", phoneNumber)
      if (phoneNumber.length >= minLength) {
        let countryCode = "";
        let phoneNumberWithoutCountryCode = "";

        // Extract the country code and remaining phone number
        if (
          phoneNumber.startsWith("+") &&
          phoneNumber.length >= minLength + 3
        ) {
          // Country code with "+"
          countryCode = phoneNumber.substring(0, 3); // Assuming maximum length of country code is 3 digits
          phoneNumberWithoutCountryCode = phoneNumber.substring(3);
        } else if (phoneNumber.length >= minLength + 1) {
          // Country code without "+"
          countryCode = phoneNumber.substring(0, 2); // Assuming maximum length of country code is 2 digits
          phoneNumberWithoutCountryCode = phoneNumber.substring(2);
        }

        // Do something with the extracted countryCode and phoneNumberWithoutCountryCode
        // console.log('Country Code:', countryCode);
        // console.log('Phone Number without Country Code:', phoneNumberWithoutCountryCode);

        // Update the input value without the country code
        //   document.getElementById("country_code").value = countryCode
        //   e.target.value = phoneNumberWithoutCountryCode;

        setPhoneNumber(phoneNumberWithoutCountryCode);
        setCountryCode(countryCode);
      } else {
        setPhoneNumber(phoneNumber);
      }
    }
  }, [profile_details]);
  /**Fetch profile Details  end */
  /**UserProfile started */
  // Update user profile section api dept
  const [errors_profile, setErrors_profile] = useState({});
  const [base64Image, setBase64Image] = useState("");

  const handleSubmitform = (e) => {
    const user_id = data?.ID;

    e.preventDefault();
    let errors = {};
    const nameInput = e.target.elements.full_name;
    const emailInput = e.target.elements.email;
    const phoneInput = e.target.elements.mobile;
    // Regular expressions for email and phone validation
    const emailRegex =
      /^(|(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6})$/i;
    const phoneRegex = /^\d{10}$/;

    if (!nameInput.value) {
      errors = { ...errors, full_name: "Your Name is required!" };
      nameInput.focus();
    }
    if (!emailInput.value || !emailRegex.test(emailInput.value)) {
      errors = { ...errors, email: "Please enter a valid email!" };
      emailInput.focus();
    }
    if (!phoneInput.value || !phoneRegex.test(phoneInput.value)) {
      errors = { ...errors, mobile: "Please enter a valid phone number!" };
      phoneInput.focus();
    }
    // If form is valid, submit form data
    if (Object.keys(errors).length === 0) {
      const formData = new FormData(e.target);

      formData.append("user_id", user_id);
      const mobileNumber = formData.get("mobile");
      const countryCode = formData.get("country_code");
      const modifiedMobileNumber = mobileNumber;
      // countryCode +
      formData.delete("mobile");
      formData.delete("country_code");
      formData.append("mobile", modifiedMobileNumber);
      // formData.append("img", selectedImage);

      dispatch(getUpdateuserprofile(formData)).then(() => {
        dispatch(getProfile());
      });
      setErrors_profile({});
    } else {
      setErrors_profile(errors);
    }
  };
  const [errors_profile_pass, setErrors_profile_pass] = useState({});
  const handleSubmitformpass = (e) => {
    const user_id = data?.ID;
    e.preventDefault();
    let errors_pass = {};
    const currentpassInput = e.target.elements.old_password;
    const newpassInput = e.target.elements.new_password;
    const cnfnewpassInput = e.target.elements.cnf_new_pass;
    // Regular expressions for email and phone validation

    const passregex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (!currentpassInput.value) {
      errors_pass = {
        ...errors_pass,
        old_password: "Please Enter the Current Password!",
      };
      currentpassInput.focus();
    }
    if (!newpassInput.value || !passregex.test(newpassInput.value)) {
      errors_pass = {
        ...errors_pass,
        new_password: "Please Enter a Valid Password!",
      };
      newpassInput.focus();
    }
    if (!cnfnewpassInput.value) {
      errors_pass = {
        ...errors_pass,
        cnf_new_pass: "Please Enter the New Password Again!",
      };
      cnfnewpassInput.focus();
    }
    if (cnfnewpassInput.value !== newpassInput.value) {
      errors_pass = { ...errors_pass, cnf_new_pass: "Passwords do not match!" };
      cnfnewpassInput.focus();
    }
    // If form is valid, submit form data
    if (Object.keys(errors_pass).length === 0) {
      // console.log("hello")
      const formData = new FormData(e.target);
      formData.append("user_id", user_id);
      formData.delete("cnf_new_pass");
      dispatch(getChangepassword(formData));
      // toast("User Profile updated successfully");
      setErrors_profile_pass({});
    } else {
      setErrors_profile_pass(errors_pass);
    }
    e.preventDefault();
    setTimeout(() => {
      const form = document.getElementById("changePass_form");
      form.reset();
      dispatch(setPassStatus());
    }, 5000);
  };
  const Changepassword_success = useSelector(
    (state) => state.home.Changepassword
  );
  const Changepassword_fail = useSelector(
    (state) => state.home.Changepassword_fail
  );

  const changePassFun = () => (
    <div id="er_pass_div">
      {Changepassword_success?.msg ? (
        <span style={{ color: "green" }}>{Changepassword_success.msg}</span>
      ) : (
        <span style={{ color: "red" }}>{Changepassword_fail?.msg}</span>
      )}
    </div>
  );

  const Clear_message_field = () => {};
  /**UserProfile end */

  // DELETE ADDRESS START
  const deleteuseraddress = useSelector((state) => state.home.deleteuseradd);

  const handleDelete = async (event, addressId) => {
    event.stopPropagation();
    if (window.confirm("Are you sure you want to delete this address?")) {
      await dispatch(deleteUserAddress(addressId));
      toast("Address Deleted Successfully!", {
        autoClose: 1500,
      });
    }
  };

  const onAddressEdit = (address) => {
    setShowModal(true);
    setEditAddress(true);
    dispatch(getAddressDetails(address));
  };

  const [selectedImage, setSelectedImage] = useState(profile_details.avatar);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);

  // const handleImageChange = (event) => {
  //     // const file = event.target.files[0];
  //     // setSelectedImage(file);

  //     const file = event.target.files[0];

  //     if (file) {
  //         // Ask the user for their preference
  //         const userChoice = window.confirm("Do you want to replace the current image with the new one? Select 'OK' to replace, or 'Cancel' to remove the current image.");

  //         if (userChoice) {
  //           // Replace the current image with the new one
  //           setSelectedImage(file);
  //           setIsCropModalOpen(true);
  //         } else {
  //           // Remove the current image
  //           setSelectedImage(null);
  //         }
  //       } else {
  //         // No existing image, directly open the crop modal for the new image
  //         setSelectedImage(file);
  //         setIsCropModalOpen(true);
  //       }

  //     dispatch(updateProfileImage(file, data?.ID))
  // }

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [showimgModal, setshowimgModal] = useState(false);

  const toggleImgModal = () => {
    // console.log(selectedImage);
    setshowimgModal(!showimgModal);
  };
  const handleimgModalClose = () => {
    setshowimgModal(false);
  };
  const handleDeleteProfileImg = () => {
    setSelectedImage(null);
    setshowimgModal(false);
    // console.log(selectedImage);
  };
  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   const reader = new FileReader();

  //   reader.onloadend = () => {
  //     setSelectedImage(reader.result);
  //   };

  //   if (file) {
  //     reader.readAsDataURL(file);
  //   }
  //   setshowimgModal(false);
  // };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    // setshowimgModal(false);

    // if (selectedImage) {
    //   const reader = new FileReader();

    //   reader.onloadend = () => {
    //     const base64Encoded = reader.result;
    //     setBase64Image(base64Encoded);
    //   };

    //   reader.readAsDataURL(selectedImage);
    // }
    setUpdated(true);
    // console.log("updated", updated);
    // dispatch(updateProfileImage(file, data?.ID));
  };

  const uploadImag = () => {
    dispatch(updateProfileImage(selectedImage, data?.ID));

    // setSelectedImage(null);
    setUpdated(false);
  };
  const handleDeleteProfilePic = () => {
    dispatch(deleteProfilePic(profile_details.email)).then(() => {
      dispatch(getProfile());

      // setSelectedImage(profile_details.avatar)
    });

    setSelectedImage(null);
    // setUpdated(false);
  };
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setIsConfirmationModalOpen(false);
    setUpdated(false);
  };

  const handleConfirmationModalClose = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleConfirmationModalConfirm = () => {
    handleRemoveImage();
  };

  function checkPhoneNumber(event) {
    const input = event.target;
    const inputValue = input.value;

    // Remove any non-numeric characters from the input value

    const numericValue = inputValue.replace(/[^+\d]/g, "");
    input.value = numericValue;
  }

  // DELETE ADDRESS END
  const handleCloseModal = () => {
    setIsCropModalOpen(false); // Close the modal
  };

  const defaultCountryCode = profile_details?.country_code || "+91";
  const renderDefaultBillingAddressComp = (Label, Address) => {
    return (
      <div className="d-flex align-items-center">
        <input
          className="form-check-input"
          type="radio"
          value="billing"
          name={`default_billing_${Address.id}`}
          id={`default_billing_${Address.id}`}
          checked={Address.id === selectedBillingAddressId}
          onChange={() => updateDefaultAddressBilling(Address.id, "billing")}
        />

        <label
          className="form-check-label"
          htmlFor={`default_billing_${Address.id}`}
          style={{ paddingTop: "2px" }}
        >
          {Label}
        </label>
      </div>
    );
  };

  const renderDefaultShippingAddressComp = (Label, Address) => {
    return (
      <div className="d-flex align-items-center">
        <input
          className="form-check-input"
          type="radio"
          value="shipping"
          name={`default_shipping_${Address.id}`}
          id={`default_shipping_${Address.id}`}
          checked={Address.id === selectedShippingAddressId}
          onChange={() => updateDefaultAddressBilling(Address.id, "shipping")}
        />

        <label
          className="form-check-label"
          htmlFor={`default_shipping_${Address.id}`}
          style={{ paddingTop: "2px" }}
        >
          {Label}
        </label>
      </div>
    );
  };

  const isLoading = useSelector((state) => state.home.loaderStatus);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{metaTags?.meta_title}</title>
        <meta name="description" content={metaTags?.meta_description} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={siteUrl} />
        <meta name="twitter:title" content={metaTags?.meta_data?.og_title} />
        <meta
          name="twitter:description"
          content={metaTags?.meta_data?.og_description}
        />
        <meta name="twitter:image" content={SiteLogo} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={metaTags?.meta_data?.og_title} />
        <meta
          property="og:description"
          content={metaTags?.meta_data?.og_description}
        />
        <meta property="og:image" content={SiteLogo} />
      </Helmet>

      {isLoading ? (
        <SiteLoader status={isLoading} />
      ) : (
        <>
          <main className="dashboard-main">
            <ThemeBreadcrumb title="Dashboard" current_route="Profile" />

            <section className="container w-100" style={{ marginTop: "50px" }}>
              <div className="flexTab w-100">
                {/*Sidebar*/}

                <UserSidebar />

                {/*Address*/}
                <div
                  className="tab-content accordion w-100"
                  id="dashboardAction"
                >
                  <div
                    className={`tab-pane fade active show`}
                    id="address-tab-pane"
                    role="tabpanel"
                    aria-labelledby="address-tab"
                    tabIndex={0}
                  >
                    <div
                      id="addressAc"
                      className="accordion-collapse d-block"
                      aria-labelledby="addressAc"
                      data-bs-parent="#addressAc"
                    >
                      <div className="accordion-body p-0">
                        {/* address  */}
                        <div className="flex-heading mb-4">
                          <h4>Address</h4>

                          <Link
                            onClick={handleAddAddressModal}
                            className="theme-btn px-4 py-2"
                            to="#"
                          >
                            <i className="ri-add-line" /> Add Address
                          </Link>

                          {/* </a> */}
                          {/* Modal */}
                          <Modal
                            show={showModal}
                            onHide={handleModalClose}
                            size="lg"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>
                                <h5
                                  className="modal-title"
                                  id="addAddressLabel"
                                >
                                  {editAddress ? "Update" : "Add"} Address
                                </h5>
                              </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <div className="container">
                                <div className="row">
                                  <div className="col-md-12 login-wrap">
                                    <form onSubmit={handleSubmit}>
                                      <div className="row">
                                        <div className="col-md-6 form-group mb-3">
                                          <label htmlFor="name">Name</label>
                                          <input
                                            type="text"
                                            name="name"
                                            maxLength={50}
                                            onChange={handleChangeUpdate}
                                            className="form-control"
                                            placeholder="Your Full Name"
                                            defaultValue={userAddress.name}
                                          />
                                          <p className="register_error">
                                            {errors.name}
                                          </p>
                                        </div>

                                        <div className="col-md-6 form-group mb-3">
                                          <label htmlFor="street_address">
                                            Street Address
                                          </label>
                                          <input
                                            type="text"
                                            name="street_address"
                                            onChange={handleChangeUpdate}
                                            className="form-control"
                                            placeholder="Address"
                                            defaultValue={
                                              userAddress.street_address
                                            }
                                          />
                                          <p className="register_error">
                                            {errors.street_address}
                                          </p>
                                        </div>

                                        <div className="col-md-6 form-group mb-3">
                                          <label htmlFor="country">
                                            Country
                                          </label>
                                          <select
                                            name="country"
                                            id="country"
                                            onChange={handleChangeUpdate}
                                            className="form-control"
                                            defaultValue={userAddress.country}
                                          >
                                            <option value="">
                                              Choose Your Country
                                            </option>
                                            {countries.map((country) => (
                                              <option
                                                key={country.id}
                                                data-id={country.id}
                                                value={country.country_name}
                                              >
                                                {country.country_name}
                                              </option>
                                            ))}
                                          </select>
                                          <p className="register_error">
                                            {errors.country}
                                          </p>
                                        </div>

                                        <div className="col-md-6 form-group mb-3">
                                          <label htmlFor="city">City</label>
                                          <input
                                            type="text"
                                            name="city"
                                            onChange={handleChangeUpdate}
                                            className="form-control"
                                            placeholder="Your City Name"
                                            defaultValue={userAddress.city}
                                          />
                                          <p className="register_error">
                                            {errors.city}
                                          </p>
                                        </div>

                                        <div className="col-md-6 form-group mb-3">
                                          <label htmlFor="state">State</label>
                                          {showStates ? (
                                            <select
                                              name="state"
                                              id="state"
                                              onChange={handleChangeUpdate}
                                              className="form-control"
                                              defaultValue={userAddress.state}
                                            >
                                              <option value="">
                                                Choose Your State
                                              </option>
                                              {states_list.length > 0 &&
                                                states_list.map((state) => (
                                                  <option
                                                    value={state.state_name}
                                                  >
                                                    {state.state_name}
                                                  </option>
                                                ))}
                                            </select>
                                          ) : (
                                            <input
                                              type="state"
                                              name="state"
                                              onChange={handleChangeUpdate}
                                              className="form-control"
                                              placeholder="State"
                                              defaultValue={userAddress.state}
                                            />
                                          )}

                                          <p className="register_error">
                                            {errors.state}
                                          </p>
                                        </div>

                                        <div className="col-md-6 form-group mb-3">
                                          <label htmlFor="postcode">
                                            Zipcode
                                          </label>
                                          <input
                                            type="text"
                                            name="postcode"
                                            onChange={handleChangeUpdate}
                                            className="form-control"
                                            placeholder="Pincode"
                                            defaultValue={userAddress.postcode}
                                          />
                                          <p className="register_error">
                                            {errors.postcode}
                                          </p>
                                        </div>

                                        <div className="col-md-12 form-group mb-3">
                                          <label htmlFor="phone">
                                            Phone Number
                                          </label>
                                          <input
                                            type="text"
                                            name="phone"
                                            onChange={handleChangeUpdate}
                                            className="form-control"
                                            placeholder="Phone Number/Mobile Number"
                                            defaultValue={userAddress.phone}
                                          />
                                          <p className="register_error">
                                            {errors.phone}
                                          </p>
                                        </div>

                                        <div className="col-md-12 center-btn">
                                          <button
                                            type="submit"
                                            disabled={state.loaderStatus}
                                            className="theme-btn w-50"
                                            style={{
                                              padding: "12px 10px",
                                            }}
                                          >
                                            {state.loaderStatus
                                              ? "Loading..."
                                              : editAddress
                                              ? "Update"
                                              : "Add"}{" "}
                                            Address
                                          </button>
                                        </div>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </Modal.Body>
                            {/*<Modal.Footer>*/}
                            {/*    <button onClick={handleModalClose}>Cancel</button>*/}
                            {/*</Modal.Footer>*/}
                          </Modal>
                        </div>

                        {/*address dashboard view*/}
                        <Row>
                          <Col md={12}>
                            {addressList && addressList.length > 0 ? (
                              addressList.map((address) => {
                                return (
                                  <div>
                                    {/* <SiteLoader status={state.loaderStatus} /> */}
                                    <div
                                      className="p-4 address-item"
                                      style={{
                                        border: "1px solid #eee",
                                        padding: "10px 10px 10px 10px",
                                        marginBottom: "25px",
                                      }}
                                    >
                                      <h4 className="text-xl font-medium">
                                        {address?.name}

                                        <div
                                          onClick={() => onAddressEdit(address)}
                                          style={{
                                            float: "right",
                                            fontSize: "20px",
                                          }}
                                        >
                                          <i
                                            className="bi bi-pen"
                                            style={{
                                              marginRight: "40px",
                                              color: "#90959a",
                                              cursor: "pointer",
                                            }}
                                          ></i>
                                          <i
                                            className="bi bi-trash"
                                            style={{
                                              color: "#90959a",
                                              cursor: "pointer",
                                            }}
                                            onClick={(event) =>
                                              handleDelete(event, address.id)
                                            }
                                          ></i>
                                        </div>
                                      </h4>
                                      <p className="text-gray-500">
                                        Phone: {address?.phone}
                                      </p>
                                      <address className="text-gray-700 mt-2">
                                        {address?.street_address} ,{" "}
                                        {address?.city}, {address?.state} ,{" "}
                                        {address?.country} - {address?.postcode}
                                      </address>

                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <div
                                          className="d-flex flex-lg-row flex-column"
                                          style={{
                                            // display: "inline-flex",
                                            columnGap: "15px",
                                          }}
                                        >
                                          {renderDefaultBillingAddressComp(
                                            "Default Billing Address",
                                            address
                                          )}

                                          {renderDefaultShippingAddressComp(
                                            "Default Shipping Address",
                                            address
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <Alert
                                color="info"
                                className="bg-white shadow-md"
                              >
                                No address found!
                              </Alert>
                            )}

                            {/*<Alert*/}
                            {/*    color="warning"*/}
                            {/*    className="bg-white shadow-md"*/}
                            {/*>*/}
                            {/*    */}
                            {/*</Alert>*/}
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* clients  */}
          </main>
          <a
            href="#"
            className="back-to-top d-flex align-items-center justify-content-center"
          >
            <i className="bi bi-arrow-up-short" />
          </a>
        </>
      )}
    </>
  );
};

export default Address;
