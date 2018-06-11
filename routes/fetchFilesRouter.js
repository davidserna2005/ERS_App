const ersServices = require('../services/ERS_services');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();




router.get('/',(req,res,next)=>{
    console.log(req.session);
    if(req.session.role === "employee"){
        ersServices.retreiveReimbursement(req.session.username)
        .then((data)=>{
            
            res.json(data);
        })
        .catch((err)=>{
            res.statusMessage('could not retrieve info');
        })
    }else{
        ersServices.retrieveAllReimbursements()
        .then((data)=>{
            res.json(data);
        })
        .catch((err)=>{
            res.statusMessage('could not retrieve info');
        })
    }

    
});

module.exports = router;