import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { BASE_URL } from "../config";
import { refillStore, savePayment } from "../actions/newsletterActions";

const Plans = (props) => {
  const [yearly, setYearly] = useState("");
  const [monthly, setMonthly] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [stripeConnected, setStripeConnected] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const queryString = window.location.search;
  const [userStatus, setUserStatus] = useState(false);
  const [yearlyCheckbox, setYearlyCheckbox] = useState(false);
  const [monthlyCheckbox, setMonthlyCheckbox] = useState(false);
  const [saveDisable, setSaveDisable] = useState(true);

  const handleSave = () => {
    setShowLoader(true);
    console.log("clicked");
    const data = {
      newsletterId: props.newsletterId,
      yearly: yearlyCheckbox ? yearly : "",
      monthly: monthlyCheckbox ? monthly : "",
    };
    axios
      .post(`${BASE_URL}/newsletter/update-plans`, data)
      .then((res) => {
        setShowLoader(false);
        if (res.data.message === "success") {
          setShowMessage(true);
          props.savePayment(data);
          deleteFromLocalStorage("yearly");
          deleteFromLocalStorage("monthly");
          props.history.push(`/phone-entry/${props.newsletterId}`);
        }
      })
      .catch((err) => {
        console.log(err);
        setShowLoader(false);
      });
  };

  // updates save button status
  useEffect(() => {
    if (yearly || monthly) {
      setSaveDisable(false);
      setUserStatus(true);
      return;
    }
    setSaveDisable(true);
  }, [yearly, monthly, stripeConnected]);

  // post code to the server
  useEffect(() => {
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get("code");
    if (code) {
      let newsletter = JSON.parse(localStorage.getItem("newsletterData"));
      axios
        .post(`${BASE_URL}/stripe/connect`, {
          newsletterId: newsletter.newsletterId,
          code,
        })
        .then((res) => {
          if (res.data.message === "success") {
            setStripeConnected(true);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [queryString]);

  // set checkbox values
  useEffect(() => {
    if (yearly.length > 0) {
      setYearlyCheckbox(true);
    } else {
      setYearlyCheckbox(false);
    }
    if (monthly.length > 0) {
      setMonthlyCheckbox(true);
    } else {
      setMonthlyCheckbox(false);
    }
  }, [yearly, monthly]);

  useEffect(() => {
    setMonthly(props.payment.monthly);
    setYearly(props.payment.yearly);
  }, [props.payment]);

  const STRIPE_URL =
    "https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_HYMQTCYre4aXjrMlLSabe6otHE9znoen&scope=read_write";

  const STRIPE_EXPRESS_URL =
    "https://connect.stripe.com/express/oauth/authorize?client_id=ca_HYMQTCYre4aXjrMlLSabe6otHE9znoen";

  const handleStripeConnect = () => {
    const data = {
      yearly: yearlyCheckbox ? yearly : "",
      monthly: monthlyCheckbox ? monthly : "",
    };
    props.savePayment(data);
    window.location.href = STRIPE_EXPRESS_URL;
  };

  let btnStyle = {};
  if (saveDisable || showLoader) {
    btnStyle = {
      cursor: "default",
      background: "#cccccc",
      color: "#666666",
    };
  }

  const currencyFormat = (value) => {
    const updatedValue =
      value.match(/[0-9]/g) && value.match(/[0-9]/g).join("");

    return updatedValue ? "$" + updatedValue : "";
  };

  // console.log("store payment", props.payment);

  return (
    <div className="container">
      <div className="news-main">
        <div className="News-head">
          <h1>{props.title || "Newsletter Title"}</h1>
          <p>Which plans would you like to offer?</p>
        </div>
        <div className="news-check">
          <div className="news-check-1">
            <label className="cus-che">
              <input
                type="checkbox"
                checked={yearlyCheckbox}
                onChange={() => setYearlyCheckbox(!yearlyCheckbox)}
              />
              <span className="checkmark"></span>
            </label>
            <span>
              Yearly{" "}
              <input
                style={{ borderRadius: "0px" }}
                type="text"
                name="yearly"
                placeholder="$0"
                value={yearly}
                onChange={(e) => setYearly(currencyFormat(e.target.value))}
              />
            </span>
          </div>
          <div className="news-check-2">
            <label className="cus-che">
              <input
                type="checkbox"
                checked={monthlyCheckbox}
                onChange={() => setMonthlyCheckbox(!monthlyCheckbox)}
              />
              <span className="checkmark"></span>
            </label>
            <span>
              Monthly{" "}
              <input
                style={{ borderRadius: "0px" }}
                type="text"
                name="monthly"
                placeholder="$0"
                value={monthly}
                onChange={(e) => setMonthly(currencyFormat(e.target.value))}
              />
            </span>
          </div>
        </div>
        <div className="main-btn-box">
          <button type="button" onClick={handleStripeConnect} className="s-btn">
            <i className="fab fa-stripe-s" style={{ marginRight: "5px" }}></i>{" "}
            {stripeConnected ? "Connected" : "Connect"} with Stripe
          </button>
          <button
            className="save-btn bold"
            disabled={saveDisable || showLoader}
            style={btnStyle}
            onClick={handleSave}
          >
            {showLoader ? <div className="lds-dual-ring"></div> : "Save"}
          </button>
        </div>
        {showMessage && (
          <p style={{ textAlign: "center" }}>Saved successfully!!</p>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  console.log("state", state.newsletter);
  return {
    title: state.newsletter.title,
    payment: state.newsletter.payment,
    newsletterId: state.newsletter.newsletterId,
  };
};

export default connect(mapStateToProps, { refillStore, savePayment })(Plans);

const deleteFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};
