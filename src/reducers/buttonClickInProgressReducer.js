import * as actionNames from "../actions/actionNames";

export default (state = false, action) => {
  switch (action.type) {
    case actionNames.INITIATE_BUTTON_CLICK:
      return true;
    case actionNames.COMPLETE_BUTTON_CLICK:
      return false;
    default:
      return state;
  }
};
