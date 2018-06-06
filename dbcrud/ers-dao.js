var AWS = require("aws-sdk");
let awsConfig = {
    "region": "us-east-2",
    "accessKeyId": process.env.AWS_ACCESS_KEY,
     "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY
};

AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();


// Saves a new object to a database
let save = function (input) {

   let params ={
       TableName: "users",
       Item: input
    }
 
   return docClient.put(params).promise();
}

let readUser = function(input){
    let params = {
        TableName: "users",
        Key: {
           username: input
        }
    }

    return docClient.get(params).promise();
}


let createReimbursement = function(username,reimbArr){
    let date = new Date();
    let params ={
        TableName: "reimbursements",
        Item: {
            username: username,
            timeSubmitted: date.getTime(),
            items: reimbArr,
            approver: "pending",
            status: "pending",
            receipts: []

        }
     }
  
    return docClient.put(params).promise();

}

function retreiveReimbursement(username,year){
    //creates date object to count milliseconds from 1970
    timesub = new Date(year,0).getTime();
    return docClient.query({
        TableName: 'reimbursements',
        KeyConditionExpression: `#un = :username ` , //and #ts >= :timesub
        ExpressionAttributeNames: { // for aliasing field names
          '#un': 'username',
        //   '#ts': 'timeSubmitted'
        },
        ExpressionAttributeValues: { // for aliasing actual values
          ':username': username,
        //   ':timesub': timesub
        },
        // ReturnConsumedCapacity: 'TOTAL' // not needed but if you want to see this info it is there
        
      }).promise();
}





//Export Modules
module.exports.retreiveReimbursement = retreiveReimbursement;
module.exports.createReimbursement = createReimbursement;
module.exports.save = save;
module.exports.readUser = readUser;