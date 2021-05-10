import React, { useState, useEffect } from 'react';

import './ExecutionResult.css'

const ExecutionResult = (props) => {

  const [result, setResult] = useState('none');

  useEffect(() => {
    setResult(props.result)
}, [props.result]);

  return (
    <div className='executionResultDiv'>
        <a className='resultText'>Result:</a>
        <div className='executionResult'>{result}</div>
    </div>  
  );
}


export default ExecutionResult;