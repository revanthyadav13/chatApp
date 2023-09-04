const Sequelize = require('sequelize');
const Group= require('../models/group');
const User= require('../models/user');
const GroupMember= require('../models/groupMember');
const Chat= require('../models/chat');



exports.postRequestCreateGroup=async (req, res) => {
    try {
        const { groupname, userIds } = req.body;
        const admin =req.user.id;
        const group=await Group.create({groupname:groupname,admin:admin});

        for (let i=0;i<userIds.length;i++) {
      await GroupMember.create({
        userId:userIds[i],
        groupId: group.id
      });
    }
        return res.status(201).json({ message: 'Group created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating  group' });
    }
}

exports.getRequestUserGroups=async(req, res)=>{
    try{
const userId = req.user.id;

    // Fetch user's groups using Sequelize associations
    const userGroups = await User.findByPk(userId, {
      include: {
        model: Group,
        through: GroupMember,
        attributes: ['id', 'groupname'],
      },
    });

    res.status(200).json({ groups: userGroups.groups });
    }catch(err){
        res.status(500).json({ error: 'An error occurred while fetching user groups' });
    }
}

exports.getRequestGroupMessages=async(req, res) => {
  try{
 const { lastMessageId } = req.query;
    const groupId = req.params.groupId;

    // Find messages that are greater than the provided lastMessageId
    const messages = await Chat.findAll({
      where: {
        groupId,
        id: {
          [Sequelize.Op.gt]: lastMessageId, // Use the greater than (>) operator
        },
      },
      order: [['id', 'ASC']],
    });

    res.json({ messages: messages });
  }catch(err){
    res.status(500).json({ error: 'An error occurred while fetching  group messages' });
  }
  
}

exports.postRequestSendMessage=async(req, res) => {
   try{
  const groupId= req.body.groupId;
  const text = req.body.text;
  const userId = req.user.id;
  const name=req.user.name; 
const message=await Chat.create({name:name, message:text, userId:userId, groupId:groupId});
  res.json({ success: true, message: message });
  }catch(err){
    res.status(500).json({ error: 'An error occurred while fetching  group messages' });
  }
  
}

