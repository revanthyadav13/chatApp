const Sequelize = require('sequelize');
const Chat=require('../models/chat');
const User=require('../models/User');
const Group=require('../models/group');
const ArchivedChat=require('../models/archivedChat');

exports.getRequestFetchUserName=async(req, res)=>{
    try{
        const userId=req.user.id
        const user = await User.findAll({where:{id:userId}});
        const usersOnline = await User.findAll({where:{userStatus:true}});

    res.status(200).json({usersOnline: usersOnline, user:user});
    }catch(err){
        res.status(500).json({error:err});
    }
 }

 exports.getRequestLogOut=async(req, res)=>{
     try{
        const userId=req.user.id;
        const status = await User.update({ userStatus: false}, {
  where: {
    id: userId
  }
});

    res.status(200).json({logout: status});
    }catch(err){
        res.status(500).json({error:err});
    }
 }


exports.getRequestFetchUsers=async(req, res)=>{
    try{
        const userId=req.user.id
        const searchInput = req.query.search || '';
        if (!searchInput) {
            return res.status(200).json({ users: [] });
        }
        const users = await User.findAll({
            where: {
                id: {
                    [Sequelize.Op.not]: userId,
                },
                [Sequelize.Op.or]: [
                    {
                        name: {
                            [Sequelize.Op.like]: `%${searchInput}%`, // Case-insensitive name matching
                        },
                    },
                    {
                        id: {
                            [Sequelize.Op.like]: `%${searchInput}%`, // Case-insensitive email matching
                        },
                    },
                ],
            },
        });


    res.status(200).json({users:users});
    }catch(err){
        res.status(500).json({error:err});
    }
 }

 exports.performGroupCleanup = async(req, res)=> {
  try {
    // Calculate the date 1 day ago
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    // Find chat messages that are 1 day old
    const oldMessages = await Chat.findAll({
      where: {
        createdAt: {
          [Sequelize.Op.lt]: oneDayAgo, // Less than 1 day ago
        },
      },
    });

    if (oldMessages.length > 0) {
      // Insert old messages into the ArchivedChat Table
      await ArchivedChat.bulkCreate(oldMessages.map((message) => message.toJSON()));

      // Delete old messages from the primary Chat table
      await Chat.destroy({
        where: {
          createdAt: {
            [Sequelize.Op.lt]: oneDayAgo,
          },
        },
      });
    }

    console.log(`Performed group cleanup. Moved ${oldMessages.length} messages to ArchivedChat.`);
  } catch (error) {
    console.error('Error performing group cleanup:', error);
  }
};