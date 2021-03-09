import * as action from "./actionNames";
import minecraftServer from "../apis/minecraftServer";
import userPool from "../apis/userPool";
import {
  CognitoUser,
  AuthenticationDetails,
  CognitoRefreshToken,
} from "amazon-cognito-identity-js";

/////////////////////
// ACTION CREAATORS //
/////////////////////

/////////////////////
// FORM MANAGEMENT //

export const handleFormSubmit = () => (dispatch) => {
  // first resetting login success removes error message from login form and
  // allows login button to show loading icon
  dispatch({
    type: action.HANDLE_SUCCESSFUL_LOGIN,
    payload: undefined,
  });
  dispatch({
    type: action.HANDLE_FORM_SUBMIT,
    payload: true,
  });
};

export const handleFailedFormSubmit = () => {
  return {
    type: action.HANDLE_FAILED_FORM_SUBMIT,
    payload: true,
  };
};

export const initiateFormSubmit = () => {
  return {
    type: action.INITIATE_FORM_SUBMIT,
    payload: undefined,
  };
};

export const completeFormSubmit = () => {
  return {
    type: action.COMPLETE_FORM_SUBMIT,
    payload: undefined,
  };
};

///////////////////////
// BUTTON MANAGEMENT //
export const initiateButtonClick = () => {
  return {
    type: action.INITIATE_BUTTON_CLICK,
    payload: undefined,
  };
};

export const completeButtonClick = () => {
  return {
    type: action.COMPLETE_BUTTON_CLICK,
    payload: undefined,
  };
};

///////////////////////
// SERVER MANAGEMENT //
export const toggleServer = (toggleStatus, session) => async (dispatch) => {
  // does nothing if status is neither on nor off
  if (toggleStatus === "OFF" || toggleStatus === "ON") {
    let endpoint = "/stop";
    if (toggleStatus === "OFF") endpoint = "/start";
    // Authorization header must be added here as we could not get the token on
    // initialization
    minecraftServer.defaults.headers.Authorization = session
      .getIdToken()
      .getJwtToken();
    if (endpoint === "/stop") minecraftServer.post("/logoutUsers");
    const response = await minecraftServer.post(endpoint);
    dispatch({
      type: action.TOGGLE_SERVER,
      payload: response,
    });
    dispatch(getServerStatus(session));
  }
};

export const getServerStatus = (session) => async (dispatch) => {
  // Authorization header must be added here as we could not get the token on
  // initialization
  minecraftServer.defaults.headers.Authorization = session
    .getIdToken()
    .getJwtToken();
  minecraftServer.interceptors.request.use(function (config) {
    config.headers.Authorization = session.getIdToken().getJwtToken();
    return config;
  });
  const response = await minecraftServer.get("/status");
  dispatch({
    type: action.GET_SERVER_STATUS,
    payload: response,
  });
  dispatch(getButtonMessage(response.data)); // also update button message
  if (!(response.data === "stopped" || response.data === "running")) {
    await new Promise((r) => setTimeout(r, 10 * 1000)); // sleep 10 seconds
    dispatch(getServerStatus(session));
  } else {
    await new Promise((r) => setTimeout(r, 300 * 1000)); // sleep 5 minutes
    dispatch(getServerStatus(session));
  }
};

export const serverStatusUnknown = () => {
  return {
    type: action.GET_SERVER_STATUS,
    payload: { data: undefined },
  };
};

export const getButtonMessage = (status) => {
  return {
    type: action.GET_BUTTON_MESSAGE,
    payload: status,
  };
};

////////////////////
// AUTHENTICATION //
export const getApiKey = (session) => async (dispatch) => {
  minecraftServer.defaults.headers.Authorization = session
    .getIdToken()
    .getJwtToken();
  const response = await minecraftServer.get("/getKey");
  dispatch({
    type: action.GET_API_KEY,
    payload: response.data,
  });
};

export const getUserSession = () => (dispatch) => {
  // Called on page load or refresh
  //
  // get email and refresh token from cookies to pull up previous session if
  // available
  const email = userPool.storage.getItem("userEmail");
  const refreshToken = userPool.storage.getItem("refreshToken");
  if (!email || !refreshToken) {
    dispatch({
      type: action.GET_USER_SESSION,
      payload: undefined,
    });
  }
  // attempt to pull up previous session
  try {
    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    const RefreshToken = new CognitoRefreshToken({
      RefreshToken: refreshToken,
    });
    user.refreshSession(RefreshToken, (err, session) => {
      if (err) {
        dispatch({
          type: action.GET_USER_SESSION,
          payload: undefined,
        });
      }

      if (session) {
        // session pulled up successfully!
        dispatch({
          type: action.GET_USER_SESSION,
          payload: { session: session, email: email },
        });
        dispatch(getApiKey(session)); // retrieve api key
      }
    });
  } catch (err) {
    dispatch({
      type: action.GET_USER_SESSION,
      payload: undefined,
    });
  }
};

