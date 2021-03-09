import * as actionNames from "../actions/actionNames";

export default (state = false, action) => {
  switch (action.type) {
    case actionNames.REDIRECT_TO_CHANGE_PASSWORD:
      return true;
    case actionNames.COMPLETE_REDIRECT_TO_CHANGE_PASSWORD:
      return false;
    default:
      return state;
  }
};
