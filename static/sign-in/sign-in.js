function login() {
    const username = document.getElementById('inputUsername').value;
    const password = document.getElementById('inputPassword').value;
  
    const credential = {username, password}; // this will create an object like {username: 'blake', password: 'pass'} based on the values in those variables
  
    fetch('http://localhost:3000/users/login', {
      body: JSON.stringify(credential),
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'include',
      method: 'POST'
    })
    .then(resp => {
      console.log(resp.status)
      if (resp.status === 401) {
        throw 'Invalid Credentials';
      }
      if (resp.status === 200) {
        return resp.json();
      }
      throw 'Unable to login at this time, please try again later';
    })
    .then(data => {
      window.location = '../resources/main.html?role='+data.role;
    })
    .catch(err => {
      document.getElementById('error-message').innerText = err;
    })
  
  }
  