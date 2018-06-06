const ersDao = require('../dbcrud/ers-dao');


function save(fields){
    return ersDao.save(fields);
}

function readUser(username){
    return ersDao.readUser(username)
}

// function createReimbursement(username,title,amount,description,timeOfExpense){
//     reimburseArr = {
//         title : title,
//         amount : amount,
//         description: description,
//         timeOfExpense : timeOfExpense
//     }

//     return ersDao.createReimbursement(username,reimburseArr)
// }

function createReimbursement(username,reimburseArr){
    let acceptedKeys = ["title", "amount", "description","timeOfExpense"];
    // return if reimbursement arr is to long
    if(reimburseArr.legth > 10){
        return;
    }
    for(let i = 0; i< reimburseArr.length; i++){
        for(let j = 0; j< acceptedKeys.length; j++){
            //return if the reimbursement arr does not have the require fields
            if(!(acceptedKeys[j] in reimburseArr[i])){
                return;
            }
        }
    }
    
    return ersDao.createReimbursement(username,reimburseArr)
}


function retreiveReimbursement(username){

    return ersDao.retreiveReimbursement(username);
}


module.exports.retreiveReimbursement = retreiveReimbursement;
module.exports.save = save;
module.exports.readUser = readUser;
module.exports.createReimbursement = createReimbursement;


