const express = require("express")

const router = express.Router()

const {createTask,getTask,getTasks,deleteTask,updateTask,partialUpdateTask,getAllTasks} = require("../controllers/task.controller")
const auth = require("../middlewares/auth")

router.get("/tasks",auth,getAllTasks)
router.get("/tasks/:id",auth,getTasks)
router.get("/tasks/:userId/:taskId",auth,getTask)
router.post("/tasks",auth,createTask)
router.put("/tasks/:userId/:taskId",auth,updateTask)
router.patch("/tasks/:userId/:taskId",auth,partialUpdateTask)
router.delete("/tasks/:userId/:taskId",auth,deleteTask)


module.exports = router