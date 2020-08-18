import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import DateTimePicker from "react-datetime-picker";

const Schedule = (props) => {
  const { showModal, closeModal, scheduleSave } = props;
  const [dateTime, setDateTime] = useState(new Date());

  return (
    <Modal show={showModal} onHide={closeModal}>
      <div className="close-card"></div>
      <div>
        <div>
          <div className="modal-body text-block schedule">
            <p>When would you like to send the text?</p>
            <div className="m-30">
              <DateTimePicker
                onChange={(date) => setDateTime(date)}
                value={dateTime}
                clearIcon={null}
                disableClock={true}
                minDate={new Date()}               
                maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
              />
            </div>
            <div className="flex schedule-btn">
              <div className="action-btn">
                <button type="button" onClick={() => scheduleSave(dateTime)}>
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
