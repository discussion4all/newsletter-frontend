import React from "react";
import ContentEditable from "react-contenteditable";

const Editor = (props) => {
  const { reference, html, handleChange } = props;
  console.log("rendering...");
  return (
    <ContentEditable
      className="text-area"
      innerRef={reference}
      html={html} // innerHTML of the editable div
      disabled={false} // use true to disable editing
      onChange={handleChange} // handle innerHTML change
      tagName="article" // Use a custom HTML tag (uses a div by default)
    />
  );
};

export default Editor;
