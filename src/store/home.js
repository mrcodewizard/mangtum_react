import { createSlice } from "@reduxjs/toolkit";
import { mgtApi } from "./axios";
import { toast } from "react-toastify";
import { productActions } from "./product";

//show the loader
let data = JSON.parse(localStorage.getItem("userDetails"));
let user_id = data?.ID;

const initialState = {
  search_item: null,
  search_page: 1,
  search_total: 0,
  filters: [],
  navMenu: [],
  loaderStatus: false,
  Aboutus: [],
  Faq: [],
  tmc: [],
  Privacypolicy: [],
  headerCategories: [],
  Banner: [],
  homepage_data: [],
  Services: [],
  Popular: [],
  editorpics_one: {},
  editorpics_two: {},
  editorpics_three: {},
  editorpics_four: {},
  editorpics_five: {},
  editorpics_category_one: [],
  editorpics_category_two: [],
  editorpics_category_three: [],
  editorpics_category_four: [],
  editorpics_category_five: [],
  Bestseller: [],
  search_array: [],
  searchstatus: false,
  cartrecords: [],
  Changepassword_fail: [],
  user_Address: {
    user_id: user_id,
    name: "",
    phone: "",
    street_address: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
    address_for: "",
  },
  userAddress: [],
  Subscribe: [],
  Helptop: [],
  cartArr: [],
  cartStatus: false,
  Country: [],
  addAddressStatus: false,
  addressList: [],
  allOrder: [],
  allmeta: [],
  Topbar: [],
  add_status: false,
  adressFor_status: {},
  userOrderDetail: [],
  orderSt: [],
  Updateuserprofile: [],
  Changepassword: [],
  deleteuseradd: [],
  home_array: [],
  user_profile: [],
  states_list: {},
  total_orders: 0,
  paid_orders: 0,
  pending_orders: 0,
  failed_orders: 0,
  loader: false,
  update_profile_loader: false,
  update_password_loader: false,

  //
  headerData: {},
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setHeaderData(state, action) {
      state.headerData = action.payload;
    },

    getNavMenu(state, action) {
      state.navMenu = action.payload;
    },
    getHomeData(state, action) {
      state.data = action.payload;
      // state.loaderStatus = action.payload.loaderStatus;
    },
    headerCategoriesSuccess(state, action) {
      state.headerCategories = action.payload;
    },
    headerCategoriesFailure(state, action) {
      state.headerCategories = [];
    },
    privacyPolicySuccess(state, action) {
      state.Privacypolicy = action.payload;
    },
    updateLoaderStatus(state, action) {
      state.loaderStatus = action.payload;
    },
    AboutusSuccess(state, action) {
      state.Aboutus = action.payload;
    },
    tmcSuccess(state, action) {
      state.tmc = action.payload;
    },
    FaqSuccess(state, action) {
      state.Faq = action.payload;
    },
    updatePageNumber(state, action) {
      state.search_page = action.payload.page;
      state.search_item = action.payload.search_item;
    },
    searchSuccess(state, { payload }) {
      state.searchstatus = true;
      state.search_array = payload.products;
      state.search_total = payload.total_page;
      state.filters = {
        filters: payload.filters,
        min_max_price: payload.min_max_price,
        parent_categories: payload.parent_categories,
      };
    },
    searchFailure(state, action) {
      state.searchstatus = false;
      state.loaderStatus = false;
      state.search_array = [];
      state.search_total = 0;
    },
    setSearchStatus(state, action) {
      state.searchstatus = false;
    },

    updatesubscribe(state, action) {
      let field_name = action.payload.field; //uname
      let field_value = action.payload.value; // Pramodini
      state.subscribe[field_name] = field_value;
    },
    HelptopSuccess(state, action) {
      state.Helptop = action.payload;
    },
    fetchcartList(state, action) {
      state.cartArr = action.payload;
      state.cartStatus = true;
    },
    nocartFound(state, action) {
      state.cartStatus = false;
    },
    CountrySuccess(state, action) {
      state.Country = action.payload;
    },
    userAddressSuccess(state, action) {
      state.addAddressStatus = true;
      state.userAddress = action.payload;
    },
    userAddressFailure(state, action) {
      state.loginStatus = false;
      state.loginError = action.payload;
    },
    setAddressesList(state, action) {
      state.addressList = action.payload;
    },
    validateAddressForm(state, action) {
      let field_name = action.payload.field; //uname
      let field_value = action.payload.value; //pramodini
      state.user_Address[field_name] = field_value;
    },
    allOrders(state, action) {
      state.allOrder = action.payload.all_orders;
      state.total_orders = action.payload.total_orders;
      state.paid_orders = action.payload.paid_orders;
      state.pending_orders = action.payload.pending_orders;
      state.failed_orders = action.payload.failed_orders;
    },
    metaResponse(state, action) {
      state.allmeta = action.payload;
    },
    getTopbarSuccess(state, action) {
      state.Topbar = action.payload;
    },
    getTopbarFailure(state, action) {
      state.Topbar = action.payload;
    },
    addressUpdate_user(state, action) {
      state.add_status = true;
    },
    addressUpdate_failuser(state, action) {
      state.add_status = false;
    },
    addressfor_status(state, action) {
      state.adressFor_status = action.payload.address_for;
    },
    userOrderDetails(state, action) {
      state.userOrderDetail = action.payload;
    },
    orderResponse(state, action) {
      state.orderSt = action.payload;
    },
    checkSubscribeSuccess(state, action) {
      state.Subscribe = action.payload;
    },
    checkSubscribeFailure(state, action) {
      state.Subscribe = action.payload;
    },
    UpdateUserProfileSuccess(state, action) {
      state.Updateuserprofile = action.payload;
    },
    UpdateChangepasswordSuccess(state, action) {
      state.Changepassword = action.payload;
    },

    UpdateChangepasswordFailure(state, action) {
      state.Changepassword = "";
      state.Changepassword_fail = action.payload;
    },
    updatepassStatus(state, action) {
      state.Changepassword = [];
      state.Changepassword_fail = [];
    },
    home_rec(state, action) {
      state.home_array = action.payload;
      //console('ddd',action.payload);
    },
    userprofile(state, action) {
      state.user_profile = action.payload;
    },
    updateUserAddressDetails(state, action) {
      state.user_Address = action.payload;
    },
    updateStatesList(state, action) {
      state.states_list = action.payload;
    },
    profileUpdateStart(state, action) {
      state.update_profile_loader = true;
    },
    profileUpdateStop(state, action) {
      state.update_profile_loader = false;
    },
    changePasswordLoaderStart(state, action) {
      state.update_password_loader = true;
    },
    changePasswordLoaderStop(state, action) {
      state.update_password_loader = false;
    },
  },
});

