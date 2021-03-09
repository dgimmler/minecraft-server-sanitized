import * as actionNames from "../actions/actionNames";

export default (state = "", action) => {
  switch (action.type) {
    case actionNames.GET_API_KEY:
      return action.payload;
    default:
      return state;
  }
};
