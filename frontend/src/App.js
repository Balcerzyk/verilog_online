import React, { useState } from 'react';

import FileExplorer from './components/FileExplorer/FileExplorer'
import Editor from "./components/Editor/Editor";
import CreateProjectBox from "./components/CreateProjectBox/CreateProjectBox";
import CreateFileBox from "./components/CreateFileBox/CreateFileBox";
import ProjectsList from "./components/ProjectsList/ProjectsList";

import './App.css'

function App() {

  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [files, setFiles] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [showCreateFileBox, setShowCreateFileBox] = useState(false);
  const [showCreateProjectBox, setShowCreateProjectBox] = useState(false);

  return (
    <div className="App">
      {
        !projectName && 
        <div>
          <button onClick={() => {setShowCreateProjectBox(true)}}>create new project</button>
          <ProjectsList setProject = {setProject}/>
        </div>
      }
      {
        projectName &&
        <button onClick={() => {setShowCreateFileBox(true)}}>create new file</button>
      }
      {
        files.length > 0 &&
        <div>
          {projectName}
          {projectId}
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

  function setProject(project) {
    setProjectName(project.name);
    setProjectId(project._id)

    console.log(project.files.length)
    for(let i=0; i<project.files.length; i++) {
      let url = `http://localhost:8080/api/files/${project.files[i].fileid}`;
      console.log(url)

      fetch(url, {
        method: 'GET',
      }).then(response => response.json())
      .then(response => {
        console.log(response.data)
      });
    }
  }

  function sendFiles(){
    let data  = new FormData();
    data.append('projectId', projectId)
    for(let i=0; i<files.length; i++) {
      data.append('files', new Blob([files[i].content]), files[i].name)
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
    }).then(response => response.json())
    .then(response => {
      setProjectId(response.data._id)
    });

    setProjectName(projectName)
    setShowCreateProjectBox(false)
  }
}

export default App;