export default homeSlice.reducer;

export const pagination = (search_item, page) => {
  return async (dispatch) => {
    try {
      await mgtApi
        .post("/productsearch", { keyword: search_item, page: page })
        .then((response) => {
          if (response.data.products.length > 0) {
            dispatch(homeActions.searchSuccess(response.data, page));
            dispatch(
              homeActions.updatePageNumber({
                search_item: search_item,
                page: page,
              })
            );
          } else {
          }
        });
    } catch (e) {
      return;
    }
  };
};

export const fetchNavMenu = () => {
  return async (dispatch) => {
    try {
      await mgtApi.get("header-categories").then((response) => {
        if (response.data.status === "success") {
          dispatch(homeActions.getNavMenu(response.data.data));
        }
      });
    } catch (e) {
      return;
    }
  };
};

export const getAboutus = () => {
  return async (dispatch) => {
    dispatch(homeActions.updateLoaderStatus(true));
    try {
      await mgtApi.post("/about-us").then((response) => {
        if (response.data.status === "success") {
          dispatch(homeActions.AboutusSuccess(response.data));
        }
        if (response.data.status === "error") {
          dispatch(homeActions.AboutusFailure(response.data.msg));
        }
        dispatch(homeActions.updateLoaderStatus(false));
      });
    } catch (e) {
      return;
    }
  };
};

