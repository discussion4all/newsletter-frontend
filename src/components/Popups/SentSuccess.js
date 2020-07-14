import React from "react";
import Modal from "react-bootstrap/Modal";

const SentSuccess = (props) => {
  const { showModal, closeModal } = props;
  return (
    <Modal show={showModal} onHide={closeModal}>
      <div className="close-card">
        <button type="button" className="close" onClick={closeModal}>
          ×
        </button>
      </div>

      <div>
        <div className="modal-body text-block pb-20">
          <p>The text message is on it’s way!</p>
        </div>
      </div>
    </Modal>
  );
};

export default SentSuccess;
