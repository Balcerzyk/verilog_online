import React, { useState } from 'react';
 
import './CreateProjectBox.css'

const CreateProjectBox = (props) => {

  const [error, setError] = useState('');

  return (
    <div className = 'createProjectScreen'>
        <div className = 'createProjectBox'>
            <div className='createProjectLabel'>Enter project name</div>
            <input id='projectName' className='createProjectInput' type='text' placeholder='project name'></input>
            <a className='errorDiv'>{error}<br/></a>
            <div className='createProjectButtons'>
              <button className='createProjectAbort' onClick={abort}>Abort</button>
              <button className='createProjectApply'onClick={createProject}>Apply</button>
            </div>
        </div>
    </div>
  );

  function createProject() {
    let projectName = document.getElementById('projectName').value;
    if(projectName.length == 0) {
      setError('Please enter project name');
    }
    else {
      setError('');
      props.createProject(projectName);
    }
    
  }
  function abort() {
      props.visibility(false);
  }

}

export default CreateProjectBox;


