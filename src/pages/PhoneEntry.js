import React, { useState } from "react";
import { connect } from "react-redux";
import dummy from "../images/vs-img.jpg";

const PhoneEntry = (props) => {
  const [showSample, setShowSample] = useState(false);

  const { title, description, blogPosterURL, sampleText } = props.newsletter;

  const handleSignUp = () => {
    props.history.push("/phone-verification");
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
        <div className="select-mod">
          <div className="flex">
            <div className="mod-flx">
              <select>
                <option>+1</option>
                <option>+91</option>
              </select>
              <input type="text" name="text" placeholder="(555) 555-5555" />
            </div>
            <button type="button" onClick={handleSignUp}>
              Sign Up
            </button>
          </div>
          <a
            href="#"
            className="view-btn"
            onClick={() => setShowSample(!showSample)}
          >
            view sample
          </a>
          {showSample && (
            <div
              className="vs-box"
              dangerouslySetInnerHTML={{ __html: sampleText }}
            ></div>
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

export default connect(mapStateToProps, null)(PhoneEntry);
