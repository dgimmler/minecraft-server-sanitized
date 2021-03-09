import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  signOut,
  initiateButtonClick,
  completeButtonClick,
  toggleServer,
  serverStatusUnknown,
  redirectToChangePassword,
  getPlayers,
} from "../../actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "react-bootstrap/Dropdown";
import "./ControlBar.css";

class ControlBar extends Component {
  constructor(props) {
    super(props);
    this.buttonClass = "list-inline-item col-12 col-md-3";
  }

  changePassword({ redirectToChangePassword }) {
    redirectToChangePassword();
  }

  toggleServer(props) {
    props.initiateButtonClick();
    props.serverStatusUnknown();
    props.toggleServer(props.serverStatus, props.session);
  }

  renderChangePassword({ goToChangePassword }) {
    if (goToChangePassword === true) {
      return <Redirect to="/changepassword" />;
    } else {
      return <span>Change Password</span>;
    }
  }

  render() {
    // indicate Start/Stop button can stop displaying spinner
    if (
      (this.props.serverStatus === "ON" || this.props.serverStatus === "OFF") &&
      this.props.buttonClickInProgress &&
      this.props.buttonMessage === "X"
    ) {
      this.props.completeButtonClick();
    }

    // refresh players
    if (
      this.props.serverStatus === "ON" &&
      !this.props.buttonClickInProgress &&
      this.props.buttonMessage !== "X"
    ) {
      this.props.getPlayers(this.props.apiKey);
    }

    // display spinner if server status is updating or being retrieved
    let buttonMessage = this.props.buttonMessage;
    let inProgressClass = "";
    if (this.props.buttonMessage === "X" || this.props.buttonClickInProgress) {
      buttonMessage = <FontAwesomeIcon icon={faSpinner} pulse />;
      inProgressClass = " in-progress";
    }

    return (
      <div className="ControlBar card-title">
        <div className="Menu align middle col-xs-12 col-xl-10">
          <ul className="list-inline justify-content-center">
            <li className={"ServerSwitch " + this.buttonClass}>
              <button
                className={
                  this.props.buttonMessage.toLowerCase() +
                  " light" +
                  inProgressClass
                }
                id="server-button"
                onClick={() => this.toggleServer(this.props)}
                disabled={
                  this.props.buttonMessage === "X" ||
                  this.props.buttonClickInProgress
                }
              >
                {buttonMessage}
              </button>
            </li>
            <li className={this.buttonClass}>
              <button
                id="map-button"
                disabled={this.props.serverStatus !== "ON"}
                // onClick={() => window.open("/map", "_blank")}
                onClick={() =>
                  window.open("http://35.167.114.167:8123/", "_blank")
                }
              >
                Map
              </button>
            </li>
            <li className={this.buttonClass + " light"}>
              <Dropdown>
                <Dropdown.Toggle
                  variant="secondary"
                  id="dropdown-basic"
                  title="profile"
                >
                  Profile
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <button
                      className="profile-item"
                      id="logout-button"
                      onClick={() => this.props.signOut(this.props.email)}
                    >
                      Logout
                    </button>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <button
                      className="profile-item"
                      id="logout-button"
                      onClick={() => this.changePassword(this.props)}
                    >
                      {this.renderChangePassword(this.props)}
                    </button>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    buttonClickInProgress: state.buttonClickInProgress,
    email: state.session.email,
    session: state.session.session,
    serverStatus: state.serverStatus,
    buttonMessage: state.buttonMessage,
    goToChangePassword: state.redirectToChangePassword,
    apiKey: state.apiKey,
  };
};

export default connect(mapStateToProps, {
  toggleServer,
  signOut,
  initiateButtonClick,
  completeButtonClick,
  serverStatusUnknown,
  redirectToChangePassword,
  getPlayers,
})(ControlBar);
