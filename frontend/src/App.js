import React, { useState } from 'react';

import FileExplorer from './components/FileExplorer/FileExplorer'
import Editor from "./components/Editor/Editor";
import CreateProjectBox from "./components/CreateProjectBox/CreateProjectBox";
import CreateFileBox from "./components/CreateFileBox/CreateFileBox";
import ProjectsList from "./components/ProjectsList/ProjectsList";
import ExecutionResult from "./components/ExecutionResult/ExecutionResult"
import LoginPage from "./components/LoginPage/LoginPage"
import config from "./config.json";
import { sendRequest, sendFiles } from './utils';

import './App.css'

function App() {

  const [user, setUser] = useState();
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [files, setFiles] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [showCreateFileBox, setShowCreateFileBox] = useState(false);
  const [showCreateProjectBox, setShowCreateProjectBox] = useState(false);

  return (
    <div className="App">
      {
        !user && 
        <LoginPage login = {loginUser}/>
      }
      {
        user &&
        !projectName && 
        <div>
          <button onClick={() => {setShowCreateProjectBox(true)}}>create new project</button>
          <ProjectsList user={user} setProject = {setProject}/>
        </div>
      }
      {
        projectName && 
        <div>
          {projectName} <br/>
          <button onClick={() => {setShowCreateFileBox(true)}}>create new file</button>
          <button onClick={sendUserFiles}>save project</button><br/>
        </div>
        
      }
      {
        files.length > 0 &&
        <div>
          Files: <br/>
          <FileExplorer files={files} changeIndex = {changeCurrentFileIndex}/>
          <Editor file={files[currentFileIndex]} updateContent = {updateContent} language="verilog" />
          <ExecutionResult user={user} projectId={projectId}/>
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

  function loginUser(user) {
    setUser(user);
  }

  function saveFile(createdFile) {  
    setCurrentFileIndex(files.length)
    setFiles(oldArray => [...oldArray, createdFile]);
    setShowCreateFileBox(false)   
  }

  function setProject(project) {
    setProjectName(project.name);
    setProjectId(project._id)

    for(let i=0; i<project.files.length; i++) {
      let newFile = {
        name: '',
        content: ''
      }
      
      let requestObject = {
        url: `${config.SERVER_URL}/api/files/${project.files[i].fileid}`, 
        method: 'GET', 
        headers: [{name: 'Authorization', value: `Bearer ${user.token}`}],
      }
      sendRequest(requestObject).then(response => response.json())
      .then(response => {
        newFile.name = response.data.name;
      });

      requestObject = {
        url: `${config.SERVER_URL}/api/files/getContent/${project.files[i].fileid}`, 
        method: 'GET', 
        headers: [{name: 'Authorization', value: `Bearer ${user.token}`}],
      }
      sendRequest(requestObject).then(response => response.text())
      .then((body) => {
        newFile.content = body;
        setFiles(oldArray => [...oldArray, newFile]);
      });
      
    }
  }

  function sendUserFiles(){
    let data  = new FormData();
    data.append('projectId', projectId)
    for(let i=0; i<files.length; i++) {
      data.append('files', new Blob([files[i].content]), files[i].name)
    }

    let requestObject = {
      url: `${config.SERVER_URL}/api/files`, 
      method: 'POST', 
      headers: [{name: 'Authorization', value: `Bearer ${user.token}`}],
      data: data
    }
    sendFiles(requestObject)
  }

  function createProject(projectName) {
    let requestObject = {
      url: `${config.SERVER_URL}/api/projects`, 
      method: 'POST', 
      headers: [{name: 'Authorization', value: `Bearer ${user.token}`}],
      data: [{name: 'name', value: projectName}]
    }
    sendRequest(requestObject)
    .then(response => response.text())
    .then(response => response.json())
    .then(result => {
        setProjectId(result.data._id);
        setProjectName(projectName);
        setShowCreateProjectBox(false);
    })
    .catch(error => {
      setShowCreateProjectBox(false);
      setUser(null);
      console.log(error)
    });
  }
}

export default App;
