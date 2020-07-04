import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

import Home from "./components/Home";
import Payment from "./components/Payment";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/" exact render={(props) => <Home {...props} />} />
          <Route path="/pay" render={(props) => <Payment {...props} />} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
