var AWS = require("aws-sdk");
let awsConfig = {
    "region": "us-east-2",
    "accessKeyId": "",
     "secretAccessKey": ""
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

let save = function (input) {

    // var input = {
    //     "username": "SecondUser",
    //     "works": "uhmm"
    // };
    var params = {
        TableName: "ERM_Project",
        Item:  input
    };
    docClient.put(params, function (err, data) {

        if (err) {
            console.log("users::save::error - " + JSON.stringify(err, null, 2));                      
        } else {
            console.log("users::save::success" );                      
        }
    });
}

module.exports.save = save;