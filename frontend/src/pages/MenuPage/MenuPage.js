import React, { useState } from 'react';

import ProjectsList from "../../components/ProjectsList/ProjectsList";
import CreateProjectBox from "../../components/CreateProjectBox/CreateProjectBox";
import AlertBox from "../../components/AlertBox/AlertBox"
import Button from '../../components/Button/Button';
import { sendRequest, sendFiles } from '../../utils';

import config from "../../config.json";

import './MenuPage.css'

  const MenuPage = (props) => {

    const [showCreateProjectBox, setShowCreateProjectBox] = useState(false);
    
    const [alert, setAlert] = useState(null);

    return (
        
        <div className='appDiv'>
            {
                alert &&
                <AlertBox text={alert.text} abortFunction={alert.abortFunction} applyFunction={alert.applyFunction}/>
            }
            {
                showCreateProjectBox &&
                <CreateProjectBox visibility={(visibility) => setShowCreateProjectBox(visibility)} createProject={createProject}/>
            }
            <div className='logoutButton'>
              <Button text='Log Out' onClick={() => {
                  let alert = {
                      text: "Do you really want to log out?",
                      abortFunction: () => setAlert(null),
                      applyFunction: () => {props.logout(); setAlert(null)}
                  }
                  setAlert(alert);
              }}/>
            </div>
            <div className='helloText'>
                <a>Hello {props.user.username}!</a>
            </div>
            <div className='createProjectDiv' onClick={() => {setShowCreateProjectBox(true)}}>
                <img className='createProjectImage' src={'/images/addButton.svg'} alt='Create new project'/>  
                <svg className='createProjectSvg'>
                  <rect className='createProjectRect' />
                </svg>
                <div className="createNewProjectText">
                    Create new project
                </div> 
            </div>
            <div className='projectsText'>
                <a>Here are your projects</a>
                <svg className='projectsUnderlineSvg'>
                   <rect className='projectsUnderlineRect'/>
                </svg>
            </div>
            <ProjectsList user={props.user} setProject={(project) => props.setProject(project)} deleteProject={(project) => {
                let alert = {
                  text: "Are you sure?",
                  abortFunction: () => setAlert(null),
                  applyFunction: () => {deleteProject(project); setAlert(null)}
                }
                setAlert(alert);
            }}/>
        </div>
    )

    function createProject(projectName) {
        let currentProject = {
            id: '',
            projectName: ''
        };

        let requestObject = {
          url: `${config.SERVER_URL}/api/projects`, 
          method: 'POST', 
          headers: [{name: 'Authorization', value: `Bearer ${props.user.token}`}],
          data: [{name: 'name', value: projectName}]
        }
        sendRequest(requestObject)
        .then( response => {
          if(response.status == 201) {
            response.json().then(json => {
                currentProject.id = json.data._id;
                currentProject.projectName = projectName;
                setShowCreateProjectBox(false);
                props.createProject(currentProject);
            })
          } 
        });
      }
    
      function deleteProject(project) {
        let requestObject = {
          url: `${config.SERVER_URL}/api/projects/${project._id}`, 
          method: 'DELETE', 
          headers: [{name: 'Authorization', value: `Bearer ${props.user.token}`}]
        }
        sendRequest(requestObject)
        .then( response => {
          if(response.status == 200) {
            response.json().then(json => {
              
            })
          } 
        });
      }
    
}

export default MenuPage;
  
  
  
  
  









