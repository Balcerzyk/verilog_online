import React from 'react';
 
const CreateFileBox = (props) => {

  return (
    <div className = 'createFileScreen'>
        <div className = 'inputBox'>
            <input id='fileName' type='text'></input>
            <button onClick={abort}>Abort</button>
            <button onClick={createFile}>Apply</button>
        </div>
    </div>
  );

  function createFile() {
      let fileName = document.getElementById('fileName').value;
      let file = {
        name: fileName,
        content: ''
      }
    props.saveFile(file);
  }

  function abort() {
    props.visibility(false);
  }

}

export default CreateFileBox;


