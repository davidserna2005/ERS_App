
// Create Name Space for item storage
var myNamespace = window.itemNameSpace || {};
//add itmes array
myNamespace.items = [];
myNamespace.table = {};
myNamespace.currentTable = {};
myNamespace.updateTable = {
    Items:[]
};

//http logout request

function logout(){
    fetch('http://localhost:3000/users/logout', {
        headers: {
          'content-type': 'application/json'
        },
        credentials: 'include',
        method: 'DELETE'
      })
      .then(resp => {
        if (resp.status === 401) {
          throw 'Invalid Credentials';
        }
        if (resp.status === 200) {
            console.log(resp);
            window.location = '../sign-in/sign-in.html'
        }
        throw 'Unable to obtain data try again later';
      })
      .catch(err => {
         console.log(err);
      })
}


//http post request 
function createReimbDB(){
    if(myNamespace.items.length === 0){
        console.log('empty array');
        return;
    }

    fetch('http://localhost:3000/createReimb', {
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(myNamespace.items),
        credentials: 'include',
        method: 'POST'
      })
      .then(resp => {
        if (resp.status === 401) {
          throw 'Invalid Credentials';
        }
        if (resp.status === 200) {
            renderFields();
            return;
        }
        throw 'Unable to obtain data try again later';
      })
      .catch(err => {
         console.log(err);
      })
    removeAllItemsFromReimbTable();
    myNamespace.items = []; 

}


function removeAllItemsFromReimbTable(){
    let reimbTable = document.getElementById('reimbTableBody');
    let length = reimbTable.children.length;
    while(length !== 0){
        reimbTable.removeChild(reimbTable.children[length-1]);
        length = reimbTable.children.length;
    }
}

//http call function
function renderFields(){ 
    fetch('http://localhost:3000/files', {
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
        
        myNamespace.table = data;

        
        function sorDesc(a,b){
            if (a.timeSubmitted > b.timeSubmitted)
              return -1;
            if (a.timeSubmitted <  b.timeSubmitted)
              return 1;
            return 0;
        }
        myNamespace.table.Items = myNamespace.table.Items.sort(sorDesc);
        renderPaths();
        // appendItemsToTable(myNamespace.table);
        
      })
      .catch(err => {
         console.log(err);
      })
}

//function
function appendItemsToTable(data){
    console.log(data);
    let element = document.getElementById('tbody');
    element.innerHTML = "";
    for(let field of data.Items){
        let date = new Date(field.timeSubmitted);
        // Create New Row
        let newRow = document.createElement('tr');
        let inputId = Date.now();
        newRow.innerHTML = `
            <tr>
                <td>${field.username}</td>
                <td>${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}</td>
                <td>
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#${field.timeSubmitted}">
                                View Items
                    </button>
                </td>
                <td>${field.approver}</td>
                <td>${field.status}</td>
                <td>
                    <div>
                        <div class="radio" >
                            <label><input type="radio" name="${field.timeSubmitted}" value="approved" class="${inputId}">Approve</label>
                        </div>
                        <div class="radio">
                            <label><input type="radio" name="${field.timeSubmitted}" value="denied" class="${inputId}">Deny</label>
                        </div>
                    <div/>    
                </td>
            <tr/>
        `;
        
        // element.insertBefore(newRow, element.firstChild);
        element.appendChild(newRow);

        //select current radion input
        let radioButton = document.getElementsByClassName(inputId);
        for(let item of radioButton){
            item.addEventListener("click", updateCallbackFunction);
        }

        // Create New Modal
        let newModal = document.createElement('div');
        newModal.id = `${field.timeSubmitted}`;
        newModal.className = "modal fade";
        newModal.innerHTML = `
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body ">
                            <table class="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th>title</th>
                                            <th>amount</th>
                                            <th>description</th>
                                            <th>time of expense</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                            ${
                                                field.items.map((item)=>{
                                                   return( 
                                                    `
                                                    <tr>
                                                        <th>${item.title}</th>
                                                        <th>${item.amount}</th>
                                                        <th>${item.description}</th>
                                                        <th>${item.amount}</th>
                                                    </tr>
                                                    `
                                                   );
                                                })
                                            }   
                                    </tbody>
                            </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                    </div>
                </div>
        
        `;
        let modals = document.getElementById('modals');
        modals.appendChild(newModal);
    }

    hideShow();
}


