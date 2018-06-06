const ersServices = require('../services/ERS_services');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();




router.get('/',(req,res,next)=>{
    console.log(req.session);
    if(req.session.role === "employee"){
        console.log('got here');
        ersServices.retreiveReimbursement('employee')
        .then((data)=>{
            
            res.json(data);
        })
        .catch((err)=>{
            res.statusMessage('could not retrieve info');
        })
    }else{

    }

    
});













/*********************************
 * Code Test Below
 * ********************************* */



// let testArr = [
//     {
//         title: "test5",
//         amount: 50,
//         description: "Fifth item for test",
//         timeOfExpense: 10 // number
//     },
//     {
//         title: "test6",
//         amount: 60,
//         description: "Sixth item for test",
//         timeOfExpense: 20 // number
//     }
        
// ]

// ersServices.createReimbursement("employee",testArr)
// .then((data)=>{
//     console.log(data);
// })
// .catch((err)=>{
//     console.log(err);
// })









module.exports = router;