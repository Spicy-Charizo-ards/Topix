import express from 'express';
import cors from 'cors';
import path from 'path';
import {fileURLToPath} from 'url';

//TODO these need to be changed to es import format.
// const apiRouter = require('./routers/apiRouter.js');
// const cookieParser = require('cookie-parser');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// * CORS
app.use(cors());

//parse json from incoming request
app.use(express.json());

//serve index through main folder
app.use(express.static(path.resolve(__dirname, '../src')));

//link router
//app.use()

//! add catch all error handler for incorrect routes
app.use((req, res) => res.status(404).send('This is not the page you\re looking for.'))

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