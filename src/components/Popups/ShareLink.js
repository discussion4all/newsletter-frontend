import React, { useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";

const ShareLink = (props) => {
  const { showModal, closeModal, link } = props;
  const [btnTitle, setBtnTitle] = useState("Copy to clipboard");
  const copyInputRef = useRef(null);

  const handleCopy = () => {
    copyInputRef.current.select();
    copyInputRef.current.setSelectionRange(0, 99999);
    document.execCommand("copy");
    setBtnTitle("Copied!");
  };

  return (
    <Modal show={showModal} onHide={closeModal}>
      <div className="close-card">
        <button type="button" className="close" onClick={closeModal}>
          ×
        </button>
      </div>
      <div>
        <div>
          <div className="modal-body text-block">
            <p>Share your newsletter using this link...</p>
            <div className="flex">
              <div className="mod-flx">
                <input
                  type="text"
                  name="text"
                  ref={copyInputRef}
                  value={link}
                  onChange={() => {}}
                />
              </div>
              <div className="tooltip">
                <button
                  type="button"
                  className="ff-r"
                  onClick={handleCopy}
                  onMouseOut={() => setBtnTitle("Copy to clipboard")}
                >
                  <span className="tooltiptext" id="myTooltip">
                    {btnTitle}
                  </span>
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShareLink;
