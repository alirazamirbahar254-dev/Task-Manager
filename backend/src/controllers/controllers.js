import pool from "../db.js";
// Controller function to enter tasks in  the database
const createtask = async (req, res) => {

    const {title,description,columnid,completed} = req.body;

    try{ 
    const result = await pool.query(`INSERT INTO tasks (title,description,columnid,completed)
         VALUES ($1,$2,$3,$4) RETURNING*`,
         [title, description, columnid, completed]);
         res.status(201).json(result.rows[0])

      }catch (error) {
        console.error(error);
      res.status(400).json({error:"Failed to create tasks"})
}
}

// Controller function to retrieve alltasks from the database
const getAllTasks = async (req, res) => {
 
try{
    const result = await pool.query("SELECT * FROM  tasks");
    res.status(200).json(result.rows); 
}catch (error) {
    res.status(400).json({ error: "Failed to retrieve tasks" });
}
}

//Controller function to retrieve a task from the database
const getTask = async (req, res) => {
 
try{
    const result = await pool.query();
    res.status(200).json(result.rows); 
}catch (error) {
    res.status(400).json({ error: "Failed to retrieve tasks" });
}
}

//Controller function to update the tasks 
const updatetask = async (req, res) => {

try{ 
    
    const { title, description, columnid, completed, } = req.body;
    const { id } = req.params;

    const result = await pool.query(`UPDATE tasks SET title = $1, description = $2, columnid = $3, completed = $4 WHERE id = $5 RETURNING *`,[title,description,columnid,completed,id]); 
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

    const result = await pool.query(`DELETE FROM tasks WHERE id = $1 RETURNING *`, [id]);
//
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(result.rows);
}catch (error){
     res.status(400).json({error: "Failed to delete task"});
}
}

export { createtask, getAllTasks, getTask, updatetask, deletetask };

    
    
    