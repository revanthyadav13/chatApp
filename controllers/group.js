const Sequelize = require('sequelize');
const Group= require('../models/group');
const User= require('../models/user');
const GroupMember= require('../models/groupMember');
const Chat= require('../models/chat');



exports.postRequestCreateGroup=async (req, res) => {
    try {
        const { groupname, userIds } = req.body;
        const admin =req.user.id;
        userIds.unshift(admin);
        const group=await Group.create({groupname:groupname,admin:admin});

        for (let i=0;i<userIds.length;i++) {
      await GroupMember.create({
        userId:userIds[i],
        groupId: group.id,
        isAdmin: userIds[i] === admin ? 1 : 0
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

exports.getRequestGroupMembers = async (req, res) => {
  try {
    const groupId = req.params.groupId;

    const groupMembers = await GroupMember.findAll({
      where: { groupId },
      include: [{ model: User }],
    });

    const members = groupMembers.map((groupMember) => {
      return {
        groupId: groupMember.groupId,
        id: groupMember.user.id,
        username: groupMember.user.name,
        isAdmin:groupMember.isAdmin
      };
    });

    res.status(200).json({ members });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
 const isAdmin = await GroupMember.findOne({
      where: {
        groupId,
        userId: req.user.id,
        isAdmin: true
      },
    });

    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins can remove members.' });
    }
    await GroupMember.destroy({where: {groupId, userId}});

    res.status(200).json({ message: 'Member removed successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while removing the member.' });
  }
};


exports.makeAdmin = async (req, res) => {
  try {
    const { groupId, userId } = req.params;

    const isAdmin = await GroupMember.findOne({
      where: {
        groupId,
        userId: req.user.id,
        isAdmin: true, 
      },
    });

    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins can make others admins.' });
    }

    await GroupMember.update(
      { isAdmin: true },
      {
        where: {
          groupId,
          userId,
        },
      }
    );

    res.status(200).json({ message: 'User is now an admin in the group.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while making the user an admin.' });
  }
};


exports.dismissAdmin = async (req, res) => {
  try {
    const { groupId, userId } = req.params;

    const isAdmin = await GroupMember.findOne({
      where: {
        groupId,
        userId: req.user.id,
        isAdmin: true
      },
    });

    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins can dismiss admins.' });
    }
    await GroupMember.update(
      { isAdmin: false },
      {
        where: {
          groupId,
          userId,
        },
      }
    );

    res.status(200).json({ message: 'User is no longer an admin in the group.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while dismissing the user from admin role.' });
  }
};

