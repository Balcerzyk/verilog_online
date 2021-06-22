import React, { useState }  from 'react';
 
import './CreateFileBox.css'

const CreateFileBox = (props) => {

  const [error, setError] = useState('');

  return (
    <div className = 'createFileScreen'>
        <div className = 'createFileBox'>
            <div className='createFileLabel'>Enter file name</div>
            <input id='fileName' className='createFileInput' type='text' placeholder='file name'></input>
            <a className='errorDiv'>{error}<br/></a>
            <div className='createFileButtons'>
              <button className='createFileAbort' onClick={abort}>Abort</button>
              <button className='createFileApply'onClick={createFile}>Apply</button>
            </div>
        </div>
    </div>
  );

  function createFile() {
      let fileName = document.getElementById('fileName').value;

      let existingFile = props.files.find(element => element.name == fileName);
      if(fileName.includes('.')) {
        setError('File name cannot include dot')
      }
      else if(!existingFile) {
        let file = {
          name: `${fileName}.v`,
          content: ''
        }
        props.saveFile(file);
      } 
      else {
        setError('File with given name exists already')
      }
        
  }

  function abort() {
    props.visibility(false);
  }

}

export default CreateFileBox;


