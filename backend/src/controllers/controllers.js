import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

//regex functin useing for email validation
const emailregex = /^[a-z]+[0-9]+@[a-z]+\.[a-z]+$/;
if(!emailregex.test(email)){
return res.status(400).send('invalide email fromat')
}

//convert password in the hashing form 
const saltRounds = 10;

const hashedpassword = await bcrypt.hash(password, saltRounds);

console.log("🔒 Sign Up Successful! Hash saved in database:", hashedpassword);

try{
const register = await pool.query(`insert into users (name,email,password)
values($1,$2,$3) RETURNING*`, [name,email,hashedpassword])
res.status(201).json(register.rows[0]);

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

export { createtask, getAllTasks, getTask, updatetask, deletetask, registerusers,loginuser,refresh};



