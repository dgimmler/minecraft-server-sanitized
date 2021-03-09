import React, { Component } from "react";
import { connect } from "react-redux";
import { getStopTime, increaseTimer, decreaseTimer } from "../../actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faForward } from "@fortawesome/free-solid-svg-icons";
import "./timer.css";

class Timer extends Component {
  componentDidMount() {
    if (this.props.serverStatus === "ON") {
      this.props.getStopTime(this.props.session);
    }
  }

  handleClick() {
    this.props.increaseTimer(
      this.props.session,
      this.props.timer.stopTime,
      this.props.timer.currentTime
    );
  }

  render() {
    const hidden = this.props.serverStatus !== "ON" ? "d-none" : "";
    // offset-md-1 offset-lg-3 offset-xl-2
    return (
      <div className={this.props.bootstrapClass + " Timer " + hidden}>
        <div className="d-block d-md-none">
          <span className="timer-header">Shut down:</span>
          <div className="countdown">
            {this.props.timer.currentCountdown}
            <button className="add-30" onClick={() => this.handleClick()}>
              <FontAwesomeIcon icon={faForward} />
              +30
            </button>
          </div>
        </div>

        <div className="d-none d-md-block">
          <span className="timer-header">Shut down:</span>
          <div className="countdown">
            {this.props.timer.currentCountdown}
            <button className="add-30" onClick={() => this.handleClick()}>
              <FontAwesomeIcon icon={faForward} />
              +30
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    timer: state.timer,
    session: state.session.session,
  };
};

export default connect(mapStateToProps, {
  getStopTime,
  increaseTimer,
  decreaseTimer,
})(Timer);
