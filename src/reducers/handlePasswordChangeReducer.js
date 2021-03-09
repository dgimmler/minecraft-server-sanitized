import * as actionNames from "../actions/actionNames";

export default (state = false, action) => {
  switch (action.type) {
    case actionNames.MARK_PASSWORD_CHANGED:
      return true;
    case actionNames.UNMARK_PASSWORD_CHANGED:
      return false;
    default:
      return state;
  }
};
