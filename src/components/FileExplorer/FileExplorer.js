import React, { useState, useEffect } from 'react';
 
const FileExplorer = (props) => {

  const [activeFile, setActiveFile] = useState(0);

  useEffect(() => {
    props.changeIndex(activeFile);
  }, [activeFile]);

  return (
    <div>
      {props.files.map((file, index) => (
        <div class='fileDiv' onClick={(e) => handleClick(index, e)} >{file.name}</div> 
      ))}
    </div>  
  );

  function handleClick(index, e) {
    document.getElementsByClassName('fileDiv')[activeFile].style.background = 'none';
    e.target.style.background = 'yellow';
    setActiveFile(index)
  }
}


export default FileExplorer;