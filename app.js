const express = require('express');
const Sequelize= require('sequelize');
const sequelize=require('./util/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const UserDetails=require('./models/userDetails');
const Chat=require('./models/chat');

const userDetailsRoutes=require('./routes/userDetails');
const chatRoutes=require('./routes/chat');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/user',userDetailsRoutes);
app.use('/chatApp',chatRoutes);

UserDetails.hasMany(Chat,{ foreignKey: 'userId' });
Chat.belongsTo(UserDetails,{ foreignKey: 'userId' });

sequelize
//.sync({alter:true})
.sync()
  .then(result => {
   app.listen(process.env.PORT);
  })