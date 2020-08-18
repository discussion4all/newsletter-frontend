import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import FileLinkToolbar from "../components/FileLinkToolbar";
import Editor from "../components/Editor";
import PopupShareLink from "../components/Popups/ShareLink";
import PopupConfirmSend from "../components/Popups/ConfirmSendNow";
import PopupSchedule from "../components/Popups/Schedule";
import PopupSentSuccess from "../components/Popups/SentSuccess";
import { BASE_URL, FRONT_BASE_URL } from "../config";

const Dashboard = (props) => {
  const [showShareLinkModal, setShowShareLinkModal] = useState(false);
  const [showSendNowModal, setShowSendNowModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [title, setTitle] = useState("");
  const [noOfSubs, setNoOfSubs] = useState(0);
  const [noOfText, setNoOfText] = useState(0);
  const [html, setHtml] = useState("");
  const [linkStatus, setLinkStatus] = useState("");
  const [sendNowLoading, setSendNowLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/newsletter/${props.match.params.id}`).then((res) => {
      if (res.data.data) {
        const { title, subscribers, textSent } = res.data.data;
        console.log("subscribers", subscribers);
        setNoOfSubs(subscribers.length);
        setNoOfText(textSent);
        setTitle(title);
      }
    });
  }, [props.match.params.id]);

  const createImgTag = (url) => {
    return ` <img src=${url} alt="small image" style="margin: 0 5px; height: 50px; width: 50px" /> `;
  };

  const uploadImageInText = (file) => {
    if (file) {
      const data = new FormData();
      data.append("file", file);

      axios
        .post(`${BASE_URL}/image-upload`, data)
        .then((res) => {
          const tag = createImgTag(encodeURI(res.data.path));
          setHtml(html + tag);
        })
        .catch((err) => console.log(err));
    }
  };

  const addLinkToHtml = async (e, link) => {
    e.preventDefault();
    const checkUrlValidity = await axios
      .post(`${BASE_URL}/link/validate`, { url: link })
      .then((res) => res.data.message)
      .catch((err) => console.log(err));

    if (checkUrlValidity === "valid") {
      axios
        .post(`${BASE_URL}/link/shorten`, { link: link })
        .then((res) => {
          if (res.data.message === "success") {
            setHtml(html + " " + res.data.link);
            editorRef.current.focus();
            setLinkStatus("success");
          }
          if (res.data.message === "invalid") {
            setLinkStatus("invalid");
          }
        })
        .catch((err) => console.log(err));
    } else {
      setLinkStatus("invalid");
    }
  };

  // Modals actions
  const closeShareModal = () => {
    setShowShareLinkModal(false);
  };

  const closeSendNowModal = () => {
    setShowSendNowModal(false);
  };

  const closeScheduleModal = () => {
    setShowScheduleModal(false);
  };

  const handleYes = () => {
    setSendNowLoading(true);
    axios
      .post(`${BASE_URL}/send-text/now`, {
        text: html,
        newsletterId: props.match.params.id,
      })
      .then((res) => {
        if (res.data.message === "success") {
          console.log("response", res.data);
          setShowError(false);
          setShowSendNowModal(false);
          setShowSuccessModal(true);
          setSendNowLoading(false);
          setNoOfText(noOfText + 1);
          setHtml("");
        }
      })
      .catch((err) => {
        console.log(err);
        setSendNowLoading(false);
        setShowSendNowModal(false);
        setShowError(true);
      });
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const scheduleSave = (time) => {
    const data = {
      newsletterId: props.match.params.id,
      time,
      text: html,
    };
    console.log(time);
    axios
      .post(`${BASE_URL}/send-text/schedule`, data)
      .then((res) => {
        if (res.data.message === "success") {
          console.log(res.data);
          setShowError(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setShowError(false);
      });
    setShowScheduleModal(false);
    setShowSuccessModal(true);
  };

  let actionBtns = { cursor: "default", background: "rgb(204, 204, 204)" };
  if (html.length > 0) {
    actionBtns = {};
  }

  return (
    <div className="container">
      <PopupShareLink
        showModal={showShareLinkModal}
        closeModal={closeShareModal}
        link={`${FRONT_BASE_URL}/phone-entry/${props.match.params.id}`}
      />
      <PopupConfirmSend
        showModal={showSendNowModal}
        closeModal={closeSendNowModal}
        handleYes={handleYes}
        loading={sendNowLoading}
      />
      <PopupSchedule
        showModal={showScheduleModal}
        closeModal={closeScheduleModal}
        scheduleSave={scheduleSave}
      />
      <PopupSentSuccess
        showModal={showSuccessModal}
        closeModal={closeSuccessModal}
      />
      <div className="news-main">
        <div className="News-head-subs">
          <h1>
            {title || "Newsletter Title"}{" "}
            <span>
              <button type="button" onClick={() => setShowShareLinkModal(true)}>
                Shareable Link
              </button>
            </span>
          </h1>
        </div>
        <div className="ten-text pb-1">
          <h2>
            <b>{noOfText || 0}</b> <span>texts</span>
          </h2>
          <h2>
            <b>{noOfSubs || 0}</b> <span>subscribers</span>
          </h2>
        </div>

        <FileLinkToolbar
          uploadImageInText={uploadImageInText}
          addLinkToHtml={addLinkToHtml}
          linkStatus={linkStatus}
        />
        <Editor
          html={html}
          reference={editorRef}
          handleChange={(e) => setHtml(e.target.value)}
          customClass="dashboard-editor"
        />
        <div className="btn-box">
          <div className="p-10">
            <button
              className="create-btn bold"
              type="button"
              onClick={() => setShowSendNowModal(true)}
              style={actionBtns}
              disabled={html.length === 0}
            >
              Send Now
            </button>
          </div>
          <div className="p-10">
            <button
              className="create-btn bold"
              type="button"
              onClick={() => setShowScheduleModal(true)}
              style={actionBtns}
              disabled={html.length === 0}
            >
              Schedule
            </button>
          </div>
        </div>
        {showError && (
          <p className="v-error">
            Error sending out text message. Please try again later.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
