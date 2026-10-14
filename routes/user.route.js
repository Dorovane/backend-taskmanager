const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit")


const {createUser,getAllUsers,getUser,deleteUser,updateUser,partialUpdateUser} = require("../controllers/user.controller");
const auth = require("../middlewares/auth");

const limiter = rateLimit({
    windowMs: 1 * 60 *1000,
    max:5
})

router.get("/users",auth,getAllUsers)
router.get("/users/:id",auth,getUser)
router.post("/users", limiter,createUser); 
router.delete("/users/:id",auth,deleteUser)
router.put("/users/:id",auth,updateUser)
router.patch("/users/:id",auth,partialUpdateUser)

module.exports = router