const ersServices = require('../services/ERS_services');
const express = require('express');
const bcrypt = require('bcrypt');


const router = express.Router();

//Block Autheticates and LogIn user.
router.post('/login',(req,resp,next)=>{
    const user = req.body;
    ersServices.readUser(user.username)
    .then(data=>{
        let responseObject = data.Item
        //Block checks to see if the database response contains any data
        if(responseObject === undefined){
            resp.send('username/password not found');
        }
        //Compares password to the hash version in the data base
        bcrypt.compare(user.password, responseObject.password, function(err, res) {
            if(res) {
                // Block checks to see if role is admin and assigns it a session role of admin
                if(responseObject.role === 'admin'){
                    req.session.username = user.username;
                    req.session.role = 'admin';
                    resp.json({
                        username: user.username,
                        role: 'admin'
                    });

                }
                // Block checks to see if roles is employee and assigns it a session role of employee
                if(responseObject.role === 'employee'){
                    req.session.username = user.username;
                    req.session.role = 'employee';
                    resp.json({
                        username: user.username,
                        role: 'employee'
                    });
                }
            } else {
             // Passwords don't match
             resp.send('username/password not found');
            } 
        });

        
    })
    .catch(err=>{
        console.log(err);
    });

});


/**
 * This will reset the session so that all session data is removed and a new session id will be created
 */
router.delete('/logout',(req,resp,next)=>{
    req.session.regenerate(err => {
        if (err) {
            resp.sendStatus(500);
        } else {
            resp.end();
        }
        });
});

module.exports = router;