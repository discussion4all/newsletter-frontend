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
  const [sampleText, setSampletext] = useState("");
  const [buttonState, setButtonState] = useState(true);
  const [imageInText, setImageInText] = useState(null);
  const [resMainImage, setResMainImage] = useState("");
  const [resTextImage, setResTextImage] = useState("");
  const [addText, setAddText] = useState("");
  const [selectedBtn, setSelectedBtn] = useState(null);
  const [loadingImg, setLoadingImg] = useState(false);
  const [html, setHtml] = useState("");
  const [position, setPosition] = useState(0);

  const sampleInput = useRef(null);
  const history = useHistory();

  const cursorPosition = (event) => {
    var tag = document.getElementById("editable");

    // Creates range object
    var setpos = document.createRange();

    // Creates object for selection
    var set = window.getSelection();
    // console.log(set.getRangeAt(1));
    const currentPosition = set.getRangeAt(0).startOffset;
    // console.log("tag", set.getRangeAt(0));
    setPosition(currentPosition);

    // // Set start position of range
    // setpos.setStart(tag.childNodes[0], 1);

    // // Collapse range within its boundary points
    // // Returns boolean
    // setpos.collapse(true);

    // // Remove all ranges set
    // set.removeAllRanges();

    // // Add range with respect to range object.
    // set.addRange(setpos);

    // // Set cursor on focus
    // tag.focus();
    // console.log("called");
  };

  const submit = (event) => {
    event.preventDefault();
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
      .post(`${BASE_URL}/create`, {
        newsletterId,
        image: resMainImage,
        title,
        description,
        sampleText: html,
      })
      .then((res) => {
        if (res.data.message === "success") {
          history.push({
            pathname: "/subscribe",
          });
        }
      })
      .catch((err) => console.log(err));
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
    return ` <img src=${url} width=50px height="50px alt="small image" style="margin: 0 5px;" /> `;
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
          // console.log("POST", position);
          // console.log(html.slice(0, position));
          // const firstHalf = html.slice(0, position);
          // const lastHalf = html.slice(position);
          // console.log(firstHalf + " % " + lastHalf);
          // // console.log(html, html[position - 1], position);

          // setHtml(firstHalf + tag + lastHalf);

          // setAddText(res.data.path);
        })
        .catch((err) => console.log(err));
      setImageInText(image);
    }
    console.log(imageInText);
  };

  const handleAddToText = async () => {
    // if (resTextImage) {
    //   let newString = sampleText + resTextImage + " ";
    //   setSampletext(newString);
    //   sampleInput.current.focus();
    //   setResTextImage("");
    //   setAddText("");
    //   return;
    // }

    const checkUrlValidity = await axios
      .post(`${BASE_URL}/validate-url`, { url: addText })
      .then((res) => res.data.message)
      .catch((err) => console.log(err));

    console.log(checkUrlValidity);

    if (checkUrlValidity === "valid") {
      setSelectedBtn("add");
      axios
        .post(`${BASE_URL}/short-link`, { link: addText })
        .then((res) => {
          console.log(res);
          let newString = sampleText + res.data.link + " ";
          // console.log("html", html);
          // console.log("POST", position);
          // // console.log(html.slice(0, position));
          // const firstHalf = html.slice(0, position);
          // const lastHalf = html.slice(position);
          // // console.log(firstHalf + " % " + lastHalf);
          // // console.log(html, html[position - 1], position);

          // setHtml(firstHalf + " " + newString + " " + lastHalf);

          setHtml(html + " " + res.data.link);
          setAddText("");
          sampleInput.current.focus();
        })
        .catch((err) => console.log(err));
    } else {
      setAddText("");
    }

    // let newString = sampleText + addText + " ";
    // setSampletext(newString);
    // setAddText("");
    // sampleInput.current.focus();
  };

  let btnStyle = {};
  if (buttonState) {
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
    <form onSubmit={submit} encType="multipart/form-data">
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
        {/* {loadingImg ? <div className="loader"></div> : null} */}
      </div>

      <div className="news-form">
        <div className="input-text">
          <input
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
              />
            </label>
          </button>
          <button type="button" onClick={() => setSelectedBtn("link")}>
            <i className="fa fa-link" aria-hidden="true"></i>
          </button>
        </div>
        <div className="upload-box">
          {selectedBtn === "link" && (
            <>
              <input
                type="text"
                name="text"
                placeholder="Enter link..."
                value={addText}
                onChange={(event) => setAddText(event.target.value)}
              />
              <button
                type="button"
                onClick={handleAddToText}
                style={{ cursor: "pointer" }}
              >
                Add
              </button>
            </>
          )}
        </div>
      </div>
      <Editor
        cursorPosition={cursorPosition}
        reference={sampleInput}
        html={html}
        handleChange={(e) => setHtml(e.target.value)}
      />
      {/* <textarea
        className="text-area"
        placeholder="Enter sample text message..."
        ref={sampleInput}
        value={sampleText}
        onChange={(event) => setSampletext(event.target.value)}
        required
      ></textarea> */}

      <button
        className="create-btn bold"
        type="submit"
        disabled={buttonState}
        style={btnStyle}
      >
        Create
      </button>
    </form>
  );
};

export default connect(null, { saveNewsletter })(NewletterForm);
