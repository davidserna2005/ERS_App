function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

function renderFields(){
    fetch('http://localhost:3000/files', {
        // body: JSON.stringify(credential),
        headers: {
          'content-type': 'application/json'
        },
        credentials: 'include',
        method: 'GET'
      })
      .then(resp => {
        if (resp.status === 401) {
          throw 'Invalid Credentials';
        }
        if (resp.status === 200) {
          return resp.json();
        }
        throw 'Unable to obtain data try again later';
      })
      .then(data => {
        appendItemsToTable(data);
        
      })
      .catch(err => {
         console.log(err);
      })
}

function appendItemsToTable(data){
    for(let field of data.Items){
        let date = new Date(field.timeSubmitted);
        let newDiv = document.createElement('div');
        let newContent = document.createTextNode(`${field.username}-YYY-${field.status}--${field.approver}--${field.items}`);
        newDiv.appendChild(newContent);
        let element = document.getElementById(`${date.getFullYear()}`);
        element.appendChild(newDiv);
    }
}