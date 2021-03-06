import React, { useState, useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-verilog.js";
import "prismjs/themes/prism-tomorrow.css";
import "../Editor/Editor.css"

const Editor = props => {

  const [content, setContent] = useState(props.file.content);
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    setContent(props.file.content)
  }, [props]);
  
  useEffect(() => {
    Prism.highlightAll();
    props.updateContent(content);
  }, [props.language, content]);

  useEffect(() => {
    document.getElementById('output').scrollTop = scroll;
  }, [scroll]);

  const handleKeyDown = evt => {
    let value = content,
    selStartPos = evt.currentTarget.selectionStart;

    // handle 4-space indent on
    if (evt.key === "Tab") {
      value = `${ value.substring(0, selStartPos)}\t`
      evt.currentTarget.selectionStart = selStartPos + 3;
      evt.currentTarget.selectionEnd = selStartPos + 4;
      evt.preventDefault();

      setContent(value);
    }
  };

  return (
    <div className="code-edit-container">
      <textarea
        className="code-input"
        value={content}
        onChange={evt => setContent(evt.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck="false"
        onScroll={changeScroll}
      />
      <pre id='output' className="code-output">
        <code className={`language-${props.language}`}>{content}</code>
      </pre> 
    </div>
  );

  function changeScroll(e) {
    setScroll(e.target.scrollTop);
  }
};

export default Editor;