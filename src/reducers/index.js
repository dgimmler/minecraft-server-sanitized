import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import userSessionReducer from "./userSessionReducer";
import loginReducer from "./loginReducer";
import newPasswordChallengeReducer from "./newPasswordChallengeReducer";
import serverStatusReducer from "./serverStatusReducer";
import serverToggleReducer from "./serverToggleReducer";
import buttonMessageReducer from "./buttonMessageReducer";
import formSubmitSuccessReducer from "./formSubmitSuccessReducer";
import formSubmitProgressReducer from "./formSubmitProgressReducer";
import buttonClickInProgressReducer from "./buttonClickInProgressReducer";
import redirectToChangePasswordReducer from "./redirectToChangePasswordReducer";
import handlePasswordChangeReducer from "./handlePasswordChangeReducer";
import passwordsMatchReducer from "./passwordsMatchReducer";
import timerReducer from "./timerReducer";
import playersReducer from "./playersReducer";
import apiKeyReducer from "./apiKeyReducer";
import windowReducer from "./windowReducer";

export default combineReducers({
  session: userSessionReducer,
  loginResult: loginReducer,
  newPasswordChallenge: newPasswordChallengeReducer,
  form: formReducer,
  toggleStatus: serverToggleReducer,
  serverStatus: serverStatusReducer,
  buttonMessage: buttonMessageReducer,
  failedFormSubmit: formSubmitSuccessReducer,
  formSubmitInProgress: formSubmitProgressReducer,
  buttonClickInProgress: buttonClickInProgressReducer,
  redirectToChangePassword: redirectToChangePasswordReducer,
  passwordChanged: handlePasswordChangeReducer,
  passwordsDoNotMatch: passwordsMatchReducer,
  timer: timerReducer,
  players: playersReducer,
  apiKey: apiKeyReducer,
  window: windowReducer,
});
