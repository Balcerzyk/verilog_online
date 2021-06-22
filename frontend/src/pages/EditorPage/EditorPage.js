import React, { useState,useEffect } from 'react';
import FileExplorer from '../../components/FileExplorer/FileExplorer'
import Editor from "../../components/Editor/Editor";
import CreateFileBox from "../../components/CreateFileBox/CreateFileBox";
import InputBox from "../../components/InputBox/InputBox";
import ExecutionResult from "../../components/ExecutionResult/ExecutionResult"
import Waveforms from "../../components/Waveforms/Waveforms"
import AlertBox from "../../components/AlertBox/AlertBox"
import SignalsMenu from "../../components/SignalsMenu/SignalsMenu"
import SignalsList from "../../components/SignalsList/SignalsList"
import EditorTopBar from "../../components/EditorTopBar/EditorTopBar"
import config from "../../config.json";
import { sendRequest, sendFiles } from '../../utils';

  const EditorPage = (props) => {

    const [currentFileIndex, setCurrentFileIndex] = useState(0);
    const [showCreateFileBox, setShowCreateFileBox] = useState(false);
    const [showInputBox, setShowInputBox] = useState(false);
    const [result, setResult] = useState('none');
    const [shouldDraw, setShouldDraw] = useState(false);
    const [waveforms, setWaveforms] = useState(null);
    const [files, setFiles] = useState([]);
    const [signals, setSignals] = useState([]);
    const [alert, setAlert] = useState(null);
    const [loaded, setLoaded] = useState(false);
    
    useEffect(() => {
      setProject(props.project);
    }, []);

    return (
        <div>
            {
              !loaded &&
              <div>LOADING</div>
            }
            
            {
                loaded && alert &&
                <AlertBox text={alert.text} abortFunction={alert.abortFunction} applyFunction={alert.applyFunction}/>
            }
            {
                loaded && showCreateFileBox &&
                <CreateFileBox visibility={(visibility) => setShowCreateFileBox(visibility)} saveFile={saveFile} files={files}/>
            }
            {
                loaded && showInputBox &&
                <InputBox visibility={(visibility) => setShowInputBox(visibility)} update={updateProject}/>
            }
            {
              loaded && files.length == 0 &&
              <button onClick={() => setShowCreateFileBox(true)}>Create your first file!</button>
            }
            {
              loaded && files.length != 0 &&
            <div className='codeEditorScreenDiv'>
              <EditorTopBar back={() => {
                  let alert = {
                      text: "Are you sure?",
                      abortFunction: () => setAlert(null),
                      applyFunction: () => {props.clearProject(); setCurrentFileIndex(0);  setResult('none'); setAlert(null); setLoaded(false); setFiles([]); setSignals([])}
                  }
                  setAlert(alert);
              }}
              createFile={() => setShowCreateFileBox(true)}
              sendFiles={sendUserFiles}
              execute={execute}
              />
              <div className='menuLeft'>
                  <a className='menuProjectName'>
                      <button className='editTitleButton' onClick={() => setShowInputBox(true)}>Edit</button>
                      {props.project.name}
                  </a>
                  <svg className='projectNameUnderlineSvg'>
                      <rect className='projectNameUnderlineRect'/>
                  </svg>
                  <FileExplorer files={files} changeIndex={(index => setCurrentFileIndex(index))} delete={(index) => {
                    let alert = {
                        text: "Do you really want to delete this file?" ,
                        abortFunction: () => setAlert(null),
                        applyFunction: () => {deleteFile(index); setAlert(null)}
                    }
                    setAlert(alert);
                  }}
                  changeName = {(activeFile, filename) => {
                    let newFilesArray = files;
                    newFilesArray[activeFile].name = filename;
                    setFiles(newFilesArray);
                  }}
                  />
                  <SignalsMenu addSignal={(signal) => {setSignals(oldArray => [...oldArray, signal])}}/>
                  <SignalsList signals={signals}/>
              </div>
              <div className='editorDiv'>
                  <Editor file={files[currentFileIndex]} updateContent = {(editorContent) => {files[currentFileIndex].content = editorContent}} language="verilog" />
              </div>
              <div className='results'>
                  <button className='executionButton' onClick={execute}>Execute</button>
                  <ExecutionResult user={props.user} projectId={props.project.id} result={result}/>
                  <Waveforms fileContent={waveforms} shouldDraw={shouldDraw}/>
              </div>
            </div>
            }
        </div>
    );

    function saveFile(createdFile) {  
      setCurrentFileIndex(files.length)
      setFiles(oldArray => [...oldArray, createdFile]);
      setShowCreateFileBox(false);
    }
  
    function updateProject(projectName) {
      let requestObject = {
        url: `${config.SERVER_URL}/api/projects/${props.project.id}`, 
        method: 'PUT', 
        headers: [{name: 'Authorization', value: `Bearer ${props.user.token}`}],
        data: [{name: 'projectName', value: projectName}]
      }
      sendRequest(requestObject)
      .then( response => {
        if(response.status == 200) {
          setShowInputBox(false);
          let newProject = {
            id: props.project._id,
            name: projectName
          }
          props.setProject(newProject);
        }
        else console.log('an error occured')
      });
    }
    
      function sendUserFiles(){
        let data  = new FormData();
        data.append('projectId', props.project.id)
        for(let i=0; i<files.length; i++) {
          data.append('files', new Blob([files[i].content]), files[i].name)
        }
    
        data.append('signals', JSON.stringify(signals));
    
        let requestObject = {
          url: `${config.SERVER_URL}/api/files`, 
          method: 'POST', 
          headers: [{name: 'Authorization', value: `Bearer ${props.user.token}`}],
          data: data
        }
        return sendFiles(requestObject)
      }
    
      function deleteFile(index) {
        let newFilesArray = files;
        newFilesArray.splice(index, 1);
        setFiles(newFilesArray);
      }
    
      function getWaveforms() {
        setShouldDraw(false);
    
        let requestObject = {
          url: `${config.SERVER_URL}/api/projects/waveforms/${props.project.id}`, 
          method: 'GET', 
          headers: [{name: 'Authorization', value: `Bearer ${props.user.token}`}],
        }
        sendRequest(requestObject)
        .then( response => {
          if(response.status == 200) {
            response.text().then(text => {
              setWaveforms(text);
            setShouldDraw(true);
            })
          } 
        })
      }
    
      async function execute() {
        setResult('please wait')
    
        await sendUserFiles().then(function(response) {
          let requestObject = {
            url: `${config.SERVER_URL}/api/projects/execute/${props.project.id}`, 
            method: 'GET', 
            headers: [{name: 'Authorization', value: `Bearer ${props.user.token}`}]
          }
          sendRequest(requestObject).then(response => response.text())
          .then((body) => {
            setResult(body);
            getWaveforms();
          }).catch(function(error) {
            console.log(error)
          });
        }).catch(function(error) {
          console.log(error)
        });
      }

      function setProject(project) {
        let requestObject = {
          url: `${config.SERVER_URL}/api/projects/${project.id}`, 
          method: 'GET', 
          headers: [{name: 'Authorization', value: `Bearer ${props.user.token}`}],
        }
        sendRequest(requestObject)
        .then(response => {
          if(response.status == 200) {
            response.json().then(json => {
              let projectData = json.data;
              if(projectData.files.length > 0) {
                for(let i=0; i<projectData.files.length; i++) {
                  let newFile = {
                    name: '',
                    content: ''
                  }
                  
                  requestObject = {
                    url: `${config.SERVER_URL}/api/files/${projectData.files[i].fileid}`, 
                    method: 'GET', 
                    headers: [{name: 'Authorization', value: `Bearer ${props.user.token}`}],
                  }
                  sendRequest(requestObject)
                  .then(response => {
                    if(response.status == 200) {
                      response.json().then(json => {
                        newFile.name = json.data.name;
                      })
                    } 
                  });
            
                  requestObject = {
                    url: `${config.SERVER_URL}/api/files/getContent/${projectData.files[i].fileid}`, 
                    method: 'GET', 
                    headers: [{name: 'Authorization', value: `Bearer ${props.user.token}`}],
                  }
                  sendRequest(requestObject)
                  .then(response => {
                    if(response.status == 200) {
                      response.text().then(text => {
                        newFile.content = text;
                        setTimeout(() => {  
                          setFiles(oldArray => [...oldArray, newFile]); 
                          if(i == projectData.files.length - 1) {
                            setLoaded(true);
                          }
                        }, 1000); ///////////////////////////////////////////// TODO delete delay
                      })
                    } 
                  });
                }
                getSignals(project);
              }
              else {
                setLoaded(true);
              }
            })
          } 
        }); 
      }

      function getSignals(project) {
        let requestObject = {
          url: `${config.SERVER_URL}/api/projects/signals/${project.id}`, 
          method: 'GET', 
          headers: [{name: 'Authorization', value: `Bearer ${props.user.token}`}],
        }

        sendRequest(requestObject)
        .then( response => {
          if(response.status == 200) {
            response.json().then(json => {
              setSignals(json);
            })
          } 
        });
      }
  }

  export default EditorPage;