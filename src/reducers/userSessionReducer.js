import * as actionNames from "../actions/actionNames";

export default (
  state = { session: {}, requiresLogin: undefined, email: undefined },
  action
) => {
  switch (action.type) {
    case actionNames.GET_USER_SESSION:
      if (action.payload) {
        return {
          session: action.payload.session,
          requiresLogin: false,
          email: action.payload.email,
        };
      }
      console.log("Unable to pull up previous session, login required...");
      return { session: {}, requiresLogin: true };
    case actionNames.INITIAL_USER_SESSION:
      if (action.payload) {
        return {
          session: action.payload.session,
          requiresLogin: false,
          email: action.payload.email,
        };
      }
      return state;
    case actionNames.SIGN_OUT_USER:
      return {
        session: undefined,
        requiresLogin: true,
        email: undefined,
      };
    default:
      return state;
  }
};