//Event Initializer
function addItemToReimbursementTable(){
    let itemForm = document.getElementById('addItem');
    console.log(itemForm);
    itemForm.addEventListener('click',(e)=>{
        // Get All Form Elements
        let title = document.getElementById('title');
        let amount = document.getElementById('amount');
        let description = document.getElementById('description');
        let timeOfExpense = document.getElementById('timeOfExpense');
        let reimbTable = document.getElementById('reimbTableBody');
        let newTableRow = document.createElement('tr');
        let errorContainer = document.getElementById('addItemError');

        let item = {
            title:title.value,
            amount: amount.value,
            description: description.value,
            timeOfExpense: timeOfExpense.value
        }

        // Validate Items

        let itemKeys = Object.keys(item);
        // for loop that runs thru items array and validates fields
        for(let key of itemKeys){
            let errorMessage = "Missing Input Field";
            errorContainer.style.color = "red";
            if(item[key] === ""){
                errorContainer.innerText=errorMessage;
                return;
            }else{
                if(key === "amount"){
                    if(isNaN(item[key])){
                        errorMessage = "Amount must be a number";
                        errorContainer.innerText=errorMessage;
                        return;
                    }
                }

            }
            
        }

        //insert item into namespace object
        myNamespace.items.push(item);

        //create new row comprised of new input elements 
        newTableRow.innerHTML = `
            <tr>
                <td>${title.value}</td>
                <td>${amount.value}</td>
                <td>${description.value}</td>
                <td>${timeOfExpense.value}</td>
            </tr>
        
        `
        reimbTable.appendChild(newTableRow);

        //Reset All Form Fields
        errorContainer.innerText = '';
        title.value='';
        amount.value = '';
        description.value = '';
        timeOfExpense.value = '';
    });

}
//Event Initializer
function removeItemFromReimbursementTable(){
    let deleteItem = document.getElementById('removeItem');
    deleteItem.addEventListener('click',(e)=>{
        let reimbTable = document.getElementById('reimbTableBody');
        let length = reimbTable.children.length;
        if(length !== 0){
            reimbTable.removeChild(reimbTable.children[length-1]);
        }
    })
}

//Logout event listener

function logoutEventInitializer(){
    let logoutButton = document.getElementById('logout');
    logoutButton = logoutButton.addEventListener('click',logout);
}
//Search Bar Event Initializers

function searchBarsInitializers(){
    let userSearch = document.getElementById('userNameSearch');
    let statusSearch = document.getElementById('statusSelect');
    let timeSearch = document.getElementById('timeSubSelect');

    userSearch.addEventListener("keyup", userSearchFunction);
    statusSearch.addEventListener("change", statusSearchFunction);
    timeSearch.addEventListener("change", timeSearchFunction);
}

//Submit All Denials/Approvals Evetn Initializer
function submitDenialApprovalInitializer(){
    let submitDAButton = document.getElementById('updateItems');
    submitDAButton.addEventListener("click",submitAD)
}


//Search Functions
function userSearchFunction(e){
    let items = [];
    if(Object.keys(myNamespace.currentTable).length === 0){
        items = myNamespace.table.Items;
    }else{
        items = myNamespace.currentTable.Items;
    }

    let newArr = items.filter((element)=>{
        if(element.username.startsWith(e.target.value)){
            return true;
        }
        return false;
    })
    console.log(newArr);
    let objIn = {
        Items: newArr
    }
    appendItemsToTable(objIn);
}

