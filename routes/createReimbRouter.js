const ersServices = require('../services/ERS_services');
const express = require('express');

const router = express.Router();

router.post('/',(req,res,next)=>{
    console.log(req.body[0]);
    console.log('reimbursement router works');
    ersServices.createReimbursement(req.session.username,req.body)
    .then((data)=>{
        console.log(data);
    })
    .catch((err)=>{
        console.log(err);
    })
})


module.exports = router;