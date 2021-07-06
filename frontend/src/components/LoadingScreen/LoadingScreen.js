import React, { useState,useEffect } from 'react';

import config from "../../config.json";
import { sendRequest } from '../../utils';

import './LoadingScreen.css'

  const LoadingScreen = (props) => {

    const [projects, setProjects] = useState();

    return (
      <div className = 'loadingScreenDiv'>        
         <a className = 'loadingScreenText'>LOADING</a>
      </div>
    );
  
  }
  
  
  export default LoadingScreen;
  
  
  
  
  