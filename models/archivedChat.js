const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const ArchivedChat = sequelize.define("archivedChat",{
    name:{
    type: Sequelize.STRING,
    allowNull: false
  },
  message:{
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = ArchivedChat;