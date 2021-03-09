import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Session from "../Session";
import ControlHub from "../ControlHub";
import Login from "../Login";
import ChangePassword from "../ChangePassword";
import Map from "../Map";

import "./App.css";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Route path="/" exact component={Session} />
        <Route path="/login" component={Login} />
        <Route path="/hub" exact component={ControlHub} />
        <Route path="/changepassword" exact component={ChangePassword} />
        <Route path="/map" exact component={Map} />
      </BrowserRouter>
    </div>
  );
};

export default App;
