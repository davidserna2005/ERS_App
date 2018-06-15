const ersServices = require('../services/ERS_services');
const express = require('express');
const authMiddleware = require('../security/auth-middleware')
const router = express.Router();



router.post('/',[
    authMiddleware('admin'),
    (req,resp,next)=>{
    console.log("connected ".repeat(10));
    console.log(req.session.role)
    console.log(req.body);
    let promiseArr = [];
    for(let item of req.body.Items){
       promiseArr.push(ersServices.updateReimbursement(item.username, Number(item.timeSubmitted),item.status,req.session.username));
    }

    Promise.all(promiseArr)
    .then((data)=>{
        resp.sendStatus(200);
        console.log(data);
    })
    .catch((e)=>{
        console.log(e);
    })
}
])

module.exports = router;