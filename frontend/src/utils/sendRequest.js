export default function sendRequest(requestObject) {
    
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    
    if(requestObject.headers) {
      for(let i=0; i<requestObject.headers.length; i++) {
        headers.append(requestObject.headers[i].name, requestObject.headers[i].value);
      }
    }
    
    let urlencoded = new URLSearchParams();
    if(requestObject.data) {
      for(let i=0; i<requestObject.data.length; i++) {
        urlencoded.append(requestObject.data[i].name, requestObject.data[i].value);
      }
    }

    let options = {
      method: requestObject.method,
      headers: headers
    };

    if(requestObject.method == 'POST') {
      options.body = urlencoded;
    }

    return fetch(requestObject.url, options)    
  }

