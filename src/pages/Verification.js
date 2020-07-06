import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";

const Verification = (props) => {
  const { title, description, blogPosterURL } = props.newsletter;
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");
  const [fourth, setFourth] = useState("");

  const firstInput = useRef(null);
  const secondInput = useRef(null);
  const thirdInput = useRef(null);
  const fourthInput = useRef(null);

  const handleNext = () => {
    props.history.push("/payment");
  };

  useEffect(() => {
    if (first && second && third && fourth) {
      handleNext();
    }
  }, [first, second, third, fourth]);

  const handleWrongNumber = () => {
    props.history.push("/phone-entry");
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
        <div className="otp-detail">
          <h1>
            Code sent to <b>(555) 555-5555 </b>
            <span
              style={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={handleWrongNumber}
            >
              Wrong nunber?
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
            />
            <input
              type="text"
              name="text"
              maxLength="1"
              minLength="1"
              value={second}
              ref={secondInput}
              onChange={secondDigit}
            />
            <input
              type="text"
              name="text"
              maxLength="1"
              minLength="1"
              value={third}
              ref={thirdInput}
              onChange={thirdDigit}
            />
            <input
              type="text"
              name="text"
              maxLength="1"
              minLength="1"
              value={fourth}
              ref={fourthInput}
              onChange={fourthDigit}
            />
          </div>
          <p>
            Didn't receive it? <a href="#">Send again</a>
          </p>
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
