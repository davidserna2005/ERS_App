let AWS = require('aws-sdk');
let express = require('express');

let awsConfig = {
    "region": "us-east-2",
    "accessKeyId":"",
    "secretAccessKey": ""
};

AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();


let getItem = (callback,key)=>{

    var params = {
        TableName : "ERM_Project",
        Key: {
            "username": key
        }
    };

    docClient.get(params, function(err,data){
        if(err){
            console.log('Error',err);
        }
        else{
            callback(data);
        }
    });

}

module.exports.getItem = getItem;
