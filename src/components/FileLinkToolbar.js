import React, { useState, useEffect } from "react";

const FileLinkToolbar = (props) => {
  const { uploadImageInText, addLinkToHtml, linkStatus } = props;
  const [selectedBtn, setSelectedBtn] = useState(null);
  const [linkText, setLinkText] = useState("");

  useEffect(() => {
    if (linkStatus === "success") {
      setSelectedBtn("add");
      setLinkText("");
      return;
    }
    setLinkText("");
  }, [linkStatus]);

  return (
    <div className="up-box">
      <div className="icon-box">
        <button type="button">
          <label className="file">
            <i
              className="fa fa-picture-o"
              aria-hidden="true"
              onClick={() => {
                setSelectedBtn("image");
              }}
            ></i>
            <input
              type="file"
              id="file"
              aria-label="File browser example"
              accept="image/x-png,image/jpeg,image/gif"
              onChange={(event) => uploadImageInText(event.target.files[0])}
            />
          </label>
        </button>
        <button type="button" onClick={() => setSelectedBtn("link")}>
          <i className="fa fa-link" aria-hidden="true"></i>
        </button>
      </div>
      <div className="upload-box">
        {selectedBtn === "link" && (
          <form onSubmit={(event) => addLinkToHtml(event, linkText)}>
            <input
              type="text"
              name="text"
              placeholder="Enter link..."
              value={linkText}
              onChange={(event) => setLinkText(event.target.value)}
            />
            <button type="submit" style={{ cursor: "pointer" }}>
              Add
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FileLinkToolbar;
