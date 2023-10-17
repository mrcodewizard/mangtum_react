import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
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
    updateProfileImage
} from "../store/home";

import { Alert, Col, Container, Row } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import SiteLoader from "../SiteLoader";
import { toast } from "react-toastify";

// import ImageCropModal from './ImageCropModal'; // Create a separate component for the image cropping modal
// import ImageCropModal from "./ImageCropModal";
// import AvatarEditor from 'react-avatar-editor';

const UserDashboard = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const country_code = useRef();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [editAddress, setEditAddress] = useState(false);
    const [showStates, setShowStates] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

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
        const defaultBillingAddress = addressList.find(address => address.is_billing === '1');
        const defaultShippingAddress = addressList.find(address => address.is_shipping === '1');

        if (defaultBillingAddress) setSelectedBillingAddressId(defaultBillingAddress.id);
        if (defaultShippingAddress) setSelectedShippingAddressId(defaultShippingAddress.id);

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

    useEffect(() => {
    }, [userAddress]);

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
            toast('New Address added successfully!');
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
    const [selectedShippingAddressId, setSelectedShippingAddressId] = useState("");
    useEffect(() => {
        if (addStatus) {
            //console.log('addStatus', addStatus);
            //console.log('adressFor_status', state.adressFor_status);
            //   toast('Your address updated successfully');
        }
    }, [addStatus]);

    const updateDefaultAddressBilling = async (id, address_for) => {
        if (address_for === 'billing') setSelectedBillingAddressId(id);
        if (address_for === 'shipping') setSelectedShippingAddressId(id);

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

    const Clear_message_field = () => {
    };
    /**UserProfile end */

    // DELETE ADDRESS START
    const deleteuseraddress = useSelector((state) => state.home.deleteuseradd);

    const handleDelete = async (event, addressId) => {
        event.stopPropagation();
        if (window.confirm("Are you sure you want to delete this address?")) {
            await dispatch(deleteUserAddress(addressId));
            toast('Address Deleted Successfully!');
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
        return (<>
            <input
                className="form-check-input"
                type="radio"
                value="billing"
                name={`default_billing_${Address.id}`}
                id={`default_billing_${Address.id}`}
                checked={(Address.id === selectedBillingAddressId)}
                onChange={() => updateDefaultAddressBilling(Address.id, "billing")}
            />

            <label
                className="form-check-label"
                htmlFor={`default_billing_${Address.id}`}
                style={{ paddingTop: "2px" }}
            >
                {Label}
            </label>
        </>);
    }

    const renderDefaultShippingAddressComp = (Label, Address) => {
        return (<>
            <input
                className="form-check-input"
                type="radio"
                value="shipping"
                name={`default_shipping_${Address.id}`}
                id={`default_shipping_${Address.id}`}
                checked={(Address.id === selectedShippingAddressId)}
                onChange={() => updateDefaultAddressBilling(Address.id, "shipping")}
            />

            <label
                className="form-check-label"
                htmlFor={`default_shipping_${Address.id}`}
                style={{ paddingTop: "2px" }}
            >
                {Label}
            </label>
        </>);
    }

    const isLoading = useSelector(state => state.home.loaderStatus)

    return (
        <>
            {isLoading ? (<SiteLoader status={isLoading} />) :
                (<>
                    <main>
                        <div className="bg-light inner-breadcrumb">
                            <div className="container">
                                <div className="breadcrumb-head">
                                    <h3>Dashboard</h3>
                                </div>
                            </div>
                        </div>
                        <section className="single-wrapper section-wrapper">
                            <div className="container">
                                <div className="flexTab">
                                    {/*Sidebar*/}
                                    <ul className="nav nav-tabs d-none d-lg-block" id="actionTab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className={`nav-link ${activeTab === "dashboard" ? "active" : ""
                                                    }`}
                                                id="dashboard-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#dashboard-tab-pane"
                                                type="button"
                                                role="tab"
                                                aria-controls="dashboard-tab-pane"
                                                aria-selected={activeTab === "dashboard"}
                                                onClick={() => handleTabChange("dashboard")}
                                            >
                                                <i className="ri-dashboard-line" /> Dashboard
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className={`nav-link ${activeTab === "account" ? "active" : ""
                                                    }`}
                                                id="account-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#account-tab-pane"
                                                type="button"
                                                role="tab"
                                                aria-controls="account-tab-pane"
                                                aria-selected={activeTab === "account"}
                                                onClick={() => handleTabChange("account")}
                                            >
                                                <i className="ri-account-circle-line" /> Account Details
                                            </button>
                                        </li>
                                        {/* <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${activeTab === 'wishlist' ? 'active' : ''}`}
                                        id="wishlist-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#wishlist-tab-pane"
                                        type="button"
                                        role="tab"
                                        aria-controls="wishlist-tab-pane"
                                        aria-selected={activeTab === 'wishlist'}
                                        onClick={() => handleTabChange('wishlist')}
                                    >
                                        <i className="ri-heart-3-line" /> Wishlist
                                    </button>
                                </li> */}
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className={`nav-link ${activeTab === "orders" ? "active" : ""
                                                    }`}
                                                id="orders-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#orders-tab-pane"
                                                type="button"
                                                role="tab"
                                                aria-controls="orders-tab-pane"
                                                aria-selected={activeTab === "orders"}
                                                onClick={() => handleTabChange("orders")}
                                            >
                                                <i className="ri-shopping-cart-2-line" /> Orders
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className={`nav-link ${activeTab === "address" ? "active" : ""
                                                    }`}
                                                id="address-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#address-tab-pane"
                                                type="button"
                                                role="tab"
                                                aria-controls="address-tab-pane"
                                                aria-selected={activeTab === "address"}
                                                onClick={() => handleTabChange("address")}
                                            >
                                                <i className="ri-map-pin-user-line" /> Address
                                            </button>
                                        </li>
                                    </ul>

                                    <div className="tab-content accordion" id="dashboardAction">
                                        {/*Dashboard*/}
                                        <div className={`tab-pane fade accordion-item ${activeTab === "dashboard" ? "active show" : ""
                                            }`}
                                            id="dashboard-tab-pane"
                                            role="tabpanel"
                                            aria-labelledby="dashboard-tab"
                                            tabIndex={0}
                                        >
                                            <h2 className="accordion-header d-lg-none" id="headingOne">
                                                <button
                                                    className="accordion-button"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#dashboard"
                                                    aria-expanded="true"
                                                    aria-controls="dashboard"
                                                >
                                                    <i className="ri-dashboard-line" /> Dashboard
                                                </button>
                                            </h2>
                                            <div
                                                id="dashboard"
                                                className="accordion-collapse collapse show  d-lg-block"
                                                aria-labelledby="dashboard"
                                                data-bs-parent="#dashboardAction"
                                            >
                                                <div className="accordion-body">
                                                    <div className="row">
                                                        <div className="col-md-3">
                                                            <div className="card-dash bg-warning">
                                                                <h5 className="mb-0 text-white">
                                                                    Total <br />
                                                                    Orders
                                                                </h5>
                                                                <h1 className="mb-0 text-white">{total_orders}</h1>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="card-dash bg-success">
                                                                <h5 className="mb-0 text-white">
                                                                    Paid <br />
                                                                    Orders
                                                                </h5>
                                                                <h1 className="mb-0 text-white">{paid_orders}</h1>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="card-dash bg-orange">
                                                                <h5 className="mb-0 text-white">
                                                                    Pending <br />
                                                                    Orders
                                                                </h5>
                                                                <h1 className="mb-0 text-white">
                                                                    {pending_orders}
                                                                </h1>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="card-dash bg-danger">
                                                                <h5 className="mb-0 text-white">
                                                                    Failed <br />
                                                                    Orders
                                                                </h5>
                                                                <h1 className="mb-0 text-white">{failed_orders}</h1>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/*Account Details*/}
                                        <div className={`tab-pane fade accordion-item ${activeTab === "account" ? "active show" : ""
                                            }`}
                                            id="account-tab-pane"
                                            role="tabpanel"
                                            aria-labelledby="account-tab"
                                            tabIndex={0}
                                        >
                                            <h2 className="accordion-header d-lg-none" id="headingTwo">
                                                <button
                                                    className="accordion-button collapsed"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#accountAc"
                                                    aria-expanded="false"
                                                    aria-controls="accountAc"
                                                >
                                                    <i className="ri-account-circle-line" /> Account Details
                                                </button>
                                            </h2>
                                            <div
                                                id="accountAc"
                                                className="accordion-collapse collapse d-lg-block"
                                                aria-labelledby="headingTwo"
                                                data-bs-parent="#myTabContent"
                                            >
                                                <div className="accordion-body">
                                                    {/* <div className="profile position-relative">
                                                <div className="avatar">
                                                    {selectedImage ? (
                                                        <img src={URL.createObjectURL(selectedImage)} alt="Selected" />
                                                    ):
                                                    profile_details?.avatar ?
                                                            <img src={profile_details.avatar} title="Profile" alt="" />
                                                        :
                                                            <img src="assets/img/avatar.png" title="" alt="" />
                                                    }

                                                    <a href="#link" className="upload">
                                                        <input type="file" accept="image/png" onChange={handleImageChange} />
                                                        <i className="ri-image-add-fill" />{" "}
                                                    </a>

                                                </div>
                                            </div> */}

                                                    <div className="profile position-relative">
                                                        <div className="avatar">
                                                            {selectedImage ? (
                                                                <img
                                                                    src={URL.createObjectURL(selectedImage)}
                                                                    alt="Selected"
                                                                />
                                                            ) : profile_details?.avatar ? (
                                                                <img
                                                                    src={profile_details.avatar}
                                                                    title="Profile"
                                                                    alt=""
                                                                />
                                                            ) : (
                                                                <img src="" title="" alt="" />
                                                            )}

                                                            {updated && (
                                                                <div className="d-flex justify-content-between mb-5">
                                                                    <button
                                                                        onClick={() => uploadImag()}
                                                                        className="remove-image Profilepic_Icons"
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="20"
                                                                            height="20"
                                                                            fill="white"
                                                                            className="bi bi-check mb-1"
                                                                            viewBox="0 0 16 16"
                                                                        >
                                                                            <path
                                                                                d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                                                                        </svg>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleConfirmationModalConfirm()}
                                                                        className="remove-image Profilepic_second_Icons"
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="20"
                                                                            height="20"
                                                                            fill="white"
                                                                            className="bi bi-x mb-1"
                                                                            viewBox="0 0 16 16"
                                                                        >
                                                                            <path
                                                                                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            )}

                                                            {/* <ul className="list-unstyled m-0">
                            <li className="nav-item dropdown">
                              <a
                                className="nav-link"
                                role="button"
                                id="navbarDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <strong><img
                              src={profile_details.avatar}
                              title="Profile"
                              alt=""
                            /></strong>
                              </a>
                              <ul
                                className="dropdown-menu"
                                aria-labelledby="navbarDropdown"
                              >
                                <li>
                                  <a
                                    className="dropdown-item"
                                    spiketip-title="Your Dashboard"
                                    href="/user-dashboard"
                                    spiketip-pos="top"
                                  >
                                    My Profile
                                  </a>
                                </li>
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to="/"
                                    onClick={""}
                                  >
                                    Logout
                                  </Link>
                                </li>
                              </ul>
                            </li>
                          </ul> */}
                                                            <button
                                                                // onClick={() => handleConfirmationModalConfirm()}
                                                                className="profilePicDelete"
                                                                onClick={handleDeleteProfilePic}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="20"
                                                                    height="20"
                                                                    fill="#333"
                                                                    className="bi bi-x"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path
                                                                        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                                                </svg>
                                                            </button>

                                                            <a className="upload">
                                                                <input
                                                                    type="file"
                                                                    // accept="image/*"
                                                                    onChange={(e) => handleImageChange(e)}
                                                                />
                                                                <i className="ri-image-add-fill" />{" "}
                                                            </a>
                                                        </div>
                                                        <Modal
                                                            show={showimgModal}
                                                            onHide={handleimgModalClose}
                                                            size="lg"
                                                            aria-labelledby="contained-modal-title-vcenter"
                                                            centered
                                                        >
                                                            <Modal.Header closeButton className="border-0">
                                                                <Modal.Title>
                                                                    <p>Profile Photo</p>
                                                                </Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body className="text-center">
                                                                <img src={selectedImage} height={200} alt="" />
                                                            </Modal.Body>
                                                            <Modal.Footer className="justify-content-between">
                                                                <div></div>
                                                                <div>
                                                                    <button
                                                                        className="d-flex flex-column border-0 justify-content-center align-items-center"
                                                                        onClick={handleDeleteProfileImg}
                                                                    >
                                                                        <i className="bi bi-trash "></i>
                                                                    </button>
                                                                </div>
                                                            </Modal.Footer>
                                                        </Modal>

                                                        {/* {selectedImage && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete the current image?</p>
            <button onClick={handleConfirmationModalConfirm}>Confirm</button>
            <button onClick={handleConfirmationModalClose}>Cancel</button>
          </div>
        </div>
      )} */}
                                                    </div>

                                                    {/* end  */}
                                                    {/* details form  */}
                                                    {/* user profile start */}
                                                    <div className="row">
                                                        <form
                                                            onSubmit={(e) => {
                                                                handleSubmitform(e);
                                                            }}
                                                            style={{ "margin-bottom": "10px" }}
                                                        >
                                                            <div className="col-md-6">
                                                                <div className="form-group mb-3">
                                                                    <label htmlFor="">Full Name* </label>
                                                                    <input
                                                                        type="text"
                                                                        name="full_name"
                                                                        className="form-control"
                                                                        defaultValue={profile_details?.full_name}
                                                                    />
                                                                    {errors_profile.full_name && (
                                                                        <p className="errorpass">
                                                                            {errors_profile.full_name}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group mb-3">
                                                                    <label htmlFor="">Email*</label>
                                                                    <input
                                                                        type="text"
                                                                        name="email"
                                                                        className="form-control"
                                                                        placeholder="Enter your email"
                                                                        // readOnly
                                                                        defaultValue={email}
                                                                    />
                                                                    {errors_profile.email && (
                                                                        <p className="errorpass">
                                                                            {errors_profile.email}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group mb-3">
                                                                    <div className="row">
                                                                        <label htmlFor="">Phone*</label>
                                                                        {/* <div className="col-md-1">
                                                                <select id="country_code" defaultValue={country_code} name="country_code" ref={country_code} className="form-control" style={{ width: '62px' }}>
                                                                <option value="+91">(+91)India</option>
                                                                    <option value="+1">(+1)US</option>
                                                                    <option value="+1">(+1)CA</option>
                                                                    <option value="+82">(+82)South Korea</option>
                                                                    <option value="+27">(+27)South Africa</option>
                                                                    <option value="+61">(+61)Australia</option>
                                                                    <option value="+86">(+86)China</option>
                                                                    <option value="+33">(+33)France</option>
                                                                    <option value="+81">(+81)Japan</option>
                                                                </select>&nbsp;
                                                            </div> */}
                                                                        <div className="col-md-5">
                                                                            <input
                                                                                type="tel"
                                                                                name="mobile"
                                                                                className="form-control"
                                                                                pattern="[0-9]*"
                                                                                inputMode="numeric"
                                                                                maxLength={25}
                                                                                onChange={checkPhoneNumber}
                                                                                required
                                                                                defaultValue={profile_details?.mobile}
                                                                            />
                                                                            {errors_profile.mobile && (
                                                                                <p className="errorpass">
                                                                                    {errors_profile.mobile}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <button
                                                                disabled={state.update_profile_loader}
                                                                className="btn btn-warning btn-rounded"
                                                                type="submit"
                                                            >
                                                                {state.update_profile_loader
                                                                    ? "Updating profile..."
                                                                    : "Update Profile"}
                                                            </button>
                                                        </form>
                                                        <div className="clear:both"></div>
                                                        <hr />
                                                        <h4 className="mb-3" style={{ "padding-top": "20px" }}>
                                                            Change Password
                                                        </h4>

                                                        <div className="row">
                                                            <form
                                                                onSubmit={handleSubmitformpass}
                                                                id="changePass_form"
                                                            >
                                                                <div className="row">
                                                                    <div className="col-md-12">
                                                                        <div className="form-group mb-3">
                                                                            <label htmlFor="">Current Password</label>
                                                                            <input
                                                                                type="password"
                                                                                name="old_password"
                                                                                placeholder="Old Password"
                                                                                className="form-control"
                                                                            />
                                                                            {errors_profile_pass.old_password && (
                                                                                <p className="errorpass">
                                                                                    {errors_profile_pass.old_password}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <div className="form-group mb-3">
                                                                            <label htmlFor="">New password</label>
                                                                            <div className="password-field">
                                                                                <input
                                                                                    type="password"
                                                                                    name="new_password"
                                                                                    placeholder="New Password"
                                                                                    className="form-control"
                                                                                    id="password"
                                                                                />
                                                                            </div>
                                                                            {errors_profile_pass.new_password && (
                                                                                <p className="errorpass">
                                                                                    {errors_profile_pass.new_password}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <div className="form-group mb-3">
                                                                            <label htmlFor="">Confirm new
                                                                                password</label>
                                                                            <input
                                                                                type="password"
                                                                                name="cnf_new_pass"
                                                                                placeholder="Confirm new password"
                                                                                className="form-control"
                                                                            />
                                                                            {errors_profile_pass.cnf_new_pass && (
                                                                                <p className="errorpass">
                                                                                    {errors_profile_pass.cnf_new_pass}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <>{changePassFun()}</>
                                                                </div>

                                                                <button
                                                                    disabled={state.update_password_loader}
                                                                    className="btn btn-warning btn-rounded"
                                                                    type="submit"
                                                                >
                                                                    {state.update_password_loader
                                                                        ? "Updating password..."
                                                                        : "Update Password"}
                                                                </button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                    {/* user profile end */}
                                                </div>
                                            </div>
                                        </div>

                                        {/*Orders*/}
                                        <div
                                            className={`tab-pane fade accordion-item ${activeTab === "orders" ? "active show" : ""}`}
                                            id="orders-tab-pane"
                                            role="tabpanel"
                                            aria-labelledby="orders-tab"
                                            tabIndex={0}
                                        >
                                            <h2 className="accordion-header d-lg-none" id="ordersAc">
                                                <button
                                                    className="accordion-button collapsed"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#ordersAc"
                                                    aria-expanded="false"
                                                    aria-controls="wishlistAc"
                                                >
                                                    <i className="ri-shopping-cart-2-line" /> Orders
                                                </button>
                                            </h2>
                                            <div
                                                id="ordersAc"
                                                className="accordion-collapse collapse d-lg-block"
                                                aria-labelledby="ordersAc"
                                                data-bs-parent="#ordersAc"
                                            >
                                                <div className="accordion-body">
                                                    <table className="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">#</th>
                                                                <th scope="col">Order</th>
                                                                <th scope="col">Date</th>
                                                                <th scope="col">Status</th>
                                                                <th scope="col">Total</th>
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
                                                                        <span
                                                                            className="order-span"
                                                                            order_id={order.order_id}
                                                                            key={order.order_id}
                                                                            onClick={() => handleOrderClick(order)}
                                                                            style={{ cursor: "pointer" }}
                                                                        >
                                                                            <td style={{ paddingTop: "10px" }}>
                                                                                {order.order_id}
                                                                            </td>
                                                                        </span>
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
                                                </div>
                                            </div>
                                        </div>

                                        {/*Address*/}
                                        <div
                                            className={`tab-pane fade accordion-item ${activeTab === "address" ? "active show" : ""}`}
                                            id="address-tab-pane"
                                            role="tabpanel"
                                            aria-labelledby="address-tab"
                                            tabIndex={0}
                                        >
                                            <h2 className="accordion-header d-lg-none" id="addressAc">
                                                <button
                                                    className="accordion-button collapsed"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#addressAc"
                                                    aria-expanded="false"
                                                    aria-controls="addressAc"
                                                >
                                                    <i className="ri-map-pin-user-line" /> Address
                                                </button>
                                            </h2>
                                            <div
                                                id="addressAc"
                                                className="accordion-collapse collapse d-lg-block"
                                                aria-labelledby="addressAc"
                                                data-bs-parent="#addressAc"
                                            >
                                                <div className="accordion-body">
                                                    {/* address  */}
                                                    <div className="flex-heading mb-4">
                                                        <h4>Address</h4>
                                                        {/* <a
                                                          href="#link"
                                                          className="btn btn-warning"
                                                          data-bs-toggle="modal"
                                                          data-bs-target="#addAddress"
                                                        > */}
                                                        <Link
                                                            onClick={handleAddAddressModal}
                                                            className="btn btn-warning"
                                                            to='#'
                                                        >
                                                            <i className="ri-add-line" /> Add Address
                                                        </Link>

                                                        {/* </a> */}
                                                        {/* Modal */}
                                                        <Modal show={showModal}
                                                            onHide={handleModalClose}
                                                            size="lg" aria-labelledby="contained-modal-title-vcenter"
                                                            centered
                                                        >
                                                            <Modal.Header closeButton>
                                                                <Modal.Title>
                                                                    <h5 className="modal-title" id="addAddressLabel">
                                                                        {editAddress ? "Update" : "Add"} Address
                                                                    </h5>
                                                                </Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body>
                                                                <div className="container">
                                                                    <div className="row">
                                                                        <div className="col-md-12 login-wrap">
                                                                            <form onSubmit={handelSubmit}>
                                                                                <div className="row">
                                                                                    <div
                                                                                        className="col-md-6 form-group mb-3">
                                                                                        <label
                                                                                            htmlFor="name">Name</label>
                                                                                        <input type="text"
                                                                                            name="name"
                                                                                            maxLength={50}
                                                                                            onChange={handleChangeUpdate}
                                                                                            className="form-control"
                                                                                            placeholder="Your Full Name"
                                                                                            defaultValue={userAddress.name}
                                                                                        />
                                                                                        <p className="register_error">{errors.name}</p>
                                                                                    </div>

                                                                                    <div
                                                                                        className="col-md-6 form-group mb-3">
                                                                                        <label htmlFor="street_address">Street
                                                                                            Address</label>
                                                                                        <input
                                                                                            type="text"
                                                                                            name="street_address"
                                                                                            onChange={handleChangeUpdate}
                                                                                            className="form-control"
                                                                                            placeholder="Address"
                                                                                            defaultValue={userAddress.street_address}
                                                                                        />
                                                                                        <p className="register_error">{errors.street_address}</p>
                                                                                    </div>

                                                                                    <div
                                                                                        className="col-md-6 form-group mb-3">
                                                                                        <label
                                                                                            htmlFor="country">Country</label>
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
                                                                                        <p className="register_error">{errors.country}</p>
                                                                                    </div>

                                                                                    <div
                                                                                        className="col-md-6 form-group mb-3">
                                                                                        <label
                                                                                            htmlFor="city">City</label>
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

                                                                                    <div
                                                                                        className="col-md-6 form-group mb-3">
                                                                                        <label
                                                                                            htmlFor="state">State</label>
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

                                                                                    <div
                                                                                        className="col-md-6 form-group mb-3">
                                                                                        <label
                                                                                            htmlFor="postcode">Zipcode</label>
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

                                                                                    <div
                                                                                        className="col-md-12 form-group mb-3">
                                                                                        <label htmlFor="phone">Phone
                                                                                            Number</label>
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

                                                                                    <div
                                                                                        className="col-md-12 center-btn">
                                                                                        <button
                                                                                            type='submit'
                                                                                            disabled={state.loaderStatus}
                                                                                            className="btn btn-sm btn-warning w-50"
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
                                                            {addressList && addressList.length > 0
                                                                ? addressList.map((address) => {
                                                                    return (
                                                                        <div>
                                                                            {/* <SiteLoader status={state.loaderStatus} /> */}
                                                                            <div className="p-4"
                                                                                style={{
                                                                                    border: "1px solid #eee",
                                                                                    padding: "10px 10px 10px 10px",
                                                                                }}
                                                                            >
                                                                                <h4 className="text-xl font-medium">
                                                                                    {address?.name}

                                                                                    <div
                                                                                        onClick={() => onAddressEdit(address)}
                                                                                        style={{
                                                                                            float: "right",
                                                                                            fontSize: "20px",
                                                                                        }}>
                                                                                        <i
                                                                                            className="bi bi-pen"
                                                                                            style={{
                                                                                                marginRight: "40px",
                                                                                                color: "blue",
                                                                                                cursor: "pointer",
                                                                                            }}
                                                                                        ></i>
                                                                                        <i
                                                                                            className="bi bi-trash"
                                                                                            style={{
                                                                                                color: "red",
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

                                                                                <Container style={{
                                                                                    display: "flex",
                                                                                    alignItems: "center",
                                                                                }}>

                                                                                    <div style={{
                                                                                        display: "inline-flex",
                                                                                        columnGap: "15px"
                                                                                    }}>
                                                                                        {renderDefaultBillingAddressComp('Default Billing Address', address)}

                                                                                        {renderDefaultShippingAddressComp('Default Shipping Address', address)}
                                                                                    </div>
                                                                                </Container>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })
                                                                : <Alert color="info" className="bg-white shadow-md">No
                                                                    any Address found!</Alert>
                                                            }

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
                            </div>
                        </section>
                        <hr />
                        {/* clients  */}
                    </main>
                    <a href="#" className="back-to-top d-flex align-items-center justify-content-center">
                        <i className="bi bi-arrow-up-short" />
                    </a>
                </>)
            }
        </>
    );
};

export default UserDashboard;
