import dotenv from "dotenv"
dotenv.config()

import express from "express"
import morgan from "morgan"
const app = express()
app.use(morgan("dev"))
const PORT = 3000

app.get("/",(req,res)=>{
    res.send("Serveur démarrer")
})

app.listen(PORT,()=>{
    console.log("Serveur démarrer")
})