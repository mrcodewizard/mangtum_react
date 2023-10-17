import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Alert, Col, Container, Row, Spinner } from "reactstrap";
import Modal from "react-bootstrap/Modal";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet";

import {
  deleteProfilePic,
  deleteUserAddress,
  fetchOrderDetails,
  fetchUserOrderDetails,
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
import { get_meta } from "../store/home";
import UserSidebar from "../components/Sidebar/UserSidebar";
import "../styles/dashboard.css";
import ThemeBreadcrumb from "../components/common/ThemeBreadcrumb";

const Order = () => {
  const navigate = useNavigate();

  const country_code = useRef();

  // Getting meta info
  const mainstate = useSelector((state) => state.home);
  const metaTags = mainstate.allmeta;
  const siteUrl = window.location.href;

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
      (address) => address.is_billing === "1"
    );
    const defaultShippingAddress = addressList.find(
      (address) => address.is_shipping === "1"
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

    var input = { field: name, value: value };
    dispatch(manageAddressField(input));
  };

  useEffect(() => {}, [userAddress]);

  const handelSubmit = async (e) => {
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

  var userDetails = localStorage.getItem("userDetails");
  var data = JSON.parse(userDetails);
  var name = data?.full_name;
  var phone = data?.mobile;
  var email = data?.email;
  var profile_pic = data?.avatar;

  // ORDER LIST
  useEffect(() => {
    dispatch(fetchOrderDetails());
  }, []);
  const all_Order = state.allOrder;

  // console.log("Orders", all_Order);

  var i = 0;
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOrder, setSelectedOrder] = useState({});

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
  var i = 0;
  useEffect(() => {
    dispatch(fetchOrderStatus());
  }, []);

  const [detailsLoading, setDetailsLoading] = useState(false);
  const all_Order_Details = state.userOrderDetail;
  // console.log("Detail", all_Order_Details);

  /** Handle completed all items before current order status **/

  useEffect(() => {
    if (all_Order_Details) {
      const detail_items = all_Order_Details.items
        ? all_Order_Details.items
        : [];
      detail_items.length > 0 &&
        detail_items.map((item) => {
          const orderProgressGroup =
            document.querySelectorAll(".order-progress");
          let foundIndex = -1;
          orderProgressGroup.forEach((orderProgress) => {
            const progressItems =
              orderProgress.querySelectorAll(".progress-item");

            // Find the index of the last "completed" item in this group
            progressItems.forEach((currentItem, index) => {
              if (currentItem.classList.contains("completed")) {
                foundIndex = index;
              }
            });

            // Set completed to current step and step before it
            progressItems.forEach((currentItem, index) => {
              if (foundIndex > -1) {
                for (let k = index; k < foundIndex; k++) {
                  currentItem.classList.add("completed");
                }
              }
            });
          });
        });
    }
  }, [showModal, all_Order_Details]);

  function handleOrderClick(order) {
    // Perform API call or other actions with the order ID
    setEditAddress(false);
    setShowModal(true);
    setSelectedOrder(order);
    setDetailsLoading(true);
    dispatch(fetchUserOrderDetails(order.id));
    setTimeout(() => {
      setDetailsLoading(all_Order_Details.loader_status);
    }, 1000);
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
  /**Fetch profile details end */

  /**UserProfile started */
  // Update user profile section api dept
  const [errors_profile, setErrors_profile] = useState({});
  const [base64Image, setBase64Image] = useState("");

  const handleSubmitform = (e) => {
    const user_id = data?.ID;

    e.preventDefault();
    var errors = {};
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
    var errors_pass = {};
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
      toast("Address Deleted Successfully!");
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

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [showimgModal, setshowimgModal] = useState(false);

  const handleDeleteProfileImg = () => {
    setSelectedImage(null);
    setshowimgModal(false);
    // console.log(selectedImage);
  };

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
      <>
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
      </>
    );
  };

  const renderDefaultShippingAddressComp = (Label, Address) => {
    return (
      <>
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
      </>
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
            <ThemeBreadcrumb title="Dashboard" current_route="Orders" />

            <section className="container" style={{ marginTop: "50px" }}>
              <div className="flexTab w-100">
                <UserSidebar />

                <div className="tab-content" id="dashboardAction">
                  {/*Orders*/}
                  <div
                    className={`tab-pane fade active show`}
                    id="orders-tab-pane"
                    role="tabpanel"
                    aria-labelledby="orders-tab"
                    tabIndex={0}
                  >
                    <div
                      id="ordersAc"
                      className="accordion-collapse d-lg-block w-100"
                      aria-labelledby="ordersAc"
                      data-bs-parent="#ordersAc"
                    >
                      <div className="accordion-body table-responsive w-100">
                        <table className="table table-bordered table-responsive order-table w-100">
                          <thead>
                            <tr>
                              <th className="px-2" scope="col">
                                #
                              </th>
                              <th className="px-2" scope="col">
                                Order
                              </th>
                              <th className="px-2" scope="col">
                                Date
                              </th>
                              <th className="px-2" scope="col">
                                Status
                              </th>
                              <th className="px-2" scope="col">
                                Total
                              </th>
                              {/* <th scope="col">Action</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {all_Order.map((order) => {
                              i++;
                              let statusClass = "";
                              switch (order.order_status) {
                                case "Processing":
                                  statusClass = "text-warning";
                                  break;
                                case "Shipped":
                                  statusClass = "text-primary";
                                  break;
                                case "Delivered":
                                  statusClass = "text-success";
                                  break;
                                case "Cancelled":
                                  statusClass = "text-danger";
                                  break;
                                default:
                                  statusClass = "text-muted";
                                  break;
                              }
                              return (
                                <tr>
                                  <th scope="row">{i}</th>

                                  <td
                                    style={{
                                      paddingTop: "10px",
                                    }}
                                  >
                                    <span
                                      className="order-span"
                                      order_id={order.order_id}
                                      key={order.order_id}
                                      onClick={() => handleOrderClick(order)}
                                      style={{ cursor: "pointer" }}
                                    >
                                      {order.order_id}
                                    </span>
                                  </td>
                                  <td>{order.order_date}</td>
                                  <td>
                                    <div className={statusClass}>
                                      <i className="ri-refresh-line" />{" "}
                                      {order.order_status}
                                    </div>
                                  </td>
                                  <td>{order.order_total}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        <>
                          {/* Modal */}
                          <Modal
                            className="order-modal"
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
                                  Order Details
                                </h5>
                                <p>
                                  {selectedOrder.order_id
                                    ? selectedOrder.order_id
                                    : ""}
                                </p>
                              </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <div className="container">
                                <div className="row">
                                  <div className="col-md-12 mb-3">
                                    <h3 className="sub-heading">
                                      Order Details
                                    </h3>
                                    <p className="sub-date">
                                      {selectedOrder.order_date
                                        ? selectedOrder.order_date
                                        : ""}
                                    </p>
                                  </div>
                                </div>

                                {all_Order_Details.items &&
                                  all_Order_Details.items.map((detail, i) => {
                                    return (
                                      <div className="my-3">
                                        {detailsLoading ? (
                                          <Spinner size="md" color="warning" />
                                        ) : (
                                          <div className="row ordtop-info">
                                            <div className="col-md-2">
                                              <img
                                                src={detail.main_image}
                                                width={70}
                                                height={70}
                                                alt="product-image"
                                              />
                                            </div>
                                            <div className="col-md-10">
                                              <div className=" mb-3">
                                                <div className="row">
                                                  <div className="col-md-6">
                                                    <p className="desc">
                                                      {detail.product_name}
                                                    </p>
                                                  </div>
                                                  <div className="col-md-2 offset-md-2">
                                                    <p className="price">
                                                      ${detail.price}
                                                    </p>
                                                  </div>
                                                  <div className="col-md-2">
                                                    <p className="quantity">
                                                      <span>Qty:</span>{" "}
                                                      {detail.quantity}
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                              {!Array.isArray(
                                                detail.combinations
                                              ) &&
                                                detail.combinations.length !==
                                                  0 && (
                                                  <>
                                                    <div className="ord-swatches mt-3 mb-3">
                                                      {detail.combinations
                                                        .other_combi && (
                                                        <>
                                                          {detail.combinations.other_combi
                                                            .filter(
                                                              (item) =>
                                                                item.name ===
                                                                "Size"
                                                            )
                                                            .map((item) => {
                                                              return (
                                                                <>
                                                                  {item.name}:
                                                                  <div className="size-swatches ms-1">
                                                                    <div
                                                                      className="size-item"
                                                                      style={{
                                                                        width:
                                                                          "fit-content",
                                                                        padding:
                                                                          "2px",
                                                                      }}
                                                                    >
                                                                      {
                                                                        item.value
                                                                      }
                                                                    </div>
                                                                  </div>
                                                                </>
                                                              );
                                                            })}
                                                        </>
                                                      )}
                                                      {detail.combinations
                                                        .color_combi && (
                                                        <>
                                                          Color:
                                                          <div className="color-swatches">
                                                            <div
                                                              className="color-item"
                                                              style={{
                                                                backgroundColor:
                                                                  detail
                                                                    .combinations
                                                                    .color_combi
                                                                    .color_code,
                                                              }}
                                                              title={`${detail.combinations.color_combi.color}`}
                                                            ></div>
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>
                                                  </>
                                                )}
                                            </div>
                                          </div>
                                        )}
                                        {/* <div className="row">
                                                                                    <div className="col-md-12 font-medium font-monserrat my-2">
                                                                                        <p>Delivered on: <span className="light">August 28, 2023</span></p>
                                                                                    </div>
                                                                                </div> */}
                                        <div className="ordprogress-info mb-4">
                                          <div className="row">
                                            <div className="col-md-10 mx-auto">
                                              {/* ["placed", "order received", "order processed", "processing", "shipped", "delivered"] */}
                                              <div className="order-progress">
                                                <p
                                                  className={`progress-item ${
                                                    detail?.item_order_status.toLowerCase() ===
                                                    (
                                                      "placed" ||
                                                      "order received"
                                                    ).trim()
                                                      ? "completed last-step"
                                                      : ""
                                                  }`}
                                                >
                                                  Confirmed
                                                </p>
                                                <p
                                                  className={`progress-item ${
                                                    detail?.item_order_status.toLowerCase() ===
                                                    (
                                                      "processing" ||
                                                      "order processed"
                                                    ).trim()
                                                      ? "completed last-step"
                                                      : ""
                                                  }`}
                                                >
                                                  Processing
                                                </p>
                                                <p
                                                  className={`progress-item ${
                                                    detail?.item_order_status.toLowerCase() ===
                                                    "shipped"
                                                      ? "completed last-step"
                                                      : ""
                                                  }`}
                                                >
                                                  Shipped
                                                </p>
                                                <p
                                                  className={`progress-item ${
                                                    detail?.item_order_status.toLowerCase() ===
                                                    "delivered"
                                                      ? "completed last-step"
                                                      : ""
                                                  }`}
                                                >
                                                  Delivered
                                                </p>
                                              </div>
                                              <div className="border-box">
                                                <p>
                                                  <span className="light">
                                                    {selectedOrder.order_date}
                                                  </span>
                                                </p>
                                                <p>
                                                  {detail?.item_order_status.toLowerCase() ===
                                                    (
                                                      "placed" ||
                                                      "order received"
                                                    ).trim() && (
                                                    <>
                                                      <p>
                                                        <label className="pl-2 d-inline-flex">
                                                          Your order has been
                                                          confirmed. Thank you
                                                          for shopping at
                                                          Mangtum
                                                        </label>
                                                      </p>
                                                    </>
                                                  )}
                                                </p>
                                                <p>
                                                  {detail?.item_order_status.toLowerCase() ===
                                                    (
                                                      "processing" ||
                                                      "order processed"
                                                    ).trim() && (
                                                    <>
                                                      <p>
                                                        <label className="pl-2 d-inline-flex">
                                                          Your order is being
                                                          processed. Thank you
                                                          for shopping at
                                                          Mangtum
                                                        </label>
                                                      </p>
                                                    </>
                                                  )}
                                                </p>
                                                <p>
                                                  {detail?.item_order_status.toLowerCase() ===
                                                    "shipped" && (
                                                    <>
                                                      <p>
                                                        <label className="pl-2 d-inline-flex">
                                                          Tracking ID:{" "}
                                                          {detail.tracking_id}
                                                        </label>
                                                      </p>
                                                      <p>
                                                        <label className="pl-2 d-inline-flex">
                                                          Shipper:{" "}
                                                          {detail.shipper}
                                                        </label>
                                                      </p>
                                                      <p>
                                                        <label className="pl-2 d-inline-flex">
                                                          Your order has been
                                                          shipped. Thank you for
                                                          shopping at Mangtum
                                                        </label>
                                                      </p>
                                                    </>
                                                  )}
                                                </p>
                                                <p>
                                                  {detail?.item_order_status.toLowerCase() ===
                                                    "delivered" && (
                                                    <>
                                                      <p>
                                                        <label className="pl-2 d-inline-flex">
                                                          Your order has been
                                                          delivered. Thank you
                                                          for shopping at
                                                          Mangtum
                                                        </label>
                                                      </p>
                                                    </>
                                                  )}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        <hr className="pt-3" />
                                      </div>
                                    );
                                  })}

                                <div className="row">
                                  <div className="col-md-12">
                                    <div className="row">
                                      <div className="col-md-6">
                                        <div className="border-box">
                                          <p>Subtotal</p>
                                          <p className="light">
                                            $
                                            {selectedOrder.sub_total
                                              ? selectedOrder.sub_total
                                              : "0"}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="col-md-6">
                                        <div className="border-box">
                                          <p>Delivery</p>
                                          <p className="light">
                                            $
                                            {selectedOrder.delivery_charge
                                              ? selectedOrder.delivery_charge
                                              : "0"}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="col-md-6">
                                        <div className="border-box">
                                          <p>Tax</p>
                                          <p className="light">
                                            $
                                            {selectedOrder.tax
                                              ? selectedOrder.tax
                                              : "0"}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="col-md-6">
                                        <div className="border-box">
                                          <p>Total</p>
                                          <p className="light">
                                            $
                                            {selectedOrder.order_total
                                              ? selectedOrder.order_total
                                              : "0"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* <div className="col-md-4">
                                                                            <div className="border-box">
                                                                                <p>RETURN / REFUND</p>
                                                                                <p className="light">Until September 04, 2023</p> 
                                                                                <p><a href="/" className="text-dark">Write a review</a></p>   
                                                                            </div>  
                                                                        </div> */}
                                </div>

                                <div className="ordbottom-info my-3">
                                  <div className="row">
                                    <div className="col-md-6 mb-2">
                                      <h3 className="sub-heading">
                                        Shipping Address
                                      </h3>
                                      <div className="border-box py-2">
                                        <p className="light">
                                          {all_Order_Details?.shipping_address &&
                                            all_Order_Details?.shipping_address
                                              .street_address +
                                              ", " +
                                              all_Order_Details.billing_address
                                                .city +
                                              ", " +
                                              all_Order_Details.shipping_address
                                                .country}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                      <h3 className="sub-heading">
                                        Billing Address
                                      </h3>
                                      <div className="border-box py-2">
                                        <p className="light">
                                          {all_Order_Details?.billing_address &&
                                            all_Order_Details.billing_address
                                              .street_address +
                                              ", " +
                                              all_Order_Details.billing_address
                                                .city +
                                              ", " +
                                              all_Order_Details.billing_address
                                                .country}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Modal.Body>
                            {/*<Modal.Footer>*/}
                            {/*    <button onClick={handleModalClose}>Cancel</button>*/}
                            {/*</Modal.Footer>*/}
                          </Modal>
                        </>
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

export default Order;
