import React, { useState, useEffect } from 'react';
 
const ExecutionResult = (props) => {

  const [result, setResult] = useState('none');

  return (
    <div>
        <button onClick={execute}>Execute</button><br/><br/>
        <a>Result:</a><br/>
      {result}
    </div>  
  );

  function execute() {
    let url = `http://localhost:8080/api/projects/execute/${props.projectid}`;
  
    setResult('please wait')

    fetch(url, {
      method: 'GET',
    }).then(response => response.text())
    .then((body) => {
      setResult(body)
    });
  }
}


export default ExecutionResult;