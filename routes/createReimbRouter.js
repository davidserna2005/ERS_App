const ersServices = require('../services/ERS_services');
const express = require('express');

const router = express.Router();

router.post('/',(req,res,next)=>{
    ersServices.createReimbursement(req.session.username,req.body)
    .then((data)=>{
        res.statusCode('200');
    })
    .catch((err)=>{
        res.json(err);
    })
})


module.exports = router;