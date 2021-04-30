const express = require('express');
const app = express();
const cors = require('cors');
const userRouter = require('./routers/user');
const productRouter = require('./routers/products');
const promotionRouter = require('./routers/promotion');

const port = process.env.PORT || 3000;

//app.use(cors());
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

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);

app.use(express.json());
app.use(userRouter);
app.use(productRouter);
app.use(promotionRouter);
