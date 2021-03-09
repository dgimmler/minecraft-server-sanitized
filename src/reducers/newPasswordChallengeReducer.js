import * as actionNames from "../actions/actionNames";

export default (
  state = { newPasswordChallenge: false, response: undefined },
  action
) => {
  switch (action.type) {
    case actionNames.INITIATE_NEW_PASSWORD_CHALLENGE:
      return { newPasswordChallenge: true, response: action.payload };
    default:
      return state;
  }
};
