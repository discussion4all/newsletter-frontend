import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import card from "../images/Card.jpg";
import axios from "axios";
import { BASE_URL } from "../config";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const Payment = (props) => {
  const { title, description, blogPosterURL, payment } = props.newsletter;
  const [cardValue, setCardValue] = useState("");
  const [date, setDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [selected, setSelected] = useState("monthly");
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (payment.yearly !== "") {
      setSelected("yearly");
      return;
    }
  }, [payment]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      cardNo: cardValue,
      date,
      cvc,
      pay: payment[selected],
    };

    const card = elements.getElement(CardElement);
    console.log("card", card);
    const result = await stripe.createToken(card);

    data.token = result.token.id;

    console.log("result", data);
    axios
      .post(`${BASE_URL}/charge-card`, data)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCardNumber = (e) => {
    let { value } = e.target;
    let card = value.match(/[0-9]/g) && value.match(/[0-9]/g).join("");
    let formattedNumber = formatCardNumber(card);

    setCardValue(formattedNumber || "");
  };

  const handleDate = (e) => {
    let { value } = e.target;
    let num = value.match(/[0-9]/g) && value.match(/[0-9]/g).join("");
    let formattedDate = formatDate(num);

    setDate(formattedDate || "");
  };

  const handleCvc = (e) => {
    let { value } = e.target;
    let num = value.match(/[0-9]/g) && value.match(/[0-9]/g).join("");
    setCvc(num);
  };

  const handlePeriod = (e) => {
    setSelected(e.target.value);
  };

  return (
    <div className="container">
      <div className="main-boxes">
        <div
          className="cir"
          style={{
            backgroundImage: `url("${blogPosterURL}")`,
            backgroundColor: !blogPosterURL ? "#000" : "",
          }}
        ></div>
        <h1>{title || "Newsletter Title"}</h1>
        <p>{description || "Newsletter description"}</p>
        <h2>
          By{" "}
          <span>
            <i className="fa fa-angle-left" aria-hidden="true"></i>Publisher
            <i className="fa fa-angle-right" aria-hidden="true"></i>
          </span>
        </h2>
        <div className="max-width-card">
          <div className="card-detail">
            <form onSubmit={handleSubmit}>
              <div className="rad-btn">
                <input
                  type="radio"
                  name="text"
                  checked={selected === "yearly"}
                  value="yearly"
                  onChange={handlePeriod}
                />
                <span>Yearly</span>
                <h1>{payment.yearly || "$0"}</h1>
              </div>
              <div className="rad-btn">
                <input
                  type="radio"
                  name="text"
                  checked={selected === "monthly"}
                  value="monthly"
                  onChange={handlePeriod}
                />
                <span>Monthly</span>
                <h1>{payment.monthly || "$0"}</h1>
              </div>
              <div className="select-mod-1">
                <div className="flex">
                  <div className="mod-flx">
                    <div className="mob-img">
                      <img src={card} alt="card" />
                    </div>
                    <div className="cr-num">
                      <input
                        type="text"
                        name="text"
                        placeholder="Credit Card"
                        required
                        value={cardValue}
                        onChange={handleCardNumber}
                        minLength="19"
                        maxLength="19"
                      />
                    </div>
                  </div>
                  <div className="diflx">
                    <div className="date">
                      <input
                        type="text"
                        name="text"
                        placeholder="MM/YY"
                        minLength="5"
                        maxLength="5"
                        value={date}
                        onChange={handleDate}
                        required
                      />
                    </div>
                    <div className="date cvv">
                      <input
                        type="text"
                        name="text"
                        placeholder="CVC"
                        maxLength="3"
                        minLength="3"
                        value={cvc}
                        onChange={handleCvc}
                        required
                      />
                    </div>
                  </div>
                </div>
                <CardElement />
                <button type="submit" style={{ cursor: "pointer" }}>
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          <h1 className="v-error">
            Credit card information is invalid. Try again
          </h1>
        </div>
      </div>
    </div>
  );
};

const formatCardNumber = (num) => {
  return num && num.match(/.{1,4}/g).join("-");
};

const formatDate = (date) => {
  return date && date.match(/.{1,2}/g).join("/");
};

const mapStateToProps = (state) => {
  return {
    newsletter: state.newsletter,
  };
};

export default connect(mapStateToProps, null)(Payment);