export const getFaq = () => {
  return async (dispatch) => {
    dispatch(homeActions.updateLoaderStatus(true));
    try {
      await mgtApi.get("/faq").then((response) => {
        if (response.data.status == "success") {
          dispatch(homeActions.FaqSuccess(response.data.data));
        }
        if (response.data.status == "error") {
          dispatch(homeActions.FaqFailure(response.data.msg));
        }
        dispatch(homeActions.updateLoaderStatus(false));
      });
    } catch (e) {
      return;
    }
  };
};

export const getCategories = () => {
  return async (dispatch) => {
    try {
      await mgtApi.get("/header-categories").then((res) => {
        if (res.data.status === "success") {
          dispatch(homeActions.headerCategoriesSuccess(res.data.data));
        }
        if (res.data.status === "error") {
          dispatch(homeActions.headerCategoriesFailure(res.data.msg));
        }
      });
    } catch (e) {
      return;
    }
  };
};

export const getPrivacypolicy = () => {
  return async (dispatch) => {
    dispatch(homeActions.updateLoaderStatus(true));

    try {
      await mgtApi.get("/tncPrivacy").then((response) => {
        if (response.data.status === "success") {
          dispatch(
            homeActions.privacyPolicySuccess(response.data.data.privacy)
          );
          dispatch(homeActions.tmcSuccess(response.data.data.terms));
        }
        if (response.data.status === "error") {
          dispatch(homeActions.privacyPolicyFailure(response.data.msg));
        }
        dispatch(homeActions.updateLoaderStatus(false));
      });
    } catch (e) {
      return;
    }
  };
};

export const getHomepage = () => {
  return async (dispatch) => {
    dispatch(homeActions.updateLoaderStatus(true));
    try {
      await mgtApi.get("/homepage").then((response) => {
        dispatch(homeActions.home_rec(response.data, { loaderStatus: false }));
      });
      dispatch(homeActions.updateLoaderStatus(false));
    } catch (e) {
      return;
    }
  };
};
export const getProfile = () => {
  return async (dispatch) => {
    try {
      await mgtApi.get("/profile").then((response) => {
        dispatch(homeActions.userprofile(response.data?.data));
      });
    } catch (e) {
      return;
    }
  };
};

export const getSearch_products = (search, page) => {
  return async (dispatch) => {
    dispatch(homeActions.updatePageNumber({ search_item: search, page: page }));
    dispatch(homeActions.updateLoaderStatus(true));
    dispatch(productActions.setCategoryId(""));
    dispatch(productActions.setSubCategoryId(""));
    console.log("again cll");
    try {
      await mgtApi
        .post(
          `/productsearch?keyword=${search}&price_between=1,1000&page=${page}`
        )
        .then((response) => {
          if (response.data.status === "success") {
            dispatch(productActions.setTotal_page(response?.data?.total_page));
            dispatch(productActions.setClearProducts(response?.data?.products));
            dispatch(productActions.updateLoaderStatus(false));
            dispatch(
              homeActions.searchSuccess(response.data, page, {
                loaderStatus: false,
              })
            );
          } else {
            dispatch(homeActions.searchFailure([]));
          }
          dispatch(productActions.updateLoaderStatus(false));
          dispatch(homeActions.updateLoaderStatus(false));
        });
    } catch (e) {
      return;
    }
  };
};

export const setStatusFalse = (input) => {
  return async (dispatch) => {
    try {
      dispatch(homeActions.setSearchStatus(input));
    } catch (e) {
      return;
    }
  };
};

export const manageAddressField = (input) => {
  return async (dispatch) => {
    try {
      dispatch(homeActions.validateAddressForm(input));
    } catch (e) {
      return;
    }
  };
};

export const checkSubscribe = (formData) => {
  return async (dispatch) => {
    try {
      await mgtApi.post("/subscribe", formData).then((response) => {
        //console('asdf',response.data.errors);
        if (response.data.status === "success") {
          // toast(response.data.msg);
          toast("Subscription successfully Added");

          dispatch(homeActions.checkSubscribeSuccess(response.data.data));

          // dispatch(homeActions.UpdateUserProfileSuccess(response.data.msg))
        }
        if (response.data.errors) {
          dispatch(homeActions.checkSubscribeFailure(response.data.message));
        }
      });
    } catch (e) {
      debugger;
      toast(e.response.data.errors.email[0]);

      return;
    }
  };
};
export const getHelptop = () => {
  return async (dispatch) => {
    try {
      await mgtApi.get("/help-topic").then((response) => {
        if (response.data.status == "success") {
          dispatch(homeActions.HelptopSuccess(response.data.data));
        }
        if (response.data.status == "error") {
          dispatch(homeActions.HelptopFailure(response.data.msg));
        }
      });
    } catch (e) {
      return;
    }
  };
};

export const getMycartList = () => {
  return async (dispatch) => {
    try {
      const response = await mgtApi.get("/list-cart");
      if (response.data.cart.length > 0) {
        dispatch(homeActions.fetchcartList(response.data.cart));
      } else {
        dispatch(homeActions.nocartFound());
      }
    } catch (error) {}
  };
};

export const getCountry = () => {
  return async (dispatch) => {
    try {
      await mgtApi.get("/countries-list").then((response) => {
        if (response.data.status === "success") {
          dispatch(homeActions.CountrySuccess(response.data.data));
        }

        if (response.data.status === "error") {
          dispatch(homeActions.CountryFailure(response.data.msg));
        }
      });
    } catch (e) {
      return;
    }
  };
};

export const storeuseraddress = (input) => {
  return async (dispatch) => {
    try {
      await mgtApi.post("/add-address", input).then((response) => {
        if (response.data.status == "success") {
          dispatch(homeActions.userAddressSuccess(response.data.data));
          dispatch(getUserAddresses());
        }
        if (response.data.status == "error") {
          dispatch(homeActions.userAddressFailure(response.data.msg));
        }
      });
    } catch (e) {
      return;
    }
  };
};

export const fetchOrderDetails = (payload) => {
  return async (dispatch) => {
    try {
      await mgtApi.get("/user-orders").then((response) => {
        if (response.data.status == "ok") {
          let total_orders = response.data?.orders?.length;
          let paid_orders = 0;
          let pending_orders = 0;
          let failed_orders = 0;
          response.data.orders.map((item) => {
            if (
              item.order_status === "Processing" ||
              item.order_status === "Ordered"
            ) {
              pending_orders += 1;
            }
            if (item.order_status === "Payment Failed") {
              failed_orders += 1;
            }
            if (
              item.order_status === "Shipped" ||
              item.order_status === "Delivered"
            ) {
              paid_orders += 1;
            }
          });
          dispatch(
            homeActions.allOrders({
              all_orders: response.data.orders,
              total_orders: total_orders,
              paid_orders: paid_orders,
              pending_orders: pending_orders,
              failed_orders: failed_orders,
            })
          );
        }
      });
    } catch (e) {}
  };
};

export const get_meta = (page) => {
  return async (dispatch) => {
    try {
      await mgtApi
        .post("/get-meta-data", { page_slug: page })
        .then((response) => {
          if (response.data.status == "ok") {
            dispatch(homeActions.metaResponse(response.data));
          }
        });
    } catch (e) {}
  };
};

export const getTopbar = () => {
  return async (dispatch) => {
    try {
      await mgtApi.get("/topbar-data").then((response) => {
        if (response.data.status == "ok") {
          dispatch(homeActions.getTopbarSuccess(response.data));
        }
        if (response.data.status == "error") {
          dispatch(homeActions.getTopbarFailure(response.data.msg));
        }
      });
    } catch (e) {
      return;
    }
  };
};

export const fetchUserOrderDetails = (orderId) => {
  return async (dispatch) => {
    try {
      await mgtApi
        .post("/user-order-details", { order_id: orderId })
        .then((response) => {
          if (response.data.status == "ok") {
            response.data.loader_status = false;
            dispatch(homeActions.userOrderDetails(response.data));
          }
        });
    } catch (e) {}
  };
};

export const fetchOrderStatus = (page) => {
  return async (dispatch) => {
    try {
      await mgtApi.get("/user-orders").then((response) => {
        if (response.data.status == "ok") {
          dispatch(homeActions.orderResponse(response.data));
        }
      });
    } catch (e) {}
  };
};

export const getUpdateuserprofile = (formData) => {
  return async (dispatch) => {
    dispatch(homeActions.profileUpdateStart());
    let isFormDataPresent = false;
    if (formData) {
      mgtApi.defaults.headers["Content-Type"] = "multipart/form-data";
      isFormDataPresent = true;
    }

    try {
      for (const [key, value] of formData.entries()) {
        // console.log(key, value, "heyyy");
      }
      await mgtApi.post("update-user-profile", formData).then((response) => {
        if (response.data.status === "success") {
          dispatch(homeActions.UpdateUserProfileSuccess(response.data.msg));
          // dispatch(homeActions.UpdateUserProfileSuccess(response.data.msg))
        }
        if (response.data.status === "error") {
          dispatch(homeActions.UpdateUserProfileFailure(response.data.msg));
        }
        dispatch(homeActions.profileUpdateStop());
      });
    } catch (e) {
      dispatch(homeActions.profileUpdateStop());
      return;
    } finally {
      // Reset the Content-Type header to "application/json" after the API call
      if (isFormDataPresent) {
        mgtApi.defaults.headers["Content-Type"] = "application/json";
        isFormDataPresent = false;
      }
    }
  };
};

export const getChangepassword = (formData) => {
  return async (dispatch) => {
    dispatch(homeActions.changePasswordLoaderStart());
    try {
      await mgtApi.post("change-password", formData).then((response) => {
        if (response.data.status === "ok") {
          dispatch(homeActions.UpdateChangepasswordSuccess(response.data));
          // dispatch(homeActions.UpdateUserProfileSuccess(response.data.msg))
        }
        if (response.data.status === "nok") {
          dispatch(homeActions.UpdateChangepasswordFailure(response.data));
        }
        dispatch(homeActions.changePasswordLoaderStop());
      });
    } catch (e) {
      dispatch(homeActions.changePasswordLoaderStop());
      return;
    }
  };
};

export const getUserAddresses = (input) => {
  return async (dispatch) => {
    dispatch(homeActions.updateLoaderStatus(true));

    try {
      const response = await mgtApi.get("/get-address", input);
      if (response.data.status === "success") {
        const addresses = response.data.data.address;
        // console.log("Address: ", addresses);
        dispatch(homeActions.setAddressesList(addresses));
        dispatch(homeActions.updateLoaderStatus(false));
      } else {
        dispatch(homeActions.setAddressesList([]));
        dispatch(homeActions.updateLoaderStatus(false));
      }
    } catch (e) {
      // console.log("Error!: ", e);
      dispatch(homeActions.updateLoaderStatus(false));
    }
  };
};

export const updateAddressFor = (id, address_for) => {
  return async (dispatch) => {
    try {
      await mgtApi
        .post("/update-address-type", { address_for, id })
        .then((response) => {
          // console.log("response: ", response);
          // if (response.data.status === "success") {
          //   dispatch(homeActions.addressUpdate_user(response.data.status, address_for));
          //   dispatch(homeActions.addressfor_status(address_for));
          // } else {
          //   dispatch(homeActions.addressUpdate_failuser(false));
          // }
        });
    } catch (e) {
      // console.log("Error: ", e);
    }
  };
};

export const deleteUserAddress = (payload) => {
  return async (dispatch, getState) => {
    dispatch(homeActions.updateLoaderStatus(true));

    let id = payload;
    try {
      // only for Testing Loader
      // setTimeout(()=>{
      //   dispatch(homeActions.updateLoaderStatus(false));
      // }, 2000);
      const res = await mgtApi.post("/delete-address", { id });
      if (res.data.status === "success") {
        // console.log("Deleted Successfully!");
        const currentState = getState();
        const newAddresses = currentState.home.addressList.filter(
          (address) => address.id !== id
        );
        await dispatch(homeActions.setAddressesList(newAddresses));
        dispatch(homeActions.updateLoaderStatus(false));
      }
    } catch (e) {
      // console.log("Error while deleting Address: ", e);
    }
  };
};

export const getStatesList = (countryId) => {
  return async (dispatch) => {
    try {
      await mgtApi
        .post("/states-list", { country_id: countryId })
        .then((res) => {
          if (res.data.status === "success") {
            dispatch(homeActions.updateStatesList(res.data.data));
          }
        });
    } catch (e) {
      return;
    }
  };
};
export const deleteProfilePic = (email, setSelectedImage) => {
  return async (dispatch) => {
    try {
      await mgtApi.post("/remove-user-image", { email: email }).then((res) => {
        if (res.data.status === "success") {
          toast(res.data.msg);
        }
      });
    } catch (e) {
      // debugger;
      return;
    }
  };
};

export const getAddressDetails = (address) => {
  return async (dispatch) => {
    try {
      dispatch(homeActions.updateUserAddressDetails(address));
    } catch (e) {
      // console.log("Error while getting Address Details: ", e);
    }
  };
};

export const saveUserAddress = (input) => {
  return async (dispatch) => {
    dispatch(homeActions.updateLoaderStatus(true));
    try {
      let res = await mgtApi.post("/add-address", input);

      if (res.data.status === "success") {
        await dispatch(getUserAddresses());
      }

      dispatch(homeActions.updateLoaderStatus(false));
    } catch (e) {
      dispatch(homeActions.updateLoaderStatus(false));
      // console.log("Error while creating user Address!", e);
    }
  };
};

export const updateAddressDetails = (address) => {
  return async (dispatch) => {
    dispatch(loaderStart());
    try {
      let addr = { ...address };
      delete addr.is_billing;
      delete addr.is_shipping;
      // let res = await mgtApi.post('/updateAddress-Web', addr)
      let res = await mgtApi.post("/update-address", addr);

      dispatch(getUserAddresses());
      dispatch(loaderStop());
    } catch (e) {
      dispatch(loaderStop());
      //console('error', e)
      return;
    }
  };
};

export const updateProfileImage = (file, user_id) => {
  return async (dispatch) => {
    let isFormDataPresent = false;

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("user_id", user_id);

      // Send a POST request to your server to upload the image
      if (formData) {
        mgtApi.defaults.headers["Content-Type"] = "multipart/form-data";
        isFormDataPresent = true;
      }
      await mgtApi
        .post("/update-user-avatar", formData)
        .then((response) => {
          // Handle successful upload
          //console('Image uploaded successfully');
          toast(response.data.msg);
        })
        .catch((error) => {
          // Handle error
          console.error("Error uploading image:", error);
        });
    } catch (e) {
      //console('error', e)
      return;
    } finally {
      // Reset the Content-Type header to "application/json" after the API call
      if (isFormDataPresent) {
        mgtApi.defaults.headers["Content-Type"] = "application/json";
        isFormDataPresent = false;
      }
    }
  };
};

// updateAddress-Web

export const loaderStart = () => {
  return async (dispatch) => {
    dispatch(homeActions.updateLoaderStatus(true));
  };
};

export const loaderStop = () => {
  return async (dispatch) => {
    dispatch(homeActions.updateLoaderStatus(false));
  };
};
export const setPassStatus = () => {
  return async (dispatch) => {
    dispatch(homeActions.updatepassStatus());
  };
};

export const getHeaderData = (payload) => {
  return async (dispatch) => {
    let user_id = payload.user_id;
    try {
      const res = await mgtApi.post("/home", { user_id });
      if (res.data.status === 1) {
        dispatch(homeActions.setHeaderData(res.data));
      }
    } catch (e) {
      // console.log("Error while getting headerData: ", e);
    }
  };
};

export const homeActions = homeSlice.actions;
