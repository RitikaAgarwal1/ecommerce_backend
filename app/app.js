const express = require('express')
const app = express();
const userRouter = require('./routers/user');
const productRouter = require('./routers/products');

const port = process.env.PORT || 3000;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);

app.use(express.json());
app.use(userRouter);
app.use(productRouter);
