const Chat=require('../models/chat');
const UserDetails=require('../models/userDetails');

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
        const userId=req.user.id
         const chats = await Chat.findAll();
         const username = await UserDetails.findAll({where:{id:userId}});

    res.status(200).json({allChats: chats, username:username});
    }catch(err){
        res.status(500).json({error:err});
    }
 };

 exports.getRequestFetchUserName=async(req, res)=>{
    try{
 const username = await UserDetails.findAll({where:{userStatus:true}});

    res.status(200).json({username: username});
    }catch(err){
        res.status(500).json({error:err});
    }
 }

 exports.getRequestLogOut=async(req, res)=>{
     try{
        const userId=req.user.id;
        const status = await UserDetails.update({ userStatus: false}, {
  where: {
    id: userId
  }
});

    res.status(200).json({logout: status});
    }catch(err){
        res.status(500).json({error:err});
    }
 }

 