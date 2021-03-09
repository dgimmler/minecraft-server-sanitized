import * as actionNames from "../actions/actionNames";

const getTimeArray = (diff) => {
  const prettyTime = new Date(diff * 1000).toISOString().substr(11, 8); // hh:mm:ss
  let timeArr = (prettyTime + "").split(":");
  timeArr[0] = parseInt(timeArr[0]) + Math.floor(diff / 60 / 60 / 24) * 24;
  timeArr[0] = timeArr[0] < 10 ? "0" + timeArr[0] : timeArr[0].toString();
  return timeArr;
};

const getTimeAgo = (loginTime, now, active, diff) => {
  // We just want to ballpark how long ago someone logged in or out, so no need
  // to show an exact timer, especially since we'll only update it every 5
  // minutes.

  // get time spread
  let _, min, hr;
  [hr, min, _] = getTimeArray(diff);

  // get (pretty) time ago
  let ago = "just now"; // < 1 min = just now
  if (min !== "00") ago = parseInt(min) + " minutes ago"; // min
  if (hr !== "00") {
    ago = "1 hour ago";
    if (parseInt(hr) > 1) ago = parseInt(hr) + " hours ago"; // hours
    let days = parseInt(Math.round(parseInt(hr) / 24)); // days
    if (Math.round(days) === 1) ago = "1 day ago";
    if (Math.round(days) > 1) ago = days + " days ago";
    if (Math.round(days / 7) === 1)
      ago = parseInt(Math.round(days / 7)) + " weeks ago"; // weeks
    if (Math.round(days / 7) > 1)
      ago = parseInt(Math.round(days / 7)) + " weeks ago"; // weeks
    if (Math.round(days / 30) === 1)
      ago = parseInt(Math.round(days / 7)) + " month ago"; // months
    if (Math.round(days / 30) > 1)
      ago = parseInt(Math.round(days / 7)) + " months ago"; // months
    if (Math.round(days / 365) === 1)
      ago = parseInt(Math.round(days / 365)) + " years ago"; // years
    if (Math.round(days / 365) > 1)
      ago = parseInt(Math.round(days / 365)) + " years ago"; // years
  }
  return ago;
};

export default (state = [], action) => {
  switch (action.type) {
    case actionNames.GET_PLAYERS:
      if (action.payload !== undefined) {
        if (action.payload.data !== undefined) {
          const payload = action.payload.data;
          // split active and inactive players into separate arrays. These will
          // be combined in the return. This also sorts the list by online and
          // offline players.. so that online players are always shown first.
          let active_players = [];
          let inactive_players = [];
          const now = Math.floor(Date.now() / 1000); // current time stamp

          // add some additional properties to each player object, including a
          // "pretty" print of how long ago they logged in/out and whether or
          // not they're currently logged in
          for (let i in payload) {
            const player = payload[i];

            // check if active and calculate time since last login/out
            const active = player.LogoutTime ? false : true;
            let diff = active
              ? now - player.LoginTime
              : now - player.LogoutTime;

            if (active) {
              active_players.push({
                ...player,
                active: active,
                since: getTimeAgo(player.LoginTime, now, active, diff),
              });
            } else {
              inactive_players.push({
                ...player,
                active: active,
                since: getTimeAgo(player.LoginTime, now, active, diff),
              });
            }
          }
          return [...active_players, ...inactive_players];
        }
      }
      return state;
    default:
      return state;
  }
};
