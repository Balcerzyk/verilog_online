import React, { useState, useEffect } from 'react';
 
import InputBox from "../../components/InputBox/InputBox";

import './FileExplorer.css'

const FileExplorer = (props) => {

  const [activeFile, setActiveFile] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [showInputBox, setShowInputBox] = useState(false);

  useEffect(() => {
    props.changeIndex(activeFile);
  }, [activeFile, refresh]);

  useEffect(() => {
    highlightNewFile()
  }, [props.files]);

  return (
    <div className='fileExplorerDiv'>
      { 
        showInputBox &&
        <InputBox visibility={(visibility) => setShowInputBox(visibility)} update={updateFile}/>
      }
      {props.files.map((file, index) => (
        <div>
          <div className='fileDivContainer'>
            <div className='fileDiv' key={`file_${index}`} onClick={(e) => handleClick(index, e)} onDoubleClick={(e) => props.changeTopModule(index)}>
              {file.name}
            </div> 
            <button className='editFileButton' key={`edit_${index}`} onClick={() => setShowInputBox(true)}> 
            <img className='editFileButtonImage' src={'/images/editButton.svg'} alt='edit'/>  
            </button>
            <button className='deleteFileButton' key={`delete_${index}`} onClick={() => {deleteFile(index)}}> 
              <img className='deleteFileButtonImage' src={'/images/deleteButton.svg'} alt='delete'/>  
            </button>
            {
              props.topModule == index && activeFile != props.topModule &&
              <div className='sideTopModuleMark'></div>
            }
          </div>
          {
            props.topModule == index && activeFile == props.topModule &&
            <div className='topModuleMark'>
              <a className='topModuleText'>
                TOPMODULE
              </a>
            </div>
          }
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

  function updateFile(fileName) {
    props.changeName(activeFile, fileName);
    setShowInputBox(false);
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