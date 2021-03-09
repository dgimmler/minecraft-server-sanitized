import * as actionNames from "../actions/actionNames";

export default (state = "X", action) => {
  switch (action.type) {
    case actionNames.GET_BUTTON_MESSAGE:
      switch (action.payload) {
        case "stopped":
          return "START";
        case "running":
          return "STOP";
        default:
          return "X";
      }
    default:
      return state;
  }
};
