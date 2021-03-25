import React, { useState, useEffect } from 'react';
 
const FileExplorer = (props) => {

  const [activeFile, setActiveFile] = useState(0);

  useEffect(() => {
    props.changeIndex(activeFile);
  }, [activeFile]);

  useEffect(() => {
    highlightNewFile()
  }, [props.files]);

  return (
    <div>
      {props.files.map((file, index) => (
        <div className='fileDiv' key={index} onClick={(e) => handleClick(index, e)} >{file.name}</div> 
      ))}
    </div>  
  );

  function handleClick(index, e) {
    document.getElementsByClassName('fileDiv')[activeFile].style.background = 'none';
    e.target.style.background = 'yellow';
    setActiveFile(index);
  }

  function highlightNewFile() {
    document.getElementsByClassName('fileDiv')[activeFile].style.background = 'none';
    document.getElementsByClassName('fileDiv')[props.files.length - 1].style.background = 'yellow';
    setActiveFile(props.files.length - 1)
  }
}


export default FileExplorer;