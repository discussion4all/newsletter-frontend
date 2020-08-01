import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import dummy from "../images/vs-img.jpg";
import { BASE_URL } from "../config";
import { savePhoneNumber, saveNewsletter } from "../actions/newsletterActions";

const PhoneEntry = (props) => {
  const [showSample, setShowSample] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [showError, setShowError] = useState(false);

  const {
    title,
    description,
    blogPosterURL,
    sampleText,
    payment,
  } = props.newsletter;

  useEffect(() => {
    axios.get(`${BASE_URL}/newsletter/${props.match.params.id}`).then((res) => {
      if (res.data.data) {
        const {
          description,
          imageUrl,
          newsletterId,
          sampleText,
          title,
          plans,
        } = res.data.data;

        props.saveNewsletter({
          title,
          description,
          html: sampleText,
          imgURL: imageUrl,
          newsletterId,
          payment: {
            ...payment,
            monthly: plans.monthly,
            yearly: plans.yearly,
          },
        });
      }
    });
  }, [props.match.params.id]);

  const handleSignUp = (event) => {
    event.preventDefault();
    props.savePhoneNumber(countryCode + phoneNumber);
    axios
      .post(`${BASE_URL}/verification-code/send`, {
        phoneNumber: countryCode + phoneNumber,
      })
      .then((res) => {
        if (res.data.message === "success") {
          props.history.push(`/phone-verification`);
        }
        if (res.data.message === "invalid no") {
          setShowError(true);
        }
      })
      .catch((err) => console.log(err));
    // props.history.push("/phone-verification");
  };

  const handlePhoneNumber = (e) => {
    const maxLengthMatch = e.target.value.match(/[0-9() -]{15}/);
    if (maxLengthMatch) {
      return;
    }
    const value =
      e.target.value.match(/[0-9]/g) && e.target.value.match(/[0-9]/g).join("");
    // console.log("value", value);
    let formated;
    if (value && value.length >= 7) {
      formated = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(
        6
      )}`;
    } else if (value && value.length >= 4) {
      formated = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else {
      formated = value;
    }

    setPhoneNumber(formated || "");
  };

  const handleCountryCode = (e) => {
    console.log(e.target.value);
    setCountryCode(e.target.value);
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
                <select
                  onChange={handleCountryCode}
                  value={countryCode}
                  style={{ fontSize: "1rem" }}
                >
                  <option value="+1">+1</option>
                  <option value="+91">+91</option>
                </select>
                <input
                  type="text"
                  name="text"
                  value={phoneNumber}
                  placeholder="(555) 555-5555"
                  onChange={handlePhoneNumber}
                  style={{
                    fontSize: "1rem",
                    borderRadius: "0px",
                    border: "1px solid black",
                    paddingTop: "0px",
                  }}
                  inputMode="numeric"
                  autoComplete="home tel"
                />
              </div>
              <button type="submit">Sign Up</button>
            </div>
          </form>
          <div className="valid">
            <a
              href="#"
              className="view-btn"
              onClick={() => setShowSample(!showSample)}
              style={{ fontSize: "1rem" }}
            >
              view sample
            </a>
            {showError && (
              <span>
                <i>Enter a valid U.S. phone number.</i>
              </span>
            )}
          </div>

          {showSample && sampleText && (
            <div
              className="vs-box"
              dangerouslySetInnerHTML={{ __html: sampleText }}
            ></div>
          )}
          {showSample && !sampleText && (
            <div className="vs-box">
              <p style={{ fontSize: "1rem" }}>
                "failture is success in progress." -- Albert Einstein
              </p>
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

export default connect(mapStateToProps, { savePhoneNumber, saveNewsletter })(
  PhoneEntry
);
