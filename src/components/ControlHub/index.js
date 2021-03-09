import React, { Component } from "react";
import ControlBar from "../ControlBar";
import InfoBox from "../InfoBox";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  getServerStatus,
  completeFormSubmit,
  unmarkPasswordChanged,
} from "../../actions";
import "./ControlHub.css";

class ControlHub extends Component {
  componentDidMount() {
    this.props.completeFormSubmit();
    if (this.props.requiresLogin === false) {
      this.props.getServerStatus(this.props.session);
    }
    if (this.props.passwordChanged) {
      this.props.unmarkPasswordChanged();
    }
  }

  render() {
    if (
      this.props.requiresLogin === true ||
      this.props.requiresLogin === undefined
    ) {
      return (
        <div className="backdrop">
          <div className="overlay">
            <div>
              <Redirect to="/" />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="backdrop">
          <div className="overlay">
            <div className="ControlHub hub card col-10 col-sm-8 col-xl-6 offset-1 offset-sm-2 offset-xl-3">
              <ControlBar buttonMessage={this.props.buttonMessage} />
              <InfoBox serverStatus={this.props.serverStatus} />
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    requiresLogin: state.session.requiresLogin,
    session: state.session.session,
    serverStatus: state.serverStatus,
    buttonMessage: state.buttonMessage,
    passwordChanged: state.passwordChanged,
  };
};

export default connect(mapStateToProps, {
  getServerStatus,
  completeFormSubmit,
  unmarkPasswordChanged,
})(ControlHub);
