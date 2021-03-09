import * as actionNames from "../actions/actionNames";

export default (state = "NA", action) => {
  switch (action.type) {
    case actionNames.TOGGLE_SERVER:
      if (action.payload.data !== undefined) {
        return action.payload.data;
      }
      return "NA";
    default:
      return state;
  }
};
