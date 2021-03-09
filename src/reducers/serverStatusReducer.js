import * as actionNames from "../actions/actionNames";

export default (state = "UNKNOWN", action) => {
  switch (action.type) {
    case actionNames.GET_SERVER_STATUS:
      switch (action.payload.data) {
        case "stopped":
          return "OFF";
        case "running":
          return "ON";
        case "pending":
          return "STARTING";
        case "stopping":
          return "STOPPING";
        default:
          if (action.payload.status === 200)
            // if status was 200, just keep whatever the previous status was
            return state;
          return "UNKNOWN";
      }
    default:
      return state;
  }
};
