const { Sequelize } = require("sequelize");

const DB_NAME = process.env.DB_NAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_USER = process.env.DB_USER
const DB_HOST = process.env.DB_HOST
const DB_DIALECT = process.env.DB_DIALECT


const sequelize = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    {host:DB_HOST,dialect:DB_DIALECT}
)

sequelize.authenticate()
    .then(()=>{
        console.log("Connexion a la base de donnée réussie ")
    })
    .catch((error)=>{
        console.error("Impossible de se connecter a la base de donnée")
        console.error(error)
    })

module.exports = sequelize