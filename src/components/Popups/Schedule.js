import React from "react";
import Modal from "react-bootstrap/Modal";

const Schedule = (props) => {
  const { showModal, closeModal, scheduleSave } = props;
  return (
    <Modal show={showModal} onHide={closeModal}>
      <div className="close-card"></div>
      <div>
        <div>
          <div className="modal-body text-block schedule">
            <p>When would you like to send the text?</p>
            <div className="flex schedule-btn">
              <div className="action-btn">
                <button type="button" onClick={scheduleSave}>
                  Save
                </button>
              </div>
              <div className="action-btn">
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

export default Schedule;
