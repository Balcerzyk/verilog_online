import React, { useState }  from 'react';
 
import './InputBox.css'

const InputBox = (props) => {

  const [error, setError] = useState('');

  return (
    <div className = 'inputBoxScreen'>
        <div className = 'inputBox'>
            <div className='inputBoxLabel'>Enter new name</div>
            <input id='newName' className='inputBoxInput' type='text' placeholder='name'></input>
            <a className='errorDiv'>{error}<br/></a>
            <div className='inputBoxButtons'>
              <button className='inputBoxAbort' onClick={abort}>Abort</button>
              <button className='inputBoxApply'onClick={update}>Apply</button>
            </div>
        </div>
    </div>
  );

  function update() {
    props.update(document.getElementById('newName').value)
  }

  function abort() {
    props.visibility(false);
  }

}

export default InputBox;


