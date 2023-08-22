const express = require('express');
const Sequelize= require('sequelize');
const sequelize=require('./util/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const userDetailsRoutes=require('./routes/userDetails');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/user',userDetailsRoutes);

sequelize
//.sync({ alter: true })
.sync()
  .then(result => {
   app.listen(process.env.PORT);
  })