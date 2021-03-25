import React, { useState } from 'react';

import FileExplorer from './components/FileExplorer/FileExplorer'
import Editor from "./components/Editor/Editor";
import CreateProjectBox from "./components/CreateProjectBox/CreateProjectBox";
import CreateFileBox from "./components/CreateFileBox/CreateFileBox";

import './App.css'

function App() {

  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [files, setFiles] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [showCreateFileBox, setShowCreateFileBox] = useState(false);
  const [showCreateProjectBox, setShowCreateProjectBox] = useState(false);

  return (
    <div className="App">
      {
        !projectName && 
        <button onClick={() => {setShowCreateProjectBox(true)}}>create new project</button>
      }
      {
        projectName &&
        <button onClick={() => {setShowCreateFileBox(true)}}>create new file</button>
      }
      {
        files.length > 0 &&
        <div>
          {projectName}
          <button onClick={sendFiles}>send</button>
          <FileExplorer files={files} changeIndex = {changeCurrentFileIndex}/>
          <Editor file={files[currentFileIndex]} updateContent = {updateContent} language="javascript" />
        </div>
      }
      {
        showCreateProjectBox &&
        <CreateProjectBox createProject={createProject}/>
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
    data.append('projectslug', projectName)
    for(let i=0; i<files.length; i++) {
      data.append('files', new Blob([files[i].content]), files[i].name + '.v')
    }
    
    let url = 'http://localhost:8080/api/files';

    fetch(url, {
      method: 'POST',
      body: data,
    }).then((response) => {
      console.log(response)
    })
  }

  function createProject(projectName) {
    let data  = new URLSearchParams();
    data.append('name', projectName)

    let url = 'http://localhost:8080/api/projects';

    fetch(url, {
      method: 'POST',
      body: data,
    }).then((response) => {
      console.log(response)
    })

    setProjectName(projectName)
    setShowCreateProjectBox(false)
  }
}

export default App;
