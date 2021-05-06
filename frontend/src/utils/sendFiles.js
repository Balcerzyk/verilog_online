export default function sendFiles(requestObject) {
    let headers = new Headers();
    
    if(requestObject.headers) {
      for(let i=0; i<requestObject.headers.length; i++) {
        headers.append(requestObject.headers[i].name, requestObject.headers[i].value);
      }
    }

    let options = {
      method: 'POST',
      headers: headers,
      body: requestObject.data
    };

    return fetch(requestObject.url, options)
    
  }