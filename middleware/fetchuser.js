
const jwt = require('jsonwebtoken');
const JWT_SECRET= 'JaiIsAGoodBoy';

const fetchuser = (req,res,next) => {
try
{
    const token = req.header('auth-token');
    if(!token)
    {
        return res.status(401).json({error : "Please authenticate valid token"})
    }
    const data = jwt.verify(token,JWT_SECRET);
    req.user = data.user;
    console.log(req.user);
    next();
    }catch(error)
    {
        res.status(401).json({error : "Please authenticate valid token"})
    }
}

module.exports = fetchuser;
