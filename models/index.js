const sequelize = require("../configs/db")


const taskModel = require("./task.model")
const Task = taskModel(sequelize)

const userModel = require("./user.model")
const User = userModel(sequelize)

const tokenModel = require("./token.model")
const Token = tokenModel(sequelize)


User.hasMany(Task, { 
    foreignKey: 'userId',
    onDelete: 'CASCADE' 
});

Task.belongsTo(User, { 
    foreignKey: 'userId',
    onDelete: 'CASCADE'  
});



sequelize.sync()
    .then(()=>{
        console.log("Synchronisation des modeles reussis")
    })
    .catch((error)=>{
        console.error("Impossible de créer les modeles")
        console.error(error)
    })


module.exports = {Task,User,Token}