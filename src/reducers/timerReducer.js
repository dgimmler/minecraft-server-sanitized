import * as actionNames from "../actions/actionNames";

export default (
  state = {
    stopTime: 0,
    currentTime: 0,
    countdownStart: "00:00:00",
    currentCountdown: "00:00:00",
  },
  action
) => {
  let now, timeStamp, currentTime, countdownStart, currentCountdown;
  switch (action.type) {
    case actionNames.GET_STOP_TIME:
      if (action.payload !== undefined) {
        now = Date.now() / 1000;
        timeStamp = parseInt(action.payload) + 40; // remove buffer
        currentTime = timeStamp - now < 0 ? 0 : timeStamp - now;
        countdownStart = new Date(currentTime * 1000)
          .toISOString()
          .substr(11, 8); // hh:mm:ss
        return {
          stopTime: timeStamp,
          currentTime: currentTime,
          countdownStart: countdownStart,
          currentCountdown: countdownStart,
        };
      }
      return state;
    case actionNames.DECREASE_TIMER:
      currentTime = state.currentTime - 1;
      currentCountdown = new Date(currentTime * 1000)
        .toISOString()
        .substr(11, 8); // hh:mm:ss
      return {
        ...state,
        currentTime: currentTime,
        currentCountdown: currentCountdown,
      };
    case actionNames.INCREASE_TIMER:
      currentTime = // + 30 min. Max out at 2 hours
        state.currentTime + 1800 > 7200 ? 7200 : state.currentTime + 1800;
      currentCountdown = new Date(currentTime * 1000)
        .toISOString()
        .substr(11, 8); // hh:mm:ss
      return {
        ...state,
        currentTime: currentTime,
        currentCountdown: currentCountdown,
      };
    default:
      return state;
  }
};
