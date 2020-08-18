import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../config";

const Verification = (props) => {
  const {
    title,
    description,
    blogPosterURL,
    phoneNumber,
    newsletterId,
  } = props.newsletter;
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");
  const [fourth, setFourth] = useState("");
  const [showError, setShowError] = useState(false);
  const [countClick, setCountClick] = useState(0);

  const firstInput = useRef(null);
  const secondInput = useRef(null);
  const thirdInput = useRef(null);
  const fourthInput = useRef(null);

  const handleNext = () => {
    const code = first + second + third + fourth;
    axios
      .post(`${BASE_URL}/verification-code/verify`, { code, phoneNumber })
      .then((res) => {
        console.log(res);
        if (res.data.verifyStatus !== "approved") {
          setShowError(true);
          setFirst("");
          setSecond("");
          setThird("");
          setFourth("");
          firstInput.current.focus();
          return;
        }
        props.history.push("/payment");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    firstInput.current.focus();
  }, []);

  useEffect(() => {
    if (first && second && third && fourth) {
      handleNext();
    }
  }, [first, second, third, fourth]);

  const handleWrongNumber = () => {
    props.history.push(`/phone-entry/${newsletterId}`);
  };

  const firstDigit = (e) => {
    let value = onlyNumbers(e.target.value);
    setFirst(value || "");
    if (e.target.value !== "") {
      secondInput.current.focus();
      secondInput.current.select();
    }
  };

  const secondDigit = (e) => {
    let value = onlyNumbers(e.target.value);
    setSecond(value || "");
    if (e.target.value !== "") {
      thirdInput.current.focus();
      thirdInput.current.select();
    }
  };

  const thirdDigit = (e) => {
    let value = onlyNumbers(e.target.value);
    setThird(value || "");
    if (e.target.value !== "") {
      fourthInput.current.focus();
      fourthInput.current.select();
    }
  };

  const fourthDigit = (e) => {
    let value = onlyNumbers(e.target.value);

    setFourth(value || "");
  };

  const handlePaste = (e) => {
    const pasteValue = e.clipboardData.getData("text");

    if (!isNaN(pasteValue) && pasteValue.length === 4) {
      setFirst(pasteValue[0]);
      setSecond(pasteValue[1]);
      setThird(pasteValue[2]);
      setFourth(pasteValue[3]);
    }
  };

  const handleSendAgain = () => {
    setCountClick(countClick + 1);
    console.log("cliked", phoneNumber);
    axios
      .post(`${BASE_URL}/verification-code/send`, { phoneNumber })
      .then((res) => {
        if (res.data.message === "success") {
          // props.history.push("/phone-verification");
          console.log("sent");
          firstInput.current.focus();
        }
        if (res.data.message === "invalid no") {
          setShowError(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const formattedNumber = (number) => {
    if (number.slice(0, 2) === "+1") {
      return number.slice(2);
    }
    return number.slice(3);
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
        <div className="max-width-opt">
          <div className="otp-detail">
            <h1>
              Code sent to{" "}
              <b>
                {(phoneNumber && formattedNumber(phoneNumber)) ||
                  "(555) 555-5555"}
              </b>
              .
              <span
                style={{
                  textDecoration: "underline",
                  cursor: "pointer",
                  marginLeft: "5px",
                }}
                onClick={handleWrongNumber}
              >
                Wrong number?
              </span>
            </h1>
            <div className="otp-input">
              <input
                type="text"
                name="text"
                maxLength="1"
                minLength="1"
                value={first}
                onPaste={handlePaste}
                ref={firstInput}
                onChange={firstDigit}
                pattern="[0-9]*"
                inputMode="numeric"
              />
              <input
                type="text"
                name="text"
                maxLength="1"
                minLength="1"
                value={second}
                ref={secondInput}
                onChange={secondDigit}
                pattern="[0-9]*"
                inputMode="numeric"
              />
              <input
                type="text"
                name="text"
                maxLength="1"
                minLength="1"
                value={third}
                ref={thirdInput}
                onChange={thirdDigit}
                pattern="[0-9]*"
                inputMode="numeric"
              />
              <input
                type="text"
                name="text"
                maxLength="1"
                minLength="1"
                value={fourth}
                ref={fourthInput}
                onChange={fourthDigit}
                pattern="[0-9]*"
                inputMode="numeric"
              />
            </div>
            <p>
              Didn't receive it?{" "}
              <button
                className="send-again"
                onClick={handleSendAgain}
                disabled={countClick >= 3}
              >
                Send again.
              </button>
            </p>
          </div>

          {showError && (
            <h1
              className="v-error"
              style={{ margin: "0 10px", fontWeight: "600" }}
            >
              Code is incorrect. Try again.
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

const onlyNumbers = (value) => {
  return value.match(/[0-9]/g) && value.match(/[0-9]/g).join("");
};

const mapStateToProps = (state) => {
  return {
    newsletter: state.newsletter,
  };
};

export default connect(mapStateToProps, null)(Verification);
