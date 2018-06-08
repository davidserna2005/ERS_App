const ersServices = require('../services/ERS_services');
const express = require('express');

const router = express.Router();

router.post('/',(req,res,next)=>{
    console.log(req);
    console.log('reimbursement router works');
})


module.exports = router;