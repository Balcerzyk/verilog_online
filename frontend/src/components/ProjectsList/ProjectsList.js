import React, { useState } from 'react';

  const ProjectsList = (props) => {

    const [projects, setProjects] = useState();

    return (
      <div className = 'projectsList'>
          <button onClick={getAllProjects}>Edit existing project</button>
          
          {
            projects &&
            projects.map((element, index) => {     
                return (
                    <div onClick={() => selectProject(index)}>
                        {element.name}
                    </div>
                ) 
            })
        }
      </div>
    );
  
    function getAllProjects() {

        let url = 'http://localhost:8080/api/projects';
    
        fetch(url, {
          method: 'GET',
        }).then(response => response.json())
        .then(response => {
            console.log(response.data)
            setProjects(response.data)
        });
      }

    function selectProject(index) {
        props.setProject(projects[index]);
    }
  }
  
  
  export default ProjectsList;
  
  
  
  
  