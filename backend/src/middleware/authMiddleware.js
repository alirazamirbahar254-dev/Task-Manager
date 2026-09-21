
import jwt from "jsonwebtoken";
//reading th token for applay verification function 
const authMiddleware = (req, res, next) => {

const authHeader = req.headers.authorization;
console.log(authHeader)
//chacking token is in autheader 
if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
}
//only token without any spaces 
const token = authHeader.split(" ")[1];

//token verifying  is this valide token 
const secret = process.env.JWT_SECRET;
jwt.verify(token,secret, (error, decode) => {
    console.log(decode);
if(error){
    return res.status(401).json({error:'Invalid or expired token'})
}

req.loginuser = decode
next()
})
}

export default authMiddleware;





