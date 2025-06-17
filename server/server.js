const express = require('express');
const cors = require('cors');
const path = require('path');
// const apiRouter = require('./routers/apiRouter.js');
// const cookieParser = require('cookie-parser');

const app = express();

// * CORS
app.use(cors());

//parse json from incoming request
app.use(express.json());

//serve index through main folder
app.use(express.static(path.join(__dirname, '../')));

//link router



//global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(3000, ()=>console.log('server listening on port 3000'));