import React from "react";

const FileLinkToolbar = () => {
  return (
    <div className="up-box">
      <div className="icon-box">
        <button type="button">
          <label className="file">
            <i
              className="fa fa-picture-o"
              aria-hidden="true"
              onClick={() => {}}
            ></i>
            <input
              type="file"
              id="file"
              aria-label="File browser example"
              accept="image/x-png,image/jpeg,image/gif"
              onChange={(event) => {}}
            />
          </label>
        </button>
        <button type="button" onClick={() => {}}>
          <i className="fa fa-link" aria-hidden="true"></i>
        </button>
      </div>
      <div className="upload-box">
        {/* {selectedBtn === "link" && ( */}
        <>
          <input
            type="text"
            name="text"
            placeholder="Enter link..."
            onChange={(event) => {}}
          />
          <button type="button" style={{ cursor: "pointer" }}>
            Add
          </button>
        </>
        {/* )} */}
      </div>
    </div>
  );
};

export default FileLinkToolbar;
