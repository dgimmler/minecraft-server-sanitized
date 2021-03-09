import * as actionNames from "../actions/actionNames";

export default (state = false, action) => {
  switch (action.type) {
    case actionNames.INITIATE_FORM_SUBMIT:
      return true;
    case actionNames.COMPLETE_FORM_SUBMIT:
      return false;
    default:
      return state;
  }
};
