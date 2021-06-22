import React from 'react';

  const EditorTopBar = (props) => {

    return (
        <div className='buttons'>
            <button onClick={() => props.back()}>
                Back To Menu
            </button>
            <button onClick={() => props.createFile()}>Create new file</button>
            <button onClick={() => props.sendFiles()}>Save project</button><br/>
            <button onClick={() => props.execute()}>Execute</button>
        </div>
    );
  }

  export default EditorTopBar;
  
  
  
  
  




