import React, { useState, useEffect } from 'react';
 
import './FileExplorer.css'

const FileExplorer = (props) => {

  const [activeFile, setActiveFile] = useState(0);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    props.changeIndex(activeFile);
  }, [activeFile, refresh]);

  useEffect(() => {
    highlightNewFile()
  }, [props.files]);

  return (
    <div className='fileExplorerDiv'>
      {props.files.map((file, index) => (
        <div>
          <div className='fileDiv' key={`file_${index}`} onClick={(e) => handleClick(index, e)} >
            {file.name}
          </div> 
          <button key={`delete_${index}`} onClick={() => {deleteFile(index)}}>delete</button>
        </div>
      ))}
    </div>  
  );

  function handleClick(index, e) {
    color(index)
    setActiveFile(index);
  }

  function color(index) {
    document.getElementsByClassName('fileDiv')[activeFile].style.background = 'none';
    document.getElementsByClassName('fileDiv')[index].style.background = '#63d297';
  }
  
  function highlightNewFile() {
    document.getElementsByClassName('fileDiv')[activeFile].style.background = 'none';
    document.getElementsByClassName('fileDiv')[props.files.length - 1].style.background = '#63d297';
    setActiveFile(props.files.length - 1)
  }

  function deleteFile(index, e) {
    props.delete(index);

    if(index == activeFile) {
      setActiveFile(0);
      color(0);
    }
    else if(index < activeFile) {
      setActiveFile(activeFile - 1);
      color(activeFile - 1);
    }
    else {
      setActiveFile(activeFile);
      setRefresh(refresh + 1);      
      color(activeFile);
    }
    
  }
}


export default FileExplorer;