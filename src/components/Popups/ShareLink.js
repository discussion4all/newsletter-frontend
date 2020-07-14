import React from "react";
import Modal from "react-bootstrap/Modal";

const ShareLink = (props) => {
  const { showModal, closeModal } = props;
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
                <input type="text" name="text" />
              </div>
              <div className="tooltip">
                <button type="button">Copy</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShareLink;
