import * as actionNames from "../actions/actionNames";

export default (state = false, action) => {
  switch (action.type) {
    case actionNames.MARK_PASSWORDS_DO_NOT_MATCH:
      return true;
    case actionNames.UNMARK_PASSWORDS_DO_NOT_MATCH:
      return false;
    default:
      return state;
  }
};
