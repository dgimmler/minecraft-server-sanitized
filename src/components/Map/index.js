import React, { Component } from "react";
import { connect } from "react-redux";
import Iframe from "react-iframe";
import { getWindowHeight } from "../../actions";
import "./Map.css";

class Map extends Component {
  componentDidMount() {
    getWindowHeight(window);
  }

  render() {
    return (
      <div>
        <div className="home">
          <button id="home-button" onClick={() => window.open("/hub", "_self")}>
            {" "}
            Happy Landings
          </button>
        </div>
        <Iframe
          url="http://35.167.114.167:8123/"
          // url="https://www.google.com/search?q=%http://35.167.114.167:8123&btnI=Im+Feeling+Lucky"
          frameborder="0"
          marginheight="0"
          marginwidth="0"
          width="100%"
          height={this.props.windowHeight}
          scrolling="auto"
          // styles={{ float: "left" }}
        ></Iframe>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    windowHeight: state.window.windowHeight,
  };
};

export default connect(mapStateToProps)(Map);
