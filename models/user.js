const Sequelize= require('sequelize');
const sequelize=require('../util/database');

const User = sequelize.define('user', {
    id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
 name:{
    type: Sequelize.STRING,
    allowNull: false
 },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  phoneNumber:{
    type: Sequelize.STRING,
    allowNull: false
  },
   password: {
    type: Sequelize.STRING,
    allowNull: false
  },
   userStatus:{
    type:Sequelize.BOOLEAN,
    allowNull:false
  }
});

module.exports = User;
