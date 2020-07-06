import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { BASE_URL } from "../config";
import { refillStore, savePayment } from "../actions/newsletterActions";

const Subscribe = (props) => {
  const [yearly, setYearly] = useState("");
  const [monthly, setMonthly] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [stripeConnected, setStripeConnected] = useState(false);
  //const [userId, setUserId] = useState(0);
  const queryString = window.location.search;
  const [userStatus, setUserStatus] = useState(false);
  const [yearlyCheckbox, setYearlyCheckbox] = useState(false);
  const [monthlyCheckbox, setMonthlyCheckbox] = useState(false);
  const [saveDisable, setSaveDisable] = useState(true);
  // console.log(props.payment);
  const handleSave = () => {
    // let id = Math.floor(Math.random() * 100000);
    // setUserId(id);
    console.log("clicked");
    const data = {
      yearly: yearlyCheckbox ? yearly : "",
      monthly: monthlyCheckbox ? monthly : "",
    };
    axios
      .post(`${BASE_URL}/payment`, data)
      .then((res) => {
        setShowMessage(true);
        console.log(data);
        props.savePayment(data);
        deleteFromLocalStorage("yearly");
        deleteFromLocalStorage("monthly");
        props.history.push("/phone-entry");
      })
      .catch((err) => console.log(err));
  };

  // check if user is already connected to stripe
  // useEffect(() => {
  //   axios
  //     .get(`${BASE_URL}/user-info`)
  //     .then((res) => {
  //       // console.log(res);
  //       if (res.data.user === "found") {
  //         setUserStatus(true);
  //         // if (res.data.userData.monthly > 0) {
  //         //   setMonthly(res.data.userData.monthly.toString());
  //         // }
  //         // if (res.data.userData.yearly > 0) {
  //         //   setYearly(res.data.userData.yearly.toString());
  //         // }
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

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
      axios
        .post(`${BASE_URL}/stripe`, {
          id: 1,
          code,
        })
        .then((res) => {
          if (res.data.message === "success") {
            setStripeConnected(true);
            // setStripeData({
            //   accessToken: res.data.access_token,
            //   refreshToken: res.data.refresh_token,
            //   userId: res.data.stripe_user_id,
            // });
          }
        })
        .catch((err) => console.log(err));
    }
  }, [queryString]);

  // set checkbox values
  useEffect(() => {
    if (yearly.length > 0) {
      setYearlyCheckbox(true);
      // saveToLocalStorage("yearly", yearly);
    } else {
      setYearlyCheckbox(false);
    }
    if (monthly.length > 0) {
      setMonthlyCheckbox(true);
      // saveToLocalStorage("monthly", monthly);
    } else {
      setMonthlyCheckbox(false);
    }
  }, [yearly, monthly]);

  useEffect(() => {
    setMonthly(props.payment.monthly);
    setYearly(props.payment.yearly);
  }, [props.payment]);

  // useEffect(() => {
  //   props.refillStore();
  // }, []);

  const STRIPE_URL =
    "https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_HYMQTCYre4aXjrMlLSabe6otHE9znoen&scope=read_write";

  const handleStripeConnect = () => {
    const data = {
      yearly: yearlyCheckbox ? yearly : "",
      monthly: monthlyCheckbox ? monthly : "",
    };
    props.savePayment(data);
    window.location.href = STRIPE_URL;
  };

  let btnStyle = {};
  if (saveDisable) {
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
          <p>Which plan would you like to offer?</p>
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
            disabled={saveDisable}
            style={btnStyle}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
        {showMessage && (
          <p style={{ textAlign: "center" }}>Saved successfully!!</p>
        )}
      </div>
      {/* {stripeData && (
        <div>
          <ul>
            <li>access token -{stripeData.accessToken}</li>
            <li>refresh token - {stripeData.refreshToken}</li>
            <li>user id - {stripeData.userId}</li>
          </ul>
        </div>
      )} */}
    </div>
  );
};

const mapStateToProps = (state) => {
  console.log("state", state.newsletter);
  return {
    title: state.newsletter.title,
    payment: state.newsletter.payment,
  };
};

export default connect(mapStateToProps, { refillStore, savePayment })(
  Subscribe
);

const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const deleteFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};