function statusSearchFunction(e){
    let items = myNamespace.table.Items;
    let searchUsername = document.getElementById('userNameSearch');
    
    let newArr = items.filter((element)=>{
        if(element.status === e.target.value){
            return true;
        }
        return false;
    })

    if(e.target.value ==="All"){
        newArr = myNamespace.table.Items;
    }

    console.log(newArr);
    let objIn = {
        Items: newArr
    }

    myNamespace.currentTable = objIn;
    searchUsername.value = "";
    appendItemsToTable(objIn);
}

function timeSearchFunction(e){
    let searchUsername = document.getElementById('userNameSearch');
    let items = myNamespace.table.Items;

    function sorAsc(a,b) {
        if (a.timeSubmitted < b.timeSubmitted)
          return -1;
        if (a.timeSubmitted >  b.timeSubmitted)
          return 1;
        return 0;
      }
    function sorDesc(a,b){
        if (a.timeSubmitted > b.timeSubmitted)
          return -1;
        if (a.timeSubmitted <  b.timeSubmitted)
          return 1;
        return 0;
    }

    if(Object.keys(myNamespace.currentTable).length === 0){
        items = myNamespace.table.Items;
    }else{
        items = myNamespace.currentTable.Items;
    }    

    let newArr = items.sort(sorDesc);
    let wholeArr = myNamespace.table.Items.sort(sorDesc);
    console.log(newArr);
    if(e.target.value === "Ascending"){
        newArr = items.sort(sorAsc);
        wholeArr = myNamespace.table.Items.sort(sorAsc);
    }

    let objIn = {
        Items: newArr
    }
    searchUsername.value = "";
    myNamespace.table.Items = wholeArr;
    appendItemsToTable(objIn);
      

}


//Submit Approval Denial function
function submitAD(e){
    fetch('http://localhost:3000/adReimb', {
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(myNamespace.updateTable),
        credentials: 'include',
        method: 'POST'
      })
      .then(resp => {
        if (resp.status === 401) {
          throw 'Invalid Credentials';
        }
        if (resp.status === 200) {
            myNamespace.updateTable.Items = [];
            console.log("got the response from approvals and denials");
            setTimeout(renderFields, 100);
            return;
        }
        throw 'Unable to obtain data try again later';
      })
      .catch(err => {
         console.log(err);
      })



}

// Radio Button Event Hnadler

function updateCallbackFunction(e){
    for(let document of myNamespace.updateTable.Items){
        if(document.timeSubmitted === Number(e.target.name)){
            document.status = e.target.value;
            return;
        }
    }
    
    for(let document of myNamespace.table.Items){
        if(document.timeSubmitted === Number(e.target.name)){
            let newDocument = document;
            newDocument.status = e.target.value;
            myNamespace.updateTable.Items.push(document);
            return;
        }
    }

}

// hide show fields depending on the user
function hideShow(){
    let url = window.location.search;
    let urlAux = url.split('=');
    let role = urlAux[1]

    if(role === "employee"){
        $(`#records tr td:last-child`).css('display','none');
        $(`#records tr th:last-child`).css('display','none');
        $('#updateItems').css('display','none');
    }
}
//funcion selects how to render fields 
function renderPaths(){
    let status = document.getElementById('statusSelect');
    console.log(status.options[status.selectedIndex].value);
    if(status.options[status.selectedIndex].value === "approved" ){
        statusSearchFunction({target:{value:"approved"}});
    }else if(status.options[status.selectedIndex].value === "All"){
        appendItemsToTable(myNamespace.table);
    }else if(status.options[status.selectedIndex].value === "pending"){
        statusSearchFunction({target:{value:"pending"}});
    }

    
}
//submit ReimbTable Event Initializer
function submitReimbItemsInitializer(){
    let submitReimbButton = document.getElementById('submitReimbTable');
    submitReimbButton.addEventListener('click',(e)=>{
        createReimbDB();
    })
}

// Fetch User files from database and render them

$(document).ready(()=>{
    renderFields();
    submitDenialApprovalInitializer();
    submitReimbItemsInitializer();
    addItemToReimbursementTable();
    removeItemFromReimbursementTable();
    logoutEventInitializer();
    searchBarsInitializers()
}
)