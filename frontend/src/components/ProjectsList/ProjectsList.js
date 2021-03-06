import React, { useState,useEffect } from 'react';

import Button from '../Button/Button';
import config from "../../config.json";
import { sendRequest } from '../../utils';

import './ProjectsList.css'

  const ProjectsList = (props) => {

    const [projects, setProjects] = useState();

    useEffect(() => {
      getAllProjects();
    }, []);

    useEffect(() => {
      getAllProjects();
    }, [props.deleteProject]);

    return (
      <div className = 'projectsListDiv'>        
          {
            projects &&
            projects.map((element, index) => {     
                return (
                    <div className='projectDiv' key={index}>
                      <svg className='projectSvg'>
                        <rect className='projectRect' />
                      </svg> 
                      <a className='projectName'>{element.name}</a>
                      <div className='buttonPosition'>
                        <Button text='Edit' onClick={() => selectProject(index)} />
                      </div>
                      <button className='deleteProjectButton' onClick={() => deleteProject(index)}>
                        <img className='deleteProjectButtonImg' src={'/images/deleteButton.svg'} alt='delete'/>  
                      </button>    
                    </div>
                ) 
            })
        }
      </div>
    );
  
    function getAllProjects() {
        let requestObject = {
          url: `${config.SERVER_URL}/api/projects`, 
          method: 'GET', 
          headers: [{name: 'Authorization', value: `Bearer ${props.user.token}`}]
        }
        sendRequest(requestObject)
        .then(response => {
          if(response.status == 200) {
            response.json().then(json => setProjects(json.data))
          }
        });
      }

    function selectProject(index) {
      let project = {
        id: projects[index]._id,
        name: projects[index].name
      }
        props.setProject(project);
    }

    function deleteProject(index) {
      props.deleteProject(projects[index]);
    }
  }
  
  
  export default ProjectsList;
  
  
  
  
  