const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const userRouter = require('./routes/userRouter');
const fetchFilesRouter = require('./routes/fetchFilesRouter');



const app = express();

const port = 3000;

app.set('port',port);

const sess = {
  secret: 'keyboard dog',
  cookie: {secure:false},
  resave: false,
  saveUninitialized: false
};

app.use(session(sess));

// allows content to be served to the client from the static directory
app.use(
  express.static(path.join(__dirname,'static'))
);

// logs request being made
app.use((req, res, next) => {
  console.log(`request made with path: ${req.path} \nand type: ${req.method}`);
  next();
});

//use body parser to convert request to json
app.use(bodyParser.json());

//allow cross origin
app.use((req, resp, next) => {
  resp.header("Access-Control-Allow-Origin", "*");
  resp.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

/*******************************************************************************
 * ROUTERS
 *******************************************************************************/
app.use('/users',userRouter);
app.use('/files', fetchFilesRouter);







 //Start Server
 app.listen(port,()=>{
   console.log(`App is runnig at http://localhost:${app.get('port')}`);
 });
