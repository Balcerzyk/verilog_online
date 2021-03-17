import React, { useState } from 'react';
import Editor from '../Editor/Editor' 
const CodeEditor = () => {

  const [currentFile, setCurrentFile] = useState(0);
  const [files, setFiles] = useState([]);
  const [textAreaText, setTextAreaText] = useState("sasasa");

  return (
    <div>
        <button onClick={upload}>save</button>
        <button onClick={createFile}>create new file</button>
        <button onClick={()=>{setTextAreaText("heja")}}>zmien</button>
        <div>
          {files.map(file => (
            <div>{file.name}</div> 
          ))}
        </div>
        <Editor value={textAreaText} />
        {textAreaText}
    </div>
    
  );

  function readFile() {
    if(files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
        console.log(reader.result);
        setTextAreaText(reader.result)
        return "halko";
      }
      reader.readAsText(files[0]); 
    }    
  }

  function upload() {
    const formData  = new FormData();

    var file = new File(["foo"], "foo.txt", {
        type: "text/plain",
      });

    formData.append(file, file);

  
    const response = fetch('http://localhost:8000/', {
      method: 'POST',
      body: formData
    });
  }

  function createFile() {
    var file = new File(["HALO TU TEKST"], "file.txt", {
        type: "text/plain",
      });
      
      setFiles(oldArray => [...oldArray, file]);
      setCurrentFile("lel.txt")
      readFile();
      
  }
}


export default CodeEditor;