import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import card from "../images/Card.jpg";
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

    const card = elements.getElement(
      CardNumberElement,
      CardExpiryElement,
      CardCvcElement
    );

    const result = await stripe.createToken(card);

    if (result.hasOwnProperty("error")) {
      console.log("show error...");
      setShowCardInvalid(true);
      return;
    }

    const data = {
      pay: payment[selected],
      token: result.token.id,
    };

    console.log("data to send...", data);

    try {
      axios.post(`${BASE_URL}/charge-card`, data).then((res) => {
        console.log(res);
        if (res.data.charge && res.data.charge.status === "succeeded") {
          console.log("payment made...", res.data);
          setShowModal(true);
          cardNumberRef.clear();
          cardExpiryRef.clear();
          cardCvcRef.clear();
        } else {
          setShowCardInvalid(true);
        }
      });
    } catch (err) {
      setShowCardInvalid(true);
    }
  };

  const handlePeriod = (e) => {
    setSelected(e.target.value);
  };

  const handleCopy = () => {
    console.log(copyInputRef);
    copyInputRef.current.select();
    copyInputRef.current.setSelectionRange(0, 99999);
    document.execCommand("copy");
  };

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
              <p>Share this newslatter with others..</p>
              <div className="flex">
                <div className="mod-flx">
                  <input
                    type="text"
                    ref={copyInputRef}
                    name="text"
                    value={`${FRONT_BASE_URL}/phone-entry/${props.newsletter.newsletterId}`}
                    onChange={() => {}}
                  />
                </div>
                <button type="button" onClick={handleCopy}>
                  Copy
                </button>
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
                      <CardNumberElement onReady={(e) => setCardNumberRef(e)} />
                    </div>
                  </div>
                  <div className="diflx">
                    <div className="date">
                      <CardExpiryElement onReady={(e) => setCardExpiryRef(e)} />
                    </div>
                    <div className="date cvv">
                      <CardCvcElement onReady={(e) => setCardCvcRef(e)} />
                    </div>
                  </div>
                </div>

                <button type="submit" style={{ cursor: "pointer" }}>
                  Subscribe
                </button>
              </div>
            </form>
          </div>
          {showCardInvalid && (
            <h1 className="v-error">
              Credit card information is invalid. Try again
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
