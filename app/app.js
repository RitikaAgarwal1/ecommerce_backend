const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const helmet = require("helmet");
const userRouter = require('./routers/user');
const productRouter = require('./routers/products');
const promotionRouter = require('./routers/promotion');
const commonRouter = require('./routers/common');

const port = process.env.PORT || 3000;

app.options('*', cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS');
  next()
});

app.get('/', async (req, res) => {
  try {
      res.send({Message: "We are in API of Ecommerce Website"});
  } catch (e) {
      console.log('error', e);
      res.status(500).send({
          Error: e.message
      });
  }
});

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(userRouter);
app.use(productRouter);
app.use(promotionRouter);
app.use(commonRouter);
