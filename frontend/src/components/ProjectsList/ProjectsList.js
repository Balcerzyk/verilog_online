import React, { useState } from 'react';

import config from "../../config.json";
import { sendRequest } from '../../utils';

  const ProjectsList = (props) => {

    const [projects, setProjects] = useState();

    return (
      <div className = 'projectsList'>
          <button onClick={getAllProjects}>Edit existing project</button>
          
          {
            projects &&
            projects.map((element, index) => {     
                return (
                    <div onClick={() => selectProject(index)} key={index}>
                        {element.name}
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
        .then(response => response.json())
        .then(response => {
            setProjects(response.data)
        });
      }

    function selectProject(index) {
        props.setProject(projects[index]);
    }
  }
  
  
  export default ProjectsList;
  
  
  
  
  