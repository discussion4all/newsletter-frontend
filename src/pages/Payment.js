import React from "react";
import { connect } from "react-redux";
import card from "../images/Card.jpg";

const Payment = (props) => {
  const { title, description, blogPosterURL, payment } = props.newsletter;
  console.log(payment);
  return (
    <div className="container">
      <div className="main-boxes">
        <div
          className="cir"
          style={{ backgroundImage: `url("${blogPosterURL}")` }}
        ></div>
        <h1>{title}</h1>
        <p>{description}</p>
        <h2>
          By{" "}
          <span>
            <i className="fa fa-angle-left" aria-hidden="true"></i>Publisher
            <i className="fa fa-angle-right" aria-hidden="true"></i>
          </span>
        </h2>
        <div className="card-detail">
          <div className="rad-btn">
            <input type="radio" name="text" />
            <span>Yearly</span>
            <h1>{payment.yearly || "$0"}</h1>
          </div>
          <div className="rad-btn">
            <input type="radio" name="text" />
            <span>Monthly</span>
            <h1>{payment.monthly || "$0"}</h1>
          </div>
          <div className="select-mod-1">
            <div className="flex">
              <div className="mod-flx">
                <div className="mob-img">
                  <img src={card} />
                </div>
                <div className="cr-num">
                  <input type="text" name="text" placeholder="Credit Card" />
                </div>
              </div>
              <div className="diflx">
                <div className="date">
                  <input type="text" name="text" placeholder="MM/YY" />
                </div>
                <div className="date cvv">
                  <input type="text" name="text" placeholder="CVC" />
                </div>
              </div>
            </div>
            <button>Subscribe</button>
          </div>
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
