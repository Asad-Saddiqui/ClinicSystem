var jwt = require("jsonwebtoken");
const key = "shhhhh";
const getuser = (req, res, next) => {
 
  // const token = req.header("auth_token");
  const token = req.header('auth_token');
  // console.log(token)
  if (!token) {
    res.json({status:'401', error:"Invalid User" });
  }

  try {
    const data =jwt.verify(token, key);
    // console.log('data',data)
    req.user = data;
    // console.log("---------Middleware-----------",req.user)
    next();
  } catch (error) {
    res.json({status:'401', error:"Invalid User" });

  }
};
module.exports = getuser;
