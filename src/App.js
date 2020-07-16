import React, { useEffect } from "react";
import { connect } from "react-redux";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { refillStore } from "./actions/newsletterActions";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import Home from "./pages/Home";
import Plans from "./pages/plans";
import PhoneEntry from "./pages/PhoneEntry";
import Verification from "./pages/Verification";
import Payment from "./pages/Payment";
import Dashboard from "./pages/Dashboard";

const stripePromise = loadStripe("pk_test_KSl2TTYS8jeNiqowiHC27tHj00HaabhIdR");

function App(props) {
  useEffect(() => {
    props.refillStore();
  }, []);
  return (
    <Router>
      <Switch>
        <Route path="/" exact render={(props) => <Home {...props} />} />
        <Route path="/plans" render={(props) => <Plans {...props} />} />
        <Route
          path="/phone-entry/:id"
          render={(props) => <PhoneEntry {...props} />}
        />
        <Route
          path="/phone-verification"
          render={(props) => <Verification {...props} />}
        />
        <Route
          path="/payment"
          render={(props) => (
            <Elements stripe={stripePromise}>
              <Payment {...props} />
            </Elements>
          )}
        />
        <Route
          path="/dashboard/:id"
          render={(props) => <Dashboard {...props} />}
        />
      </Switch>
    </Router>
  );
}

export default connect(null, { refillStore })(App);
