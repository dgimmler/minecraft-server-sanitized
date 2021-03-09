import * as actionNames from "../actions/actionNames";

export default (state = { windowHeight: "1000px" }, action) => {
  switch (action.type) {
    case actionNames.GET_WINDOW_HEIGHT:
      return { windowHeight: action.payload };
    default:
      return state;
  }
};
