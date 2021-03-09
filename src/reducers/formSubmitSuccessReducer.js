import * as actionNames from "../actions/actionNames";

export default (state = false, action) => {
  switch (action.type) {
    case actionNames.HANDLE_FAILED_FORM_SUBMIT:
      return true;
    case actionNames.HANDLE_FORM_SUBMIT:
      return false;
    default:
      return state;
  }
};
