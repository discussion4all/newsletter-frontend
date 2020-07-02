import React, { useState } from "react";
import ContentEditable from "react-contenteditable";

const Editor = (props) => {
  const { reference, html, handleChange, cursorPosition } = props;

  return (
    <ContentEditable
      placeholder="Enter sample text message..."
      onKeyUp={cursorPosition}
      className="text-area"
      id="editable"
      innerRef={reference}
      html={html} // innerHTML of the editable div
      disabled={false} // use true to disable editing
      onChange={(e) => handleChange(e)} // handle innerHTML change
      tagName="article" // Use a custom HTML tag (uses a div by default)
    />
  );
};

export default Editor;
