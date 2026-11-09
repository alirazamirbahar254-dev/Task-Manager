import jwt from "jsonwebtoken";
import pool from "../db.js";
import multer from "multer";
const upload = multer({storage:multer.memoryStorage()})

//reading the token for applay verification function 
const authMiddleware = (req, res, next) => {

const authHeader = req.headers.authorization;
console.log(authHeader)
//chacking token is in autheader 
if (!authHeader) {
    return res.status(401).json({
    error: "Authorization header missing" });
}

//only token without any spaces 
const token = authHeader.split(" ")[1];
//token verifying is this valide token
const secret = process.env.JWT_SECRET;
jwt.verify(token, secret, async(error, decode) => {

    if(error){
    return res.status(401).json({
    error:'Invalid or expired token'})
}
try{ 
// fetching the user from database using the user_id from the token payload
const user = await pool.query(`select * from users where id = $1`, [decode.user_id]);
if(!user.rows.length) {
    return res.status(401).json({
    error: 'User not found'
    })
}

const token_number = user.rows[0].token_number;
if(token_number !== decode.token_number){
    return res.status(401).json({
    error: 'Token has been invalidated'
    })
}

req.loginuser = decode
next();
 } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: "Internal server error"
            });
        }
    });
};

export default authMiddleware;
export  {upload}



