import React, { useState } from 'react';

import config from "../../config.json";
import { sendRequest } from '../../utils';

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
    setResult('please wait')

    let requestObject = {
      url: `${config.SERVER_URL}/api/projects/execute/${props.projectId}`, 
      method: 'GET', 
      headers: [{name: 'Authorization', value: `Bearer ${props.user.token}`}]
    }
    sendRequest(requestObject).then(response => response.text())
    .then((body) => {
      setResult(body)
    });
  }
}


export default ExecutionResult;