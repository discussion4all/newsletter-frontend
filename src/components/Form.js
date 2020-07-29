import React, { useState, useEffect, useRef } from "react";
import uploadImg from "../images/file-upload.png";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import { BASE_URL } from "../config";
import Editor from "./Editor";
import { saveNewsletter } from "../actions/newsletterActions";

const NewletterForm = (props) => {
  const [mainImage, setMainImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [buttonState, setButtonState] = useState(true);
  const [imageInText, setImageInText] = useState(null);
  const [resMainImage, setResMainImage] = useState("");
  const [resTextImage, setResTextImage] = useState("");
  const [addText, setAddText] = useState("");
  const [selectedBtn, setSelectedBtn] = useState(null);
  const [loadingImg, setLoadingImg] = useState(false);
  const [html, setHtml] = useState("");
  const [position, setPosition] = useState(0);
  const [showLoader, setShowLoader] = useState(false);

  const sampleInput = useRef(null);
  const history = useHistory();

  const cursorPosition = (event) => {
    var set = window.getSelection();
    const currentPosition = set.getRangeAt(0).startOffset;

    setPosition(currentPosition);
  };

  const submit = (event) => {
    event.preventDefault();
    setShowLoader(true);
    console.log(description, html, resMainImage);
    const newsletterId = Math.floor(Math.random() * 1000000);

    props.saveNewsletter({
      title,
      description,
      html,
      imgURL: resMainImage,
      newsletterId,
    });

    axios
      .post(`${BASE_URL}/newsletter/create`, {
        newsletterId,
        image: resMainImage,
        title,
        description,
        sampleText: html,
      })
      .then((res) => {
        if (res.data.message === "success") {
          setShowLoader(false);
          history.push({
            pathname: "/plans",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setShowLoader(false);
      });
  };

  useEffect(() => {
    if (mainImage && title && description && html) {
      console.log("here");
      setButtonState(false);
      return;
    }
    setButtonState(true);
    return;
  }, [mainImage, title, description, html]);

  const uploadImage = (image) => {
    if (image) {
      setLoadingImg(true);
      const data = new FormData();
      data.append("file", image);

      axios
        .post(`${BASE_URL}/image-upload`, data)
        .then((res) => {
          setLoadingImg(false);
          setResMainImage(encodeURI(res.data.path));
        })
        .catch((err) => {
          setLoadingImg(false);
          console.log(err);
        });

      setMainImage(image);
    }
  };

  const createImgTag = (url) => {
    console.log(url);
    return ` <img src=${url} alt="small image" style="margin: 0 5px; height: 50px; width: 50px" /> `;
  };

  const uploadImageInText = (image) => {
    if (image) {
      const data = new FormData();
      data.append("file", image);

      axios
        .post(`${BASE_URL}/image-upload`, data)
        .then((res) => {
          setResTextImage(res.data.path);
          const tag = createImgTag(encodeURI(res.data.path));
          setHtml(html + tag);
        })
        .catch((err) => console.log(err));
      setImageInText(image);
    }
    console.log(imageInText);
  };

  const handleAddToText = async (e) => {
    e.preventDefault();
    const checkUrlValidity = await axios
      .post(`${BASE_URL}/link/validate`, { url: addText })
      .then((res) => res.data.message)
      .catch((err) => console.log(err));

    console.log(checkUrlValidity);

    if (checkUrlValidity === "valid") {
      axios
        .post(`${BASE_URL}/link/shorten`, { link: addText })
        .then((res) => {
          if (res.data.link) {
            setSelectedBtn("add");
            console.log(res);
            // let newString = sampleText + res.data.link + " ";
            setHtml(html + " " + res.data.link);
            setAddText("");
            sampleInput.current.focus();
          }
          if (res.data.message === "invalid") {
            setAddText("");
          }
        })
        .catch((err) => console.log(err));
    } else {
      setAddText("");
    }
  };

  let btnStyle = {};
  if (buttonState || showLoader) {
    btnStyle = {
      cursor: "default",
      background: "#cccccc",
      color: "#666666",
    };
  }
  let imgStyle = {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
  };

  let coverImgStyle = {
    backgroundImage: `url("${resMainImage}")`,
    height: "100px",
    width: "100px",
    margin: "0 auto",
    backgroundSize: "cover",
    borderRadius: "50%",
    backgroundPosition: "center",
  };
  // console.log(position);
  return (
    <>
      <div className="img-upload">
        {loadingImg ? (
          <div className="loader file"></div>
        ) : resMainImage ? (
          <div style={coverImgStyle} />
        ) : (
          <label className="file">
            <img src={uploadImg} alt="upload button" />
            <input
              type="file"
              id="file"
              aria-label="File browser example"
              accept="image/x-png,image/jpeg"
              onChange={(event) => uploadImage(event.target.files[0])}
              required
            />
          </label>
        )}
      </div>

      <div className="news-form">
        <div className="input-text">
          <input
            style={{ borderRadius: "0px" }}
            type="text"
            name="text"
            placeholder="Title"
            minLength="1"
            maxLength="50"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>
      </div>
      <textarea
        className="des"
        placeholder="Description"
        minLength="1"
        maxLength="250"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        required
      ></textarea>
      <div className="up-box">
        <div className="icon-box">
          <button type="button">
            <label className="file">
              <i
                className="fa fa-picture-o"
                aria-hidden="true"
                onClick={() => setSelectedBtn("image")}
              ></i>
              <input
                type="file"
                id="file"
                aria-label="File browser example"
                accept="image/x-png,image/jpeg,image/gif"
                onChange={(event) => uploadImageInText(event.target.files[0])}
                style={{ height: "19px", width: "19px", display: "none" }}
              />
            </label>
          </button>
          <button type="button" onClick={() => setSelectedBtn("link")}>
            <i className="fa fa-link" aria-hidden="true"></i>
          </button>
        </div>
        <div className="upload-box">
          {selectedBtn === "link" && (
            <form onSubmit={handleAddToText}>
              <input
                type="text"
                name="text"
                placeholder="Enter link..."
                value={addText}
                onChange={(event) => setAddText(event.target.value)}
              />
              <button type="submit" style={{ cursor: "pointer" }}>
                Add
              </button>
            </form>
          )}
        </div>
      </div>
      <Editor
        cursorPosition={cursorPosition}
        reference={sampleInput}
        html={html}
        handleChange={(e) => setHtml(e.target.value)}
      />

      <button
        className="create-btn bold"
        onClick={submit}
        disabled={buttonState || showLoader}
        style={btnStyle}
      >
        {showLoader ? <div className="lds-dual-ring"></div> : "Create"}
      </button>
    </>
  );
};

export default connect(null, { saveNewsletter })(NewletterForm);
