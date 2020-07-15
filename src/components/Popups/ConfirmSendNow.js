import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

const SendNow = (props) => {
  const { showModal, closeModal, handleYes, loading } = props;
  const [phoneNumber, setPhoneNumber] = useState("");

  let yesBtnStyle = {};
  if (loading) {
    yesBtnStyle = {
      cursor: "default",
      background: "rgb(204, 204, 204)",
    };
  }

  return (
    <Modal show={showModal} onHide={closeModal}>
      <div className="close-card"></div>
      <div>
        <div>
          <div className="modal-body text-block send-now">
            <p>Are you sure you want to send the text now?</p>
            <div style={{ marginBottom: "14px" }}>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+919909582774"
              />
            </div>
            <div className="flex send-now-btn">
              <div className="action-btn">
                <button
                  type="button"
                  onClick={() => handleYes(phoneNumber)}
                  style={yesBtnStyle}
                  disabled={loading}
                >
                  {loading ? <div className="lds-dual-ring"></div> : "Yes"}
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

export default SendNow;
