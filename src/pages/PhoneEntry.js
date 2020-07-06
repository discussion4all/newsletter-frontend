import React, { useState } from "react";
import { connect } from "react-redux";
import dummy from "../images/vs-img.jpg";

const PhoneEntry = (props) => {
  const [showSample, setShowSample] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const { title, description, blogPosterURL, sampleText } = props.newsletter;

  const handleSignUp = () => {
    props.history.push("/phone-verification");
  };

  const handlePhoneNumber = (e) => {
    const value =
      e.target.value.match(/[0-9]/g) && e.target.value.match(/[0-9]/g).join("");
    console.log("value", value);
    let formated;
    if (value && value.length >= 7) {
      formated = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(
        6
      )}`;
      // formated = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else if (value && value.length >= 4) {
      // formated = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(
      //   6
      // )}`;
      formated = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else {
      formated = value;
    }

    setPhoneNumber(formated || "");
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
        <div className="select-mod">
          <form onSubmit={handleSignUp}>
            <div className="flex">
              <div className="mod-flx">
                <select>
                  <option>+1</option>
                  <option>+91</option>
                </select>
                <input
                  type="text"
                  name="text"
                  value={phoneNumber}
                  placeholder="(555) 555-5555"
                  maxLength="14"
                  minLength="14"
                  onChange={handlePhoneNumber}
                />
              </div>
              <button type="submit">Sign Up</button>
            </div>
          </form>

          <a
            href="#"
            className="view-btn"
            onClick={() => setShowSample(!showSample)}
          >
            view sample
          </a>
          {showSample && sampleText && (
            <div
              className="vs-box"
              dangerouslySetInnerHTML={{ __html: sampleText }}
            ></div>
          )}
          {showSample && !sampleText && (
            <div className="vs-box">
              <p>"failture is success in progress." -- Albert Einstein</p>
              <img src={dummy} className="vs-img"></img>
            </div>
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
