const User = require('../models/User');
const Group=require('../models/group');
const jwt=require('jsonwebtoken');

exports.authenticate=  (req, res, next)=>{
         try{
            const token=req.header("Authorization");
            if (!token) {
      return res.status(401).json({ error: "token not provided", success: false });
    }
            const user=jwt.verify(token, process.env.SECRET_TOKEN);
            User.findByPk(user.userId).then(user=>{
                if (!user) {
          return res.status(404).json({ error: "user not found", success: false });
        }
                req.user=user;
                next();
            }).catch(err=>{throw new Error(err)})
         }catch(err){
            res.status(500).json({error:err, success:false});
          }
};
exports.authenticateGroupId=  (req, res, next)=>{
         try{
            const groupIdToken=req.header("Group-Authorization");
            if (!groupIdToken) {
      return res.status(401).json({ error: "Group token not provided", success: false });
    }
            const group=jwt.verify(groupIdToken, process.env.GROUPID_TOKEN);
            Groups.findByPk(group.id).then(group=>{
               if (!group) {
          return res.status(404).json({ error: "Group not found", success: false });
        }
                req.group=group;
                next();
            }).catch(err=>{throw new Error(err)})
         }catch(err){
            res.status(500).json({error:err, success:false});
          }
};