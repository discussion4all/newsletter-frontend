import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

const Payment = (props) => {
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
  const [title, setTitle] = useState(
    props.location.state ? props.location.state.title : ""
  );

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
        deleteFromLocalStorage("title");
        deleteFromLocalStorage("yearly");
        deleteFromLocalStorage("monthly");
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
    if ((yearly || monthly) && stripeConnected) {
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
      saveToLocalStorage("yearly", yearly);
    } else {
      setYearlyCheckbox(false);
    }
    if (monthly.length > 0) {
      setMonthlyCheckbox(true);
      saveToLocalStorage("monthly", monthly);
    } else {
      setMonthlyCheckbox(false);
    }
  }, [yearly, monthly]);

  useEffect(() => {
    console.log("called", props.location.state);
    if (props.location.state) {
      saveToLocalStorage("title", props.location.state.title);
    } else {
      const titleFromLocal = getFromLocalStorage("title");
      const yearlyFromLocal = getFromLocalStorage("yearly");
      const monthlyFromLocal = getFromLocalStorage("monthly");
      console.log(titleFromLocal);
      setTitle(titleFromLocal);
      setYearly(yearlyFromLocal || "");
      setMonthly(monthlyFromLocal || "");
    }
  }, []);

  const STRIPE_URL =
    "https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_HYMQTCYre4aXjrMlLSabe6otHE9znoen&scope=read_write";

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

  return (
    <div className="container">
      <div className="news-main">
        <div className="News-head">
          <h1>{title || "Newsletter Title"}</h1>
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
          <a className="s-btn" href={STRIPE_URL}>
            <i className="fab fa-stripe-s" style={{ marginRight: "5px" }}></i>{" "}
            {stripeConnected ? "Connected" : "Connect"} with Stripe
          </a>
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

export default Payment;

const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const deleteFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};
