import React from 'react';

import './SignalsList.css'

  const SignalsList = (props) => {

    return (
      <div className = 'signalsListDiv'>
        {
          props.signals && props.signals.length > 0 &&
          <div className='signalsListInsideDiv'>
            <a className = 'signalsListTitle'>Input Signals</a>  
            <div className='titlesRow'>
              <div className='signalsGridDiv'>Name</div>
              <div className='signalsGridDiv'>Period</div>
              <div className='signalsGridDiv'>Time Unit</div>
              <div className='signalsGridDiv'>Start Time</div>
              <div className='signalsGridDiv'>Duty Cycle</div>
              <div className='signalsGridDiv'>Posedge First</div>
            </div>
            {
              props.signals.map((signal) => (
              <div>
                <div className='signalRow'> 
                  <div className='signalsGridDiv'>{signal.name}</div>
                  <div className='signalsGridDiv'>{signal.period}</div>
                  <div className='signalsGridDiv'>{signal.unit}</div>
                  <div className='signalsGridDiv'>{signal.start}</div>
                  <div className='signalsGridDiv'>{signal.dutyCycle}</div>
                  <div className='signalsGridDiv'>{signal.posedgeFirst.toString()}</div>
                </div>
                <svg className='underlineSvg'>
                  <rect className='underlineRect'/>
                </svg>
              </div>
              ))
            }
          </div>
        }
      </div>
    );
  }

  export default SignalsList;
  
  
  
  
  

