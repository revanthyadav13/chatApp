const UserDetails = require('../models/userDetails');
const jwt=require('jsonwebtoken');

exports.authenticate=  (req, res, next)=>{
         try{
            const token=req.header("Authorization");
            const user=jwt.verify(token, process.env.SECRET_TOKEN);
            UserDetails.findByPk(user.userId).then(user=>{
                req.user=user;
                next();
            }).catch(err=>{throw new Error(err)})
         }catch(err){
            res.status(500).json({error:err, success:false});
          }
};
