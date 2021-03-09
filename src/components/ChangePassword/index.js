import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Redirect } from "react-router-dom";
import { Form } from "../Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import {
  handleLogin,
  completeRedirectToChangePassword,
  handleFailedFormSubmit,
  handleFormSubmit,
  initiateFormSubmit,
  completeFormSubmit,
  markPasswordsDoNotMatch,
  unmarkPasswordsDoNotMatch,
  clearLoginFailureMessage,
} from "../../actions";
import "./ChangePassword.css";

class ChangePassword extends Form {
  validateForm(
    { password, newpassword, newpasswordconfirm },
    { markPasswordsDoNotMatch, unmarkPasswordsDoNotMatch }
  ) {
    // local validation of form. Password strength and validity is evaluated by
    // cognito
    if (!password || !newpassword || !newpasswordconfirm) {
      return false;
    } else if (newpassword !== newpasswordconfirm) {
      markPasswordsDoNotMatch();
      return false;
    } else {
      unmarkPasswordsDoNotMatch();
      return true;
    }
  }

  handleFailedSubmit({ handleFailedFormSubmit, completeFormSubmit }) {
    handleFailedFormSubmit();
    completeFormSubmit();
  }

  handleOnSubmit(formValues, props) {
    if (this.validateForm(formValues, props)) {
      // indicate form submit is in progress
      props.handleFormSubmit();
      props.initiateFormSubmit();

      // add email to formValues
      if (this.props.newPasswordChallenge.newPasswordChallenge)
        formValues["email"] = props.newPasswordChallenge.response.email;
      else formValues["email"] = props.email;

      this.props.handleLogin(formValues, true);
    } else {
      this.handleFailedSubmit(this.props);
    }
  }

  clearFailMessage = (props) => {
    // clear either password mismatch message or login failure message
    props.unmarkPasswordsDoNotMatch();
    props.clearLoginFailureMessage();
  };

  renderFailMessage(props) {
    const closeMsgBtn = (
      <div
        className="btn close-message"
        onClick={() => {
          this.clearFailMessage(props);
        }}
      >
        x
      </div>
    );
    if (props.passwordsDoNotMatch) {
      props.completeFormSubmit();
      return (
        <div className="msg alert alert-danger">
          <div className="header">Passwords don't match</div>
          {closeMsgBtn}
        </div>
      );
    } else if (
      props.failedLoginMsg !== "" &&
      props.failedLoginMsg !== undefined
    ) {
      props.completeFormSubmit();
      const sanitizedMsg = props.failedLoginMsg
        .replace("Password does not conform to policy: ", "")
        .replace("Incorrect username or password.", "Incorrect password");
      return (
        <div className="msg alert alert-danger">
          <div className="header">{sanitizedMsg}</div>
          {closeMsgBtn}
        </div>
      );
    } else {
      return "";
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
    if (
      this.props.formSubmitInProgress &&
      this.props.newPasswordChallenge.newPasswordChallenge &&
      this.props.redirectToChangePassword
    ) {
      // for new password challenge only, form submit from initial login attempt
      // will still be in progress, so we need to indicate it done (since we
      // will have been redirected directly from login page)
      this.props.completeFormSubmit();
    }
    this.props.completeRedirectToChangePassword();

    // handle page display or redirect
    if (
      (this.props.requiresLogin === true ||
        this.props.requiresLogin === undefined) &&
      !this.props.newPasswordChallenge
    ) {
      // If refreshing page or opening new session on this page, redirect home
      // if not logged in
      return (
        <div className="backdrop">
          <div className="overlay">
            <div>
              <Redirect to="/" />
            </div>
          </div>
        </div>
      );
    } else if (this.props.passwordChanged) {
      // Redirect to hub on successful password change
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
      // DEFAULT: Display form
      return (
        <div className="backdrop">
          <div className="overlay">
            <div className={"ChangePassword " + this.containerClass}>
              <h1>Change Your Password</h1>
              <form
                className={this.formClass}
                onSubmit={this.props.handleSubmit((formValues) => {
                  this.handleOnSubmit(formValues, this.props);
                })}
              >
                <Field
                  name="password"
                  component={this.renderInput}
                  label="Old Password"
                  type="password"
                  placeholder="re-enter current password..."
                />
                <Field
                  name="newpassword"
                  component={this.renderInput}
                  label="New Password"
                  type="password"
                  placeholder="enter new password"
                />
                <Field
                  name="newpasswordconfirm"
                  component={this.renderInput}
                  label="New Password (Confirm)"
                  type="password"
                  placeholder="retype new password"
                />
                {this.renderFailMessage(this.props)}
                <button
                  className={this.btnClass}
                  disabled={this.props.formSubmitInProgress}
                >
                  {this.renderButtonMessage(this.props)}
                </button>
              </form>
            </div>
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
    email: state.session.email,
    session: state.session.session,
    failedLogin: state.loginResult.failedLogin,
    failedLoginMsg: state.loginResult.msg,
    newPasswordChallenge: state.newPasswordChallenge,
    passwordChanged: state.passwordChanged,
    redirectToChangePassword: state.redirectToChangePassword,
    passwordsDoNotMatch: state.passwordsDoNotMatch,
  };
};

export default connect(mapStateToProps, {
  handleLogin,
  completeRedirectToChangePassword,
  handleFailedFormSubmit,
  handleFormSubmit,
  initiateFormSubmit,
  completeFormSubmit,
  markPasswordsDoNotMatch,
  unmarkPasswordsDoNotMatch,
  clearLoginFailureMessage,
})(reduxForm({ form: "login", touchOnBlur: false })(ChangePassword));
