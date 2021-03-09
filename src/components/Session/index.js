import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { getUserSession } from "../../actions";
import "./Session.css";

class Session extends Component {
  componentDidMount() {
    this.props.getUserSession();
  }

  render() {
    if (this.props.requiresLogin === true) {
      return (
        <div className="backdrop">
          <div className="overlay">
            <div>
              <Redirect to="/login" />
            </div>
          </div>
        </div>
      );
    } else if (this.props.requiresLogin === false) {
      return (
        <div className="backdrop">
          <div className="overlay">
            <div>
              <Redirect to="/hub" />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="backdrop">
          <div className="overlay">
            <div className="ControlHub hub card col-6 offset-3">
              Checking session...
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    session: state.session.session,
    requiresLogin: state.session.requiresLogin,
  };
};

export default connect(mapStateToProps, { getUserSession })(Session);
