import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { emailoptions } from "../../services/emailservices.js";

// Controller function to enter tasks in  the database
const createtask = async (req, res) => {

const {title,description,columnid,completed} = req.body;

try{ 
const result = await pool.query(`INSERT INTO tasks (title,description,columnid,completed,user_id)
VALUES ($1,$2,$3,$4,$5) RETURNING*`,
[title, description, columnid, completed,req.loginuser.user_id]);
res.status(201).json(result.rows[0])

}catch (error) {
console.error(error);
res.status(400).json({error:"Failed to create tasks"})
}
}

// Controller function to retrieve alltasks from the database
const getAllTasks = async (req, res) => {

try{
const result = await pool.query("SELECT * FROM  tasks where user_id = $1",[req.loginuser.user_id]);
res.status(200).json(result.rows); 
}catch (error) {
res.status(400).json({ error: "Failed to retrieve tasks" });
}
}

//Controller function to retrieve a task from the database
const getTask = async (req, res) => {

try{
const result = await pool.query("select*from tasks where id = $1 and user_id = $2", [req.params.id, req.loginuser.user_id]);
res.status(200).json(result.rows); 
}catch (error) {
res.status(400).json({ error: "Failed to retrieve tasks" });
}
}

//Controller function to update the tasks 
const updatetask = async (req, res) => {

try{ 

const { title, description, columnid, completed} = req.body;
const { id } = req.params;

const result = await pool.query(`UPDATE tasks 
SET title = $1, description = $2, columnid = $3, completed = $4 WHERE id = $5 AND user_id = $6  RETURNING*`,[title,description,columnid,completed,id, req.loginuser.user_id]); 
res.status(200).json(result.rows);
}catch (error) {
console.error(error);
res.status(400).json({error: "Failed to update task"});
}
}

//Controller function to delete the tasks 

const deletetask = async (req, res) => {
try{

const {id} = req.params;

const result = await pool.query(`DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *`, [id,req.loginuser.user_id]);
//
if (result.rows.length === 0) {
return res.status(404).json({ error: "Task not found" });
}

res.status(200).json(result.rows);
}catch (error){
res.status(400).json({error: "Failed to delete task"});
}
}

//controller fuction for register to users 
const registerusers = async (req, res) => {
const {name,email,password} = req.body;

//regex validation function for password useing lookahead rull(?=.* )  
const passwordregex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/;
if(!passwordregex.test(password)){
return res.status(400).send("🔐 Password must contain at least 8 characters, one letter, one number, and one special character.")
}
//regex validation function for email  
const emailregex =/^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
if(!emailregex.test(email)){
return res.status(400).send("Please enter a valid 📧 Email address")
}

//convert password in the hashing form 
const saltRounds = 10;

const hashedpassword = await bcrypt.hash(password, saltRounds);
try{
const register = await pool.query(`insert into users (name,email,password)
values($1,$2,$3) RETURNING id, name, email`,[name,email,hashedpassword])
res.status(201).send("Registration successful");

}catch(error){

if(error.code === "23505"){
res.status(409).json({message:"Email already exists"});
}

}
}

const loginuser = async (req, res) => {
const {name, email, password}  = req.body;
const login =  await pool.query(`select * from users where email = $1`, [email])
const {id:user_id , password:hashedpassword} = login.rows[0];
const compare = await bcrypt.compare(password,hashedpassword);
console.log(compare);

let token;
let refreshtoken;

if(compare){
    
const update = pool.query(`update users SET last_refresh = CURRENT_TIMESTAMP,session_start=CURRENT_TIMESTAMP where id =$1`,[user_id])
const payload = {user_id}
const secret = process.env.JWT_SECRET;
token = jwt.sign(payload, secret, {expiresIn : '1h'})   

// refresh for user to continue work 
const refresh = process.env.REFRESH_SECRET;
refreshtoken = jwt.sign(payload, refresh, {expiresIn : '10d'})
}else {
    console.log("password incorrect")
    return res.status(401).json({
  message: "Incorrect email or password"
});
}

// Store refresh token securely in an HttpOnly cookie
res.cookie("refreshtoken", refreshtoken, {httpOnly : true, sameSite: "lax"
})
console.log("Refresh cookie set");
res.status(200).json({token})
}

