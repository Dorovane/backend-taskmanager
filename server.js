const  dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const morgan = require("morgan")
const userRoute = require("./routes/user.route")
const loginRoute = require("./routes/login.route")
const taskRoute = require("./routes/task.route")
const refreshTokenRoute = require("./routes/refreshToken.route")
const logoutRoute = require("./routes/logout.route")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const helmet = require ("helmet")
const rateLimit = require("express-rate-limit")
const app = express()



const globalLimiter = rateLimit({
    windowMs: 15 * 60 *1000,
    max:100
})

const limiter = rateLimit({
    windowMs: 1 * 60 *1000,
    max:5
})





app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials:true}))
app.use(helmet())

//require("./models/index")



const PORT = process.env.PORT || 3000


app.get("/api",(_,res)=>{
    res.send("Serveur démarrer")
})


app.use("/api",userRoute)
app.use("/api",taskRoute)
loginRoute(app)
refreshTokenRoute(app)
logoutRoute(app) 


app.use("/api",globalLimiter)
app.use("/api/login",limiter)
app.use("/api/refresh-token",limiter)


app.use((_,res)=>{
    res.status(404).json({message:"Ressources introuvables"})
})


app.listen(PORT,()=>{
    console.log("Serveur démarrer")
})