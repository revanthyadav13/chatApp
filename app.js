const express = require('express');
const Sequelize= require('sequelize');
const sequelize=require('./util/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const User=require('./models/user');
const Chat=require('./models/chat');
const Group=require('./models/group');
const GroupMember=require('./models/groupMember');

const UserRoutes=require('./routes/user');
const chatRoutes=require('./routes/chat');
const groupRoutes=require('./routes/group');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/user',UserRoutes);
app.use('/chatApp',chatRoutes);
app.use('/group',groupRoutes);

User.belongsToMany(Group, { through: GroupMember });
Group.belongsToMany(User, { through: GroupMember });
Chat.belongsTo(User);
Chat.belongsTo(Group);
GroupMember.belongsTo(User);
GroupMember.belongsTo(Group);

sequelize
//.sync({alter:true})
.sync()
  .then(result => {
   app.listen(process.env.PORT);
  })