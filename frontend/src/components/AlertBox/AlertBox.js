import React from 'react';
 
import './AlertBox.css'

const AlertBox = (props) => {

  return (
    <div className = 'alertScreen'>
        <div className = 'alertBox'>
            <div className='alertText'>{props.text}</div>
            <div className='createFileButtons'>
              <button className='alertAbort' onClick={props.abortFunction}>Abort</button>
              <button className='alertApply' onClick={props.applyFunction}>Apply</button>
            </div>
        </div>
    </div>
  );

}

export default AlertBox;


