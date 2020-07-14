import React, { useState } from "react";
import FileLinkToolbar from "../components/FileLinkToolbar";
import Editor from "../components/Editor";
import PopupShareLink from "../components/Popups/ShareLink";
import PopupConfirmSend from "../components/Popups/ConfirmSendNow";
import PopupSchedule from "../components/Popups/Schedule";
import PopupSentSuccess from "../components/Popups/SentSuccess";

const Dashboard = (props) => {
  const [showShareLinkModal, setShowShareLinkModal] = useState(false);
  const [showSendNowModal, setShowSendNowModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [html, setHtml] = useState("");

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
    setShowSendNowModal(false);
    setShowSuccessModal(true);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const scheduleSave = () => {
    setShowScheduleModal(false);
    setShowSuccessModal(true);
  };

  return (
    <div className="container">
      <PopupShareLink
        showModal={showShareLinkModal}
        closeModal={closeShareModal}
      />
      <PopupConfirmSend
        showModal={showSendNowModal}
        closeModal={closeSendNowModal}
        handleYes={handleYes}
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
            Newsletter Title{" "}
            <span>
              <button type="button" onClick={() => setShowShareLinkModal(true)}>
                Shareable Link
              </button>
            </span>
          </h1>
        </div>
        <div className="ten-text">
          <h2>
            <b>10</b> <span>texts</span>
          </h2>
          <h2>
            <b>100</b> <span>subscribers</span>
          </h2>
        </div>

        <FileLinkToolbar />
        <Editor
          html={html}
          handleChange={(e) => setHtml(e.target.value)}
          customClass="dashboard-editor"
        />
        <div className="btn-box">
          <div className="p-10">
            <button
              className="create-btn bold"
              type="button"
              onClick={() => setShowSendNowModal(true)}
            >
              Send Now
            </button>
          </div>
          <div className="p-10">
            <button
              className="create-btn bold"
              type="button"
              onClick={() => setShowScheduleModal(true)}
            >
              Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
