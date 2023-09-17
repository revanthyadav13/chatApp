const Sequelize = require('sequelize');
const Group= require('../models/group');
const User= require('../models/user');
const GroupMember= require('../models/groupMember');
const Chat= require('../models/chat');
const AWS= require('aws-sdk');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Set the destination directory for temporary file storage

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
exports.handleSocketConnection = (socket) => {
  socket.on('join_group', (groupId) => {
    socket.join(`group_${groupId}`);
  });
};

exports.postRequestSendMessage=async(req, res) => {
   try{
  const groupId= req.body.groupId;
  const text = req.body.text;
  const userId = req.user.id;
  const name=req.user.name; 
  
const message=await Chat.create({name:name, message:text, userId:userId, groupId:groupId});
req.app.locals.io.to(`group_${groupId}`).emit('new_message', message);
  res.status(200).json({ success: true, message: message });
  }catch(err){
    res.status(500).json({ error: 'An error occurred while fetching  group messages' });
  }
  
}

exports.getRequestGroupMembers = async (req, res) => {
  try {
    const groupId = req.params.groupId;
     const userId=req.user.id;
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
const loggedInUser= await User.findAll({where:{id:userId}})
    res.status(200).json({ members, loggedInUser});
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

const BUCKET_NAME = 'groupchat13';
const IAM_USER_KEY = process.env.IAM_USER_KEY;
const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

AWS.config.update({
  accessKeyId: IAM_USER_KEY,
  secretAccessKey: IAM_USER_SECRET,
});

const s3bucket = new AWS.S3();
exports.postRequestUpload= async (req, res) => {
  try {
    const { file } = req; // Accessing the uploaded file through req.file
    const filename = file.originalname;
    const fileData = require('fs').readFileSync(file.path);
  const groupId= req.body.groupId;
  const text = req.body.text;
  const userId = req.user.id;
  const name=req.user.name; 
    const params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: fileData,
      ACL: 'public-read',
    };

   s3bucket.upload(params,async (err, s3response) => {
      if (err) {
        console.log('Something went wrong', err);
        return res.status(500).json({ error: 'File upload failed' });
      } else {
        console.log('File uploaded successfully', s3response);
        const fileUrl = s3response.Location;
       return res.status(200).json({ success: true, fileUrl });
      }
    });

  } catch (error) {
    console.error('Error uploading file', error);
    return res.status(500).json({ error: 'File upload failed' });
  }
};

