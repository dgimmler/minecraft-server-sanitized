import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Field, reduxForm } from "redux-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import {
  handleLogin,
  handleFailedFormSubmit,
  handleFormSubmit,
  initiateFormSubmit,
  completeFormSubmit,
} from "../../actions";
import { Form } from "../Form";
import "./Login.css";

class Login extends Form {
  constructor(props) {
    super(props);
    this.failedSubmit = this.props.failedFormSubmit;
  }

  handleOnSubmit(formValues, props) {
    if (formValues.email && formValues.password) {
      props.handleFormSubmit();
      props.initiateFormSubmit();
      props.handleLogin(formValues);
    } else {
      props.handleFailedFormSubmit();
      props.completeFormSubmit();
    }
  }

  renderFailedLogin({ failedLogin, completeFormSubmit }) {
    if (failedLogin) {
      completeFormSubmit();
      return (
        <div className="msg alert alert-danger">
          <div className="header">Invalid email or password</div>
        </div>
      );
    }
  }

  renderButtonMessage({ formSubmitInProgress }) {
    if (formSubmitInProgress) {
      return (
        <span>
          <FontAwesomeIcon icon={faSpinner} spin />
        </span>
      );
    } else {
      return <span>Submit</span>;
    }
  }

  render() {
    // TODO: Add display message that only shows on failed login
    if (this.props.newPasswordChallenge.newPasswordChallenge === true) {
      return (
        <div className="backdrop">
          <div className="overlay">
            <div>
              <Redirect to="/changepassword" />
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
          <div className="blur">
            <div className="overlay"></div>
          </div>
          <div className={"Login " + this.containerClass}>
            <form
              className={this.formClass}
              onSubmit={this.props.handleSubmit((formValues) => {
                this.handleOnSubmit(formValues, this.props);
              })}
            >
              <Field
                name="email"
                component={this.renderInput}
                label="Email"
                type="text"
                placeholder="myemail@gmail.com"
              />
              <Field
                name="password"
                component={this.renderInput}
                label="Password"
                type="password"
                placeholder="enter password..."
              />
              <button
                className={this.btnClass}
                disabled={this.props.formSubmitInProgress}
              >
                {this.renderButtonMessage(this.props)}
              </button>
              {this.renderFailedLogin(this.props)}
            </form>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    formSubmitInProgress: state.formSubmitInProgress,
    failedFormSubmit: state.failedFormSubmit,
    requiresLogin: state.session.requiresLogin,
    session: state.session.session,
    failedLogin: state.loginResult.failedLogin,
    newPasswordChallenge: state.newPasswordChallenge,
  };
};

export default connect(mapStateToProps, {
  handleLogin,
  handleFailedFormSubmit,
  handleFormSubmit,
  initiateFormSubmit,
  completeFormSubmit,
})(reduxForm({ form: "login", touchOnBlur: false })(Login));
