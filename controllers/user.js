const User=require('../models/user');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');

exports.postRequestSignup= async(req, res)=>{
try{
    const {name, email, phoneNumber, password}=req.body;

     const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser= await User.create({name:name, email:email, phoneNumber:phoneNumber, password:hashedPassword, userStatus:false});

   res.status(201).json({newUserDetail:newUser});
}catch(err){
   console.error('Error in signup:', err);
res.status(500).json({ message: 'Internal server error' });
}

};

function generateAccessToken(id, name, userStatus){
  return jwt.sign({userId:id, name :name, userStatus:userStatus}, process.env.SECRET_TOKEN)
}
exports.postRequestLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      res.status(404).json({ error: 'Error: Request failed with status code 404 (or) account not found.' });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
     const loginStatus= await User.update({userStatus:true}, {
  where: {
    email: email
  }
});
      res.status(200).json({ message: 'user logged in successfully',token:generateAccessToken(user.id, user.name, user.userStatus)});
    } else {
      res.status(401).json({ error: 'Incorrect password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
