import React, { useState } from 'react';
import Button from '../Button/Button';


import './SignalsMenu.css'

  const SignalsMenu = (props) => {

    const [error, setError] = useState('');

    return (
      <div className = 'signalsMenuDiv'>        
          <a className = 'signalsMenuTitle'>Add signal</a>
          <div className = 'signalsMenuContent'>
            <div style={{gridArea: 'left0'}}>Name: </div>
            <div style={{gridArea: 'left1'}}>Period: </div>
            <div style={{gridArea: 'left2'}}>Time Unit: </div>
            <div style={{gridArea: 'left3'}}>Start Time: </div>
            <div style={{gridArea: 'left4'}}>Duty Cycle: </div>
            <div style={{gridArea: 'left5'}}>Posedge First: </div>

            <input style={{gridArea: 'right0'}} type="text" id="signalNameInput" name="signalNameInput" />
            <input style={{gridArea: 'right1'}} type="number" id="signalPeriodInput" name="signalPeriodInput" min="0" max="100"/>
            <input style={{gridArea: 'right2'}} list="units" name="signalPeriodUnit" id="signalPeriodUnit" />
            <datalist id="units">
                <option value="NS"/>
                <option value="PS"/>
                <option value="MS"/>
                <option value="S"/>
            </datalist>
            <input style={{gridArea: 'right3'}} type="number" id="signalStartInput" name="signalStartInput" min="0" max="100" />
            <input style={{gridArea: 'right4'}} type="number" id="signalDutyCycle" name="signalDutyCycle" min="0" max="100" />
            <input style={{gridArea: 'right5'}} type="checkbox" id="signalPosedgeInput" name="signalPosedgeInput" />
          </div>
          <div>
              <a className='signalErrorDiv'>{error}<br/></a>
              <Button text='Add' onClick={addSignal} />
          </div>
          
      </div>
    );

    function addSignal() {
        let signal = {
            name: document.getElementById('signalNameInput').value,
            period: document.getElementById('signalPeriodInput').value,
            unit: document.getElementById('signalPeriodUnit').value,
            start: document.getElementById('signalStartInput').value,
            dutyCycle: document.getElementById('signalDutyCycle').value,
            posedgeFirst: document.getElementById('signalPosedgeInput').checked
        }

        if(signal.name && signal.period && signal.unit && signal.start && signal.dutyCycle) {
          setError('')
          props.addSignal(signal);
        }
        else {
          setError('All fields are required')
        }
        
    }
}
  export default SignalsMenu;
  
  
  
  
  

