import React from "react";
import Modal from "react-bootstrap/Modal";

const SendNow = (props) => {
  const { showModal, closeModal, handleYes } = props;
  return (
    <Modal show={showModal} onHide={closeModal}>
      <div className="close-card"></div>
      <div>
        <div>
          <div className="modal-body text-block send-now">
            <p>Are you sure you want to send the text now?</p>
            <div className="flex send-now-btn">
              <div class="action-btn">
                <button type="button" onClick={handleYes}>
                  Yes
                </button>
              </div>
              <div class="action-btn">
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SendNow;
