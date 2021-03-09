import * as actionNames from "../actions/actionNames";

export default (state = { failedLogin: false, msg: "" }, action) => {
  switch (action.type) {
    case actionNames.HANDLE_FAILED_LOGIN:
      return { failedLogin: true, msg: action.payload.message };
    case actionNames.HANDLE_SUCCESSFUL_LOGIN:
      return { failedLogin: false, msg: "" };
    case actionNames.CLEAR_LOGIN_ERROR_MESSAGE:
      return { failedLogin: false, msg: "" };
    default:
      return state;
  }
};
