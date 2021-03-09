import React, { Component } from "react";
import { connect } from "react-redux";
import "./Form.css";

export class Form extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.btnClass = "btn btn-primary";
    this.formClass = "form-group";
    this.containerClass =
      "hub card col-10 col-sm-8 col-xl-6 offset-1 offset-sm-2 offset-xl-3";
  }

  renderError({ touched }, { value }) {
    if (!value && touched) {
      return (
        <div className="msg alert alert-danger">
          <div className="header">Required</div>
        </div>
      );
    }
  }

  renderInput = ({ input, label, type, placeholder, meta }) => {
    const fieldError =
      !input.value && this.props.failedFormSubmit ? "field-error" : "";
    return (
      <div className="field form-group">
        <label htmlFor={label}>{label}</label>
        <input
          className={"form-control " + fieldError}
          placeholder={placeholder}
          id={label}
          type={type}
          {...input}
        />
        {this.renderError(meta, input)}
      </div>
    );
  };

  render() {
    return <div>Form</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    failedFormSubmit: state.failedFormSubmit,
  };
};

export default connect(mapStateToProps)(Form);
