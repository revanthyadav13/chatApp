const Sequelize = require('sequelize');
const Chat=require('../models/chat');
const User=require('../models/User');
const Group=require('../models/group');

exports.postRequestSendMessage=async(req, res)=>{

    try{
    const message=req.body.message;
    const userId=req.user.id;
    const name=req.user.name;
   const chat= await Chat.create({userId:userId, name:name, message:message});

   res.status(200).json({newChat:chat})
    }catch(err){
     res.status(500).json({error:err});
    }
 };

 exports.getRequestFetchMessage=async(req,res)=>{
    try{
        const { lastMessageId } = req.query;
         const chats = await Chat.findAll({
      where: {
        id: {
          [Sequelize.Op.gt]: lastMessageId,
        },
      },
      order: [['id', 'ASC']], // Adjust the sorting as needed
    });
        res.status(200).json({allChats: chats});
    }catch(err){
        res.status(500).json({error:err});
    }
 };

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

 