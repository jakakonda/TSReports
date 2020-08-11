import express = require('express');
import logger = require('morgan');
require('dotenv').config();

// Create a new express application instance
const app: express.Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

import apiRenderRouter from './routes/render';
app.use('/api/report', apiRenderRouter);

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`TSReports app listening on port ${port}!`);
});