import React, { useState, useEffect } from 'react';

import FileExplorer from './components/FileExplorer/FileExplorer'
import Editor from "./components/Editor/Editor";

function App() {

  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [files, setFiles] = useState([]);

  return (
    <div className="App">
      <button onClick={createFile}>create new file</button>
      {
        files.length > 0 &&
        <div>
          <FileExplorer files={files} changeIndex = {changeCurrentFileIndex}/>
          <Editor file={files[currentFileIndex]} updateContent = {updateContent} language="javascript" />
        </div>
      }
    </div>
  );

  function changeCurrentFileIndex(index) {
    setCurrentFileIndex(index);
  }

  function updateContent(editorContent) {
    files[currentFileIndex].content = editorContent;
  }

  function createFile() {
    let file = {
      name: "lel.txt",
      content: 'nowszy plik'
    }
    
    setCurrentFileIndex(files.length)
    setFiles(oldArray => [...oldArray, file]);   
  }
}

export default App;
