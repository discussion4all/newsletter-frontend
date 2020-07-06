import React from "react";
import { connect } from "react-redux";

const Verification = (props) => {
  const { title, description, blogPosterURL } = props.newsletter;

  const handleNext = () => {
    props.history.push("/payment");
  };

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
        <div className="otp-detail">
          <h1>Code sent to (555) 555-5555</h1>
          <div className="otp-input">
            <input type="text" name="txet" />
            <input type="text" name="txet" />
            <input type="text" name="txet" />
            <input type="text" name="txet" />
          </div>
          <p>
            Didn't receive it? <a href="#">Send again</a>
          </p>
        </div>
        <button type="button" onClick={handleNext}>
          next
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    newsletter: state.newsletter,
  };
};

export default connect(mapStateToProps, null)(Verification);
