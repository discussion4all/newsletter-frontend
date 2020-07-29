import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import card from "../images/credit-card.png";
import axios from "axios";
import { BASE_URL, FRONT_BASE_URL } from "../config";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import Modal from "react-bootstrap/Modal";

const Payment = (props) => {
  const { title, description, blogPosterURL, payment } = props.newsletter;
  const [selected, setSelected] = useState("monthly");
  const [showModal, setShowModal] = useState(false);
  const [showCardInvalid, setShowCardInvalid] = useState(false);
  const [cardNumberRef, setCardNumberRef] = useState(null);
  const [cardExpiryRef, setCardExpiryRef] = useState(null);
  const [cardCvcRef, setCardCvcRef] = useState(null);
  const [btnTitle, setBtnTitle] = useState("Copy to clipboard");
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const copyInputRef = useRef(null);

  useEffect(() => {
    if (payment.yearly !== "") {
      setSelected("yearly");
      return;
    }
  }, [payment]);

  useEffect(() => {
    cardNumberRef && cardNumberRef.focus();
  }, [cardNumberRef]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowCardInvalid(false);
    setLoading(true);

    const card = elements.getElement(
      CardNumberElement,
      CardExpiryElement,
      CardCvcElement
    );

    const result = await stripe.createToken(card);

    if (result.hasOwnProperty("error")) {
      console.log("show error...");
      setShowCardInvalid(true);
      setLoading(false);
      return;
    }

    const data = {
      plan: selected,
      token: result.token.id,
      phoneNumber: props.newsletter.phoneNumber,
      newsletterId: props.newsletter.newsletterId,
    };

    try {
      axios.post(`${BASE_URL}/newsletter/subscribe`, data).then(async (res) => {
        if (res.data.message === "success") {
          // const result = await stripe.confirmCardPayment(
          //   res.data.client_secret,
          //   {
          //     payment_method: {
          //       card: card,
          //       billing_details: {
          //         name: "Pranav",
          //       },
          //     },
          //   }
          // );

          // if (result.error) {
          //   setShowCardInvalid(true);
          //   setLoading(false);
          //   console.log("error: ", result);
          // } else {
          //   // The payment has been processed!
          //   if (result.paymentIntent.status === "succeeded") {
          //     setShowModal(true);
          //     cardNumberRef.clear();
          //     cardExpiryRef.clear();
          //     cardCvcRef.clear();
          //     setLoading(false);
          //   }
          // }
          setShowModal(true);
          cardNumberRef.clear();
          cardExpiryRef.clear();
          cardCvcRef.clear();
          setLoading(false);
        } else {
          setShowCardInvalid(true);
          setLoading(false);
        }
      });
    } catch (err) {
      setLoading(false);
      setShowCardInvalid(true);
    }
  };

  const handlePeriod = (e) => {
    setSelected(e.target.value);
  };

  const handleCopy = () => {
    copyInputRef.current.select();
    copyInputRef.current.setSelectionRange(0, 99999);
    document.execCommand("copy");
    setBtnTitle("Copied!");
  };

  const handleCardNumber = (event) => {
    if (event.complete || event.error) {
      cardExpiryRef && cardExpiryRef.focus();
    }
  };

  const handleExpiryDate = (event) => {
    if (event.complete || event.error) {
      cardCvcRef && cardCvcRef.focus();
    }
  };

  let subscribeBtn = {
    cursor: "pointer",
  };
  if (loading) {
    subscribeBtn = {
      cursor: "default",
      background: "rgb(204, 204, 204)",
    };
  }

  return (
    <div className="container">
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <div className="close-card">
          <button
            type="button"
            className="close"
            onClick={() => setShowModal(false)}
          >
            ×
          </button>
        </div>
        <div>
          <div>
            <div className="modal-body text-block">
              <h1>You're subscribed!</h1>
              <p>Share this newsletter with others...</p>
              <div className="flex">
                <div className="mod-flx">
                  <input
                    type="text"
                    ref={copyInputRef}
                    name="text"
                    value={`${FRONT_BASE_URL}/phone-entry/${props.newsletter.newsletterId}`}
                    onChange={() => {}}
                    style={{
                      fontSize: "1rem",
                      borderRadius: "0px",
                      border: "1px solid black",
                      paddingTop: "0px",
                    }}
                  />
                </div>
                <div className="tooltip">
                  <button
                    type="button"
                    onClick={handleCopy}
                    onMouseOut={() => setBtnTitle("Copy to clipboard")}
                  >
                    <span className="tooltiptext" id="myTooltip">
                      {btnTitle}
                    </span>
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
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
              {payment.yearly ? (
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
              ) : null}
              {payment.monthly ? (
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
              ) : null}

              <div className="select-mod-1">
                <div className="flex">
                  <div className="mod-flx">
                    <div className="mob-img">
                      <img src={card} alt="card" />
                    </div>
                    <div className="cr-num">
                      <CardNumberElement
                        onReady={(e) => setCardNumberRef(e)}
                        options={{
                          style: {
                            invalid: {
                              color: "#000",
                            },
                          },
                        }}
                        onChange={handleCardNumber}
                      />
                    </div>
                  </div>
                  <div className="diflx">
                    <div className="date">
                      <CardExpiryElement
                        onReady={(e) => setCardExpiryRef(e)}
                        options={{
                          style: {
                            invalid: {
                              color: "#000",
                            },
                          },
                        }}
                        onChange={handleExpiryDate}
                      />
                    </div>
                    <div className="date cvv">
                      <CardCvcElement onReady={(e) => setCardCvcRef(e)} />
                    </div>
                  </div>
                </div>

                <button type="submit" style={subscribeBtn} disabled={loading}>
                  {loading ? (
                    <div className="lds-dual-ring"></div>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>
            </form>
          </div>
          {showCardInvalid && (
            <h1 className="v-error fw-500">
              <i>Credit card information is invalid. Try again</i>
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    newsletter: state.newsletter,
  };
};

export default connect(mapStateToProps, null)(Payment);