export const handleLogin = (formValues, updatePassword = false) => (
  dispatch
) => {
  const user = new CognitoUser({
    Username: formValues.email,
    Pool: userPool,
  });

  const authDetails = new AuthenticationDetails({
    Username: formValues.email,
    Password: formValues.password,
  });

  user.authenticateUser(authDetails, {
    onSuccess: (data) => {
      // save email and refresh token to cookies
      userPool.storage.setItem("refreshToken", String(data.refreshToken.token));
      userPool.storage.setItem("userEmail", formValues.email);

      if (!updatePassword) {
        // initial user session and navigate to control hub
        dispatch({
          type: action.INITIAL_USER_SESSION,
          payload: { session: data, email: formValues.email },
        });

        // indicate login successful
        dispatch({
          type: action.HANDLE_SUCCESSFUL_LOGIN,
          payload: undefined,
        });
        if (data.session) dispatch(getApiKey(data.session)); // retrieve api key
      } else {
        dispatch(setNewPassword(formValues, user));
      }
    },

    onFailure: (err) => {
      dispatch({
        type: action.HANDLE_FAILED_LOGIN,
        payload: err,
      });
    },

    newPasswordRequired: (data) => {
      if (!formValues.newpassword) {
        // redirect to change password page
        dispatch(redirectToChangePassword());
        dispatch({
          type: action.INITIATE_NEW_PASSWORD_CHALLENGE,
          payload: { session: data, email: formValues.email },
        });
      } else {
        // submit completed new password form
        delete data.email_verified;
        user.completeNewPasswordChallenge(
          String(formValues.newpassword),
          data,
          {
            onSuccess: (data) => {
              userPool.storage.setItem(
                "refreshToken",
                String(data.refreshToken.token)
              );
              userPool.storage.setItem("userEmail", formValues.email);
              dispatch({
                type: action.INITIAL_USER_SESSION,
                payload: { session: data, email: formValues.email },
              });
              dispatch({
                type: action.MARK_PASSWORD_CHANGED,
                payload: undefined,
              });
            },
            onFailure: (err) => {
              dispatch({
                type: action.HANDLE_FAILED_LOGIN,
                payload: err,
              });
            },
          }
        );
      }
    },
  });
};

export const signOut = (email) => {
  const user = new CognitoUser({
    Username: email,
    Pool: userPool,
  });
  user.signOut();
  return {
    type: action.SIGN_OUT_USER,
    payload: undefined,
  };
};

export const setNewPassword = (formValues, user) => (dispatch) => {
  user.changePassword(
    formValues.password,
    formValues.newpassword,
    (err, success) => {
      if (err) {
        dispatch({
          type: action.HANDLE_FAILED_LOGIN,
          payload: err,
        });
      } else if (success) {
        dispatch({
          type: action.HANDLE_SUCCESSFUL_LOGIN,
          payload: undefined,
        });
        dispatch({
          type: action.MARK_PASSWORD_CHANGED,
          payload: undefined,
        });
      }
    }
  );
};

export const clearLoginFailureMessage = () => {
  return {
    type: action.CLEAR_LOGIN_ERROR_MESSAGE,
    payload: undefined,
  };
};

export const unmarkPasswordChanged = () => {
  return {
    type: action.UNMARK_PASSWORD_CHANGED,
    payload: undefined,
  };
};

export const redirectToChangePassword = () => {
  return {
    type: action.REDIRECT_TO_CHANGE_PASSWORD,
    payload: undefined,
  };
};

export const completeRedirectToChangePassword = () => {
  return {
    type: action.COMPLETE_REDIRECT_TO_CHANGE_PASSWORD,
    payload: undefined,
  };
};

export const markPasswordsDoNotMatch = () => {
  return {
    type: action.MARK_PASSWORDS_DO_NOT_MATCH,
    payload: undefined,
  };
};

export const unmarkPasswordsDoNotMatch = () => {
  return {
    type: action.UNMARK_PASSWORDS_DO_NOT_MATCH,
    payload: undefined,
  };
};

/////////////
// WIDGETS //

// TIMER //
export const getStopTime = (session) => async (dispatch) => {
  minecraftServer.defaults.headers.Authorization = session
    .getIdToken()
    .getJwtToken();
  const response = await minecraftServer.get("/timer");
  dispatch({
    type: action.GET_STOP_TIME,
    payload: response.data,
  });
  dispatch(startTimer());
};

export const startTimer = () => async (dispatch) => {
  await new Promise((r) => setTimeout(r, 1 * 1000)); // sleep 1 seconds
  dispatch(decreaseTimer());
  dispatch(startTimer());
};

export const increaseTimer = (session, stopTime, currentTime) => async (
  dispatch
) => {
  dispatch({
    type: action.INCREASE_TIMER,
    payload: undefined,
  });

  // increment but 30 min or up to 2 hour max
  const overflow = parseInt(currentTime) + 1800 - 7200; // > 0 = > 2 hours
  const increment = overflow > 0 ? 1800 - overflow - 60 : 1800; // if > 2 hours, also take off 1 min buffer
  const body = {
    value: stopTime + increment + "", // add 30 min and convert to string
  };
  minecraftServer.defaults.headers.Authorization = session
    .getIdToken()
    .getJwtToken();
  // const response = await minecraftServer.post(
  minecraftServer.post("/updateTimer", JSON.stringify(body));
  // TODO do something with the response in case it DOES error
};

export const decreaseTimer = () => {
  return {
    type: action.DECREASE_TIMER,
    payload: undefined,
  };
};

// PLAYERS //
export const getPlayers = (token) => async (dispatch) => {
  minecraftServer.defaults.headers["x-api-key"] = token;
  const response = await minecraftServer.post("/getLogins");
  dispatch({
    type: action.GET_PLAYERS,
    payload: response,
  });
  await new Promise((r) => setTimeout(r, 300 * 1000)); // sleep 5 minutes
  dispatch(getPlayers());
};

// MAP //
export const getWindowHeight = (window) => {
  return {
    type: action.GET_WINDOW_HEIGHT,
    payload: window.document.body.scrollHeight + "px",
  };
};