const refresh = async (req, res) => {
const {refreshtoken} = req.cookies;
console.log(req.cookies);
const refreshSecret = process.env.REFRESH_SECRET;
const accessSecret = process.env.JWT_SECRET;

jwt.verify(refreshtoken, refreshSecret, async (error, decode) =>{
if(error){
    return res.status(401).json({error:"invalide token"})
}

//rolling refresh
const payload = { user_id: decode.user_id };
const rolling = await pool.query(`select last_refresh,session_start from users where id = $1`,[decode.user_id])
// DB se user ka last refresh time nikal rahe hain
const lastrefresh = rolling.rows[0].last_refresh
const session_start = rolling.rows[0].session_start
// Abhi ke time aur last refresh ke time ka difference nikal rahe hain
const difference = Date.now() - new Date(lastrefresh).getTime()

const sessiondifference = Date.now() - new Date(session_start).getTime()

const thirtydays = 30 * 24 * 60 * 60 * 1000
const tendays = 10 * 24 * 60 * 60 * 1000

console.log("LAST REFRESH:", lastrefresh)
console.log("DIFFERENCE:", difference)
console.log("SESSION DIFFERENCE:", sessiondifference)

if(sessiondifference > thirtydays){
    return res.status(401).json({
        message:"Session expired, please login again"
    })
}

if(difference > tendays){
    return res.status(401).json({
        message:"Session expired, please login again"
    })
}

const token = jwt.sign(payload, accessSecret, {expiresIn : '1h'})
const refreshtoken = jwt.sign(payload,refreshSecret, {expiresIn: "10d"} )
console.log("NEW REFRESH TOKEN:", refreshtoken);

res.cookie("refreshtoken", refreshtoken, {httpOnly:true, sameSite: "lax" })
const succses = await pool.query(`update users SET last_refresh = CURRENT_TIMESTAMP  where id =$1`,[decode.user_id])
console.log("NEW REFRESH COOKIE SET");
res.status(200).json({token})

})

}

//making a user logout api 
const logout = async(req, res) => {
res.clearCookie("refreshtoken")
res.status(200).json({message:"Logout successful"})
}


//making a controller function for forgotpassword 
const forgotpassword = async(req, res)=>{
 const {email} = req.body
 const forgotpassword = await  pool.query(`select * from users where email = $1`,[email])
 const user = forgotpassword.rows[0]
 if(user === undefined){
    return res.status(404).send({
    message:"user is undefined"
    })
 }

const user_id = user.id;
const payload = {user_id}
const secret = process.env.JWT_FORGOT_SECRET;
const forgottoken = jwt.sign(payload, secret,{expiresIn : "25m"})
const updateresettoken = await pool.query(`update users set reset_token = $1 where id = $2`,[forgottoken, user_id])
const twentyminuts = 25 * 60 * 1000 
const expirytime = new Date(Date.now() + twentyminuts)
const expirytimedb = await pool.query(`update users set reset_token_expiry = $1 where id = $2`, [expirytime, user_id])
await emailoptions(
  process.env.GMAIL_USER,
  user.email,
  "Reset Your Password",
  `Reset your password here: http://127.0.0.1:5500/frontend/reset-password/reset-password.html?token=${forgottoken}`
);
return res.status(200).json({
  message: "Reset link sent to your email."
});
 }

 // making a controller function for resetpassword
const resetpassword = async (req, res) => {
  const { newpassword, confirmpassword, token } = req.body;
  const secret = process.env.JWT_FORGOT_SECRET;

  try {
    // checking that required values are provided
    if (!token || !newpassword || !confirmpassword) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // checking that both passwords match
    if (newpassword !== confirmpassword) {
      return res.status(400).json({
        message: "Passwords do not match"
      });
    }

    // verifying the reset token
    const decode = jwt.verify(token, secret);
    const user_id = decode.user_id;

    // getting the saved token and expiry from the database
    const db = await pool.query(
      `SELECT reset_token, reset_token_expiry
       FROM users
       WHERE id = $1`,
      [user_id]
    );

    const dbresult = db.rows[0];

    // checking that the saved token exists and matches
    if (
      !dbresult ||
      !dbresult.reset_token ||
      dbresult.reset_token !== token ||
      !dbresult.reset_token_expiry
    ) {
      return res.status(401).json({
        error: "Invalid or expired reset token"
      });
    }

    // checking whether the reset token has expired
    if (
      Date.now() >= new Date(dbresult.reset_token_expiry).getTime()
    ) {
      return res.status(401).json({
        error: "Invalid or expired reset token"
      });
    }

    // hashing the new password
    const saltRounds = 10;
    const hashedpassword = await bcrypt.hash(newpassword, saltRounds);

    // updating the password and clearing the reset token
    await pool.query(
      `UPDATE users
       SET password = $1,
           reset_token = NULL,
           reset_token_expiry = NULL
       WHERE id = $2`,
      [hashedpassword, user_id]
    );

    // sending the success response
    return res.status(200).json({
      message: "Password reset successful"
    });

  } catch (error) {
    // handling invalid or expired JWT tokens
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        error: "Invalid or expired reset token"
      });
    }

    // handling unexpected errors
    console.error("Reset password error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export { 

    createtask, 
    getAllTasks, 
    getTask, 
    updatetask, 
    deletetask, 
    registerusers,
    loginuser,
    refresh,
    logout,
    forgotpassword,
    resetpassword,

};



