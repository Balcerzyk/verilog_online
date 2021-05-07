import React from 'react';
 
const CreateProjectBox = (props) => {

  return (
    <div className = 'createProjectScreen'>
        <div className = 'inputBox'>
            <input id='projectName' type='text'></input>
            <button onClick={abort}>Abort</button>
            <button onClick={createProject}>Apply</button>
        </div>
    </div>
  );

  function createProject() {
      let projectName = document.getElementById('projectName').value;
      props.createProject(projectName);
  }
  function abort() {
      props.visibility(false);
  }

}

export default CreateProjectBox;


