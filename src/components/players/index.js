import React, { Component } from "react";
import { connect } from "react-redux";
import { getPlayers } from "../../actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import "./players.css";

class Players extends Component {
  componentDidMount() {
    if (this.props.apiKey) this.props.getPlayers(this.props.apiKey);
  }

  renderPlayer({ Username, active, since }) {
    const activeClass = active ? " online" : "";
    const status = active ? ": joined " + since : ": left " + since;
    const color = active ? "#6ead43" : "#d43030"; // green : red
    return (
      <div className={"player" + activeClass} key={Username}>
        <FontAwesomeIcon icon={faCircle} color={color} />
        {Username + status}
      </div>
    );
  }

  renderPlayers() {
    let playerDivs = [];
    for (let i in this.props.players) {
      playerDivs.push(this.renderPlayer(this.props.players[i]));
    }
    return playerDivs;
  }

  render() {
    if (this.props.serverStatus === "ON" && this.props.players.length === 0)
      this.props.getPlayers(this.props.apiKey);
    const hide = this.props.serverStatus === "ON" ? "" : " d-none";
    return (
      <div className={"players" + hide}>
        <h2>Online</h2>
        <div className="players-list">{this.renderPlayers()}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { players: state.players, apiKey: state.apiKey };
};

export default connect(mapStateToProps, { getPlayers })(Players);
