import React from 'react';

import './SignalsList.css'

  const SignalsList = (props) => {

    return (
      <div className = 'signalsListDiv'>
        <a className = 'signalsListTitle'>Input Signals</a>       
        {
          props.signals.map((signal) => (
          <div> 
            {signal.name}{` `}
            {signal.period}{` `}
            {signal.unit}{` `}
            {signal.start}{` `}
            {signal.dutyCycle}{` `}
            {signal.posedgeFirst.toString()}
          </div>
          ))
        }
      </div>
    );
  }

  export default SignalsList;
  
  
  
  
  

