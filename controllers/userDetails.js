const UserDetails=require('../models/userDetails');
const bcrypt = require('bcrypt');

exports.postRequestSignup= async(req, res)=>{

try{
    const {name, email, phoneNumber, password}=req.body;

     const existingUser = await UserDetails.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser= await UserDetails.create({name:name, email:email, phoneNumber:phoneNumber, password:phoneNumber});

   res.status(201).json({newUserDetail:newUser});
}catch(err){
   console.error('Error in signup:', err);
res.status(500).json({ message: 'Internal server error' });
}

};