import React, { useState } from 'react';

import FileExplorer from './components/FileExplorer/FileExplorer'
import Editor from "./components/Editor/Editor";
import CreateFileBox from "./components/CreateFileBox/CreateFileBox";

import './App.css'

function App() {

  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [files, setFiles] = useState([]);
  const [showCreateFileBox, setShowCreateFileBox] = useState(false);

  return (
    <div className="App">
      <button onClick={() => {setShowCreateFileBox(true)}}>create new file</button>
      <button onClick={sendFiles}>send</button>
      {
        files.length > 0 &&
        <div>
          <FileExplorer files={files} changeIndex = {changeCurrentFileIndex}/>
          <Editor file={files[currentFileIndex]} updateContent = {updateContent} language="javascript" />
        </div>
      }
      {
        showCreateFileBox &&
        <CreateFileBox saveFile={saveFile}/>
      }
      
    </div>
  );

  function changeCurrentFileIndex(index) {
    setCurrentFileIndex(index);
  }

  function updateContent(editorContent) {
    files[currentFileIndex].content = editorContent;
  }

  function saveFile(createdFile) {  
    setCurrentFileIndex(files.length)
    setFiles(oldArray => [...oldArray, createdFile]);
    setShowCreateFileBox(false)   
  }

  function sendFiles(){
    let data  = new FormData();
    for(let i=0; i<files.length; i++) {
      data.append('photos', new Blob([files[i].content]), files[i].name + '.v')
    }
    
    let url = 'http://localhost:3030/upload';

    fetch(url, {
      method: 'POST',
      body: data,
    }).then((response) => {
      console.log(response)
    })
  }
}

export default App;
