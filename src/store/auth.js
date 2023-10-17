import { createSlice } from "@reduxjs/toolkit";
import { mgtApi } from "./axios";

//show the loader

let userDetails = localStorage.getItem("userDetails");
const userObj = JSON.parse(userDetails);

const initialState = {
  userDetails: userObj,
  loginErrormsg: false,
  username: userObj?.username,
  logoutSuccess: false,
  logoutFailure: false,
  loginStatus: false,
  loginError: false,
  registerError: false,
  registerStatus: false,
  data: [],
  loaderStatus: [],
  page_name: "register",
  form_fields: {
    full_name: "",
    email: "",
    mobile: "",
    password: "",
    cpassword: "",
  },
  login: { email: "", password: "" },
  logout: {},
  passcode: { otp_key: "" },
  OtpError: false,
  OtpStatus: false,
  otpMesg: [],
  alreadyRegister: false,
  forgotPassword: { email: "" },
  forgetPass: { email: "" },
  forgotPasswordMsg: false,
  resetPassword: { password: "", cpassword: "" },
  contactSuccess: false,
  contactFailure: false,
  contactStatus: false,
  contactError: false,
  contactErrormsg: false,
  contact_field: { name: "", email: "", mobile: "", query: "" },
  change_pass: false,
  forgoPasswordErr: false,
  loader: false,
  userData: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    getHomeData(state, action) {
      state.data = action.payload;
      state.loaderStatus = action.payload.loaderStatus;
    },

    updatepagename(state, action) {
      state.page_name = action.payload;
    },
    updateformfields(state, action) {
      let field_name = action.payload.field; //uname
      let field_value = action.payload.value; // Pramodini
      state.form_fields[field_name] = field_value;
    },
    registerSuccess(state, action) {
      state.registerStatus = true;
      state.registerError = false;
      //state.alreadyRegister = false
      state.registerMsg = action.payload;
    },
    registerFailure(state, action) {
      state.registerStatus = false;
      state.alreadyRegister = true;
      state.registerError = action.payload;
    },
    verifyOTPpasscode(state, action) {
      let field_name = action.payload.field;
      let field_value = action.payload.value;
      state.passcode[field_name] = field_value;
    },
    OTPWithSuccess(state, action) {
      state.OtpStatus = true;

      state.otpMesg = action.payload;
    },
    OTPWithError(state, action) {
      state.OtpStatus = false;
      state.otpMesg = action.payload;
    },
    updateloginfields(state, action) {
      let field_name = action.payload.field; //uname
      let field_value = action.payload.value; // Pramodini
      state.login[field_name] = field_value;
    },
    updateReset_fields(state, action) {
      let field_name = action.payload.field; //uname
      let field_value = action.payload.value; // Pramodini
      state.resetPassword[field_name] = field_value;
    },

    validateForgotpass_fields(state, action) {
      let field_name = action.payload.field; //uname
      let field_value = action.payload.value; // Pramodini
      state.forgetPass[field_name] = field_value;
    },
    loginSuccess(state, action) {
      state.loginStatus = true;
      state.loginError = false;
      state.OtpStatus = false;
      state.userDetails = action.payload;
      state.username = action.payload?.username;
    },
    loginFailure(state, action) {
      state.loginStatus = false;
      state.loginError = action.payload;
      state.loginErrormsg = true;
    },
    logoutSuccess(state, action) {
      state.logoutStatus = true;
      state.logoutError = false;
      state.userDetails = action.payload;
    },
    logoutFailure(state, action) {
      state.logoutStatus = false;
      state.logoutError = action.payload;
    },
    updateAlreadyRegistered(state, action) {
      state.alreadyRegister = false;
    },

    update_msg_login(state, action) {
      state.loginErrormsg = false;
    },
    forgotPasswordSuccess(state, action) {
      state.forgotPasswordMsg = true;
      // state.loginError = false
      state.userDetails = action.payload;
      state.forgoPasswordErr = null;
      // state.username = action.payload?.username
    },
    forgotPasswordFailure(state, action) {
      state.forgotPasswordMsg = false;
      state.forgoPasswordErr = action.payload;
      state.loginErrormsg = true;
    },
    resetPasswordSuccess(state, action) {
      state.change_pass = true;
      // state.loginError = false
      // state.userDetails = action.payload
      // state.username = action.payload?.username
    },
    resetPasswordFailure(state, action) {
      state.change_pass = false;
    },
    contactSuccess(state, action) {
      state.contactStatus = true;
      state.contactError = false;
      // state.userDetails = action.payload
      // state.username = action.payload?.username
    },
    contactFailure(state, action) {
      state.contactStatus = false;
      state.contactError = action.payload;
      state.contactErrormsg = true;
    },
    updateContactformfields(state, action) {
      let field_name = action.payload.field; //uname
      let field_value = action.payload.value; // Pramodini
      state.contact_field[field_name] = field_value;
    },
    loaderStart(state, action) {
      state.loader = true;
    },
    loaderStop(state, action) {
      state.loader = false;
    },
    setUserData(state, action) {
      state.userData = action.payload;
    },
  },
});

export const { setUserData } = authSlice.actions;

export const authActions = authSlice.actions;


export const fetchHomeData = () => {
  return async (dispatch) => {
    try {
      await mgtApi.get("homepage").then((response) => {
        dispatch(
          authActions.getHomeData(response.data.data, { loaderStatus: false })
        );
      });
    } catch (e) {
      return;
    }
  };
};

export const updatepage = () => {
  return async (dispatch) => {
    try {
      dispatch(authActions.updatepagename("React session"));
    } catch (e) {
      return;
    }
  };
};

export const updateField = (input) => {
  return async (dispatch) => {
    try {
      dispatch(authActions.updateformfields(input));
    } catch (e) {
      return;
    }
  };
};

export const RegisterUser = (input) => {
  return async (dispatch) => {
    dispatch(loaderStart());
    try {
      await mgtApi.post("/user-signup", input).then((res) => {
        // console.log(res.data);
        if (res.data.status === "success") {
          // get token store in local storage.
          dispatch(authActions.registerSuccess(res.data.msg));
        }
        if (res.data.status === "error") {
          dispatch(authActions.registerFailure(res.data.msg));
        }
        dispatch(loaderStop());
      });

      // dispatch(homeActions.updateformfields(input))
    } catch (e) {
      dispatch(loaderStop());
      return;
    }
  };
};
export const verifyOtpfield = (input) => {
  return async (dispatch) => {
    try {
      dispatch(authActions.verifyOTPpasscode(input));
    } catch (e) {
      return;
    }
  };
};
export const checkValidateOTP = (input) => {
  const reg_email = localStorage.getItem("registerdEmail");
  const otpkey = input.otp_key;

  return async (dispatch) => {
    try {
      await mgtApi
        .post("/verify-user", { key: otpkey, email: reg_email })
        .then((res) => {
          // console.log(res.data.status);
          if (res.status === 200) {
            // console.log("pramodini123");
            dispatch(authActions.OTPWithSuccess(res.data.msg));
          }
          if (res.data.status === "fail") {
            dispatch(authActions.OTPWithError(res.data.msg));
          }
        });
    } catch (e) {
      return;
    }
  };
};
export const updateSetAlreadyRegister = () => {
  return async (dispatch) => {
    try {
      dispatch(authActions.updateAlreadyRegistered());
    } catch (e) {
      return;
    }
  };
};

export const manageLoginmessage = () => {
  return async (dispatch) => {
    try {
      dispatch(authActions.update_msg_login());
    } catch (e) {
      return;
    }
  };
};

export const validatelogin = (input) => {
  return async (dispatch) => {
    try {
      dispatch(authActions.updateloginfields(input));
    } catch (e) {
      return;
    }
  };
};

export const checkLogin = (input) => {
  return async (dispatch) => {
    dispatch(authActions.loaderStart());
    try {
      await mgtApi.post("/user-login", input).then((res) => {
        // console.log(res.data);
        if (res.data.status === "success") {
          dispatch(authActions.loginSuccess(res.data.data));
        }
        if (res.data.status === "error") {
          dispatch(authActions.loginFailure(res.data.msg));
          alert(res.data.msg);
        }
        dispatch(authActions.loaderStop());
      });
    } catch (e) {
      dispatch(authActions.loaderStop());
      return;
    }
  };
};
export const validateForgotpass = (input) => {
  return async (dispatch) => {
    try {
      dispatch(authActions.validateForgotpass_fields(input));
    } catch (e) {
      return;
    }
  };
};
export const checkforgotPassword = (input) => {
  return async (dispatch) => {
    dispatch(loaderStart());
    try {
      await mgtApi.post("/forgot-password", input).then((res) => {
        if (res.data.status == "success") {
          dispatch(authActions.forgotPasswordSuccess(res.data.data));
        }

        if (res.data.status == "error") {
          dispatch(authActions.forgotPasswordFailure(res.data.msg));
        }

        if (res.data.status == "fail") {
          dispatch(authActions.forgotPasswordFailure(res.data.msg));
        }

        dispatch(loaderStop());
      });
    } catch (e) {
      dispatch(loaderStart());
      return;
    }
  };
};
export const resetPasswordUser = (payload) => {
  const reset_token = payload.userSlug;
  const password = payload.login_fields.password;

  return async (dispatch) => {
    try {
      await mgtApi
        .post("/verify-forgot-password", {
          reset_token: reset_token,
          password: password,
        })
        .then((res) => {
          if (res.data.status == "success") {
            dispatch(authActions.resetPasswordSuccess(res.data.data));
          }

          if (res.data.status == "error") {
            dispatch(authActions.resetPasswordFailure(res.data.msg));
          }
        });
    } catch (e) {
      return;
    }
  };
};

export const validateResetfield = (input) => {
  return async (dispatch) => {
    try {
      dispatch(authActions.updateReset_fields(input));
    } catch (e) {
      return;
    }
  };
};
export const updateFieldContact = (input) => {
  return async (dispatch) => {
    try {
      dispatch(authActions.updateContactformfields(input));
    } catch (e) {
      return;
    }
  };
};

export const getContact = (input) => {
  return async (dispatch) => {
    try {
      await mgtApi.post("/submit-query", input).then((res) => {
        if (res.data.status == "success") {
          dispatch(authActions.contactSuccess(res.data.msg));
        }
        if (res.data.status == "error") {
          dispatch(authActions.contactFailure(res.data.msg));
        }
      });
    } catch (e) {
      return;
    }
  };
};

export const loaderStart = () => {
  return async (dispatch) => {
    dispatch(authActions.loaderStart());
  };
};

export const loaderStop = () => {
  return async (dispatch) => {
    dispatch(authActions.loaderStop());
  };
};

//   export const deleteWishlistProduct = (payload) => {
//     return async (dispatch) => {
//       try {
//         await mgtApi.post("/addwishlist").then((response) => {
//           if (response.data.status === "success") {
//             dispatch(getWishlistProduct());
//           }
//         });
//       } catch (e) {
//         console.log(e.response);
//       }
//     }
//   }
export default authSlice.reducer;
