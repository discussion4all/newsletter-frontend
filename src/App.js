import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./components/Home";
import Payment from "./components/Payment";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact render={(props) => <Home {...props} />} />
        <Route path="/pay" render={(props) => <Payment {...props} />} />
      </Switch>
    </Router>
  );
}

export default App;
