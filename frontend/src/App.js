import React, { useState } from 'react';

import LoginPage from "./pages/LoginPage/LoginPage"
import RegisterPage from "./pages/RegisterPage/RegisterPage"
import MenuPage from './pages/MenuPage/MenuPage';
import EditorPage from './pages/EditorPage/EditorPage';

import './App.css'

function App() {

  const [user, setUser] = useState();
  const [showRegisterPage, setShowRegisterPage] = useState(false);
  const [project, setProject] = useState({id: '', name: ''});
  const [files, setFiles] = useState([]);
  
  return (
    <div className="App">
      {
        !user && showRegisterPage &&
        <RegisterPage showRegisterPage = {(show) => {setShowRegisterPage(show)}}/>
      }
      {
        !user && !showRegisterPage &&
        <LoginPage login = {(user) => setUser(user)} showRegisterPage = {(show) => {setShowRegisterPage(show)}}/>
      }
      {
        user && !project.name && 
        <MenuPage user={user} 
          createProject={(currentProject) => {
            let newProject = {
              id: currentProject.id,
              name: currentProject.projectName
            }
            setProject(newProject);
          }}
          setProject={(project) => {
            setProject(project);
          }}
          logout={() => setUser(null)}
        />
      }
      {
        project.name &&
          <EditorPage user={user} project={project} setProject={(newProject) => setProject(newProject)} clearProject={clearProject}/>
      }
    </div>
  );

  function clearProject() {
    let project = {
      id: '',
      name: ''
    }
    setProject(project);
  }
}

export default App;
