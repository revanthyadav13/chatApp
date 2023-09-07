const Sequelize= require('sequelize');
const sequelize=require('../util/database');

const GroupMember = sequelize.define('groupMember', {
   
 isAdmin:{
    type:Sequelize.BOOLEAN,
    allowNull:false
 }
});

module.exports = GroupMember;