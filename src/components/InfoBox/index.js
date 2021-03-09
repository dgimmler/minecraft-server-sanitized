import React, { Component } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faCircle,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import Timer from "../timer";
import Players from "../players";
import { config } from "../../config";
import "./InfoBox.css";

class InfoBox extends Component {
  getStatusIconColor(serverStatus) {
    if (serverStatus === "STARTING" || serverStatus === "STOPPING")
      return "#feaa03";
    else if (serverStatus === "ON") return "#6ead43";
    else return "#d43030";
  }

  renderServerStatus({ serverStatus }) {
    const iconColor = this.getStatusIconColor(serverStatus);

    if (serverStatus === "UNKNOWN") {
      // display spinner if server stataus is unknown
      return (
        <div className="col-12">
          <div className="server-status col-12 col-md-5">
            <FontAwesomeIcon icon={faSpinner} pulse />
          </div>
        </div>
      );
    } else if (serverStatus === "STARTING" || serverStatus === "STOPPING") {
      // dosplay spinner if starting or stopping
      return (
        <div className="col-12">
          <div className="server-status col-12 col-md-5">
            <FontAwesomeIcon icon={faCircle} color={iconColor} />
            Server is{" "}
            <span>
              {serverStatus} <FontAwesomeIcon icon={faSpinner} pulse />
            </span>
          </div>
        </div>
      );
    } else {
      // plain status if plain on or off
      return (
        <div className="col-12">
          <div className="server-status col-12 col-md-5">
            <FontAwesomeIcon icon={faCircle} color={iconColor} />
            Server is <span>{this.props.serverStatus}</span>
          </div>
          <Timer
            serverStatus={this.props.serverStatus}
            bootstrapClass="col-12 col-md-6"
          />
        </div>
      );
    }
  }

  render() {
    return (
      <div className="InfoBox card-body">
        <div className="header">
          <h1 className="text">Happy Landings</h1>
          <div className="subtext">
            <h2>{config.serverIp}</h2>
            <FontAwesomeIcon icon={faCircle} color={"#ededed"} />
            <h2>{config.minecraftVersion}</h2>
          </div>
        </div>
        <div className="ServerStatus">
          <span className="text">{this.renderServerStatus(this.props)}</span>
        </div>
        <div className="info">
          <span className="text col-12 col-md-5">
            <a
              href={config.texturePack.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faCaretRight} color={"#ededed"} />
              {"Texture Pack: " + config.texturePack.name}
            </a>
          </span>
        </div>
        <div className="users-online">
          <Players serverStatus={this.props.serverStatus} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { serverStatus: state.serverStatus };
};

export default connect(mapStateToProps)(InfoBox);
