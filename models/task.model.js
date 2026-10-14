const { DataTypes } = require("sequelize")

module.exports = (sequelize)=>{
   return sequelize.define("tasks",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        name:{
            type:DataTypes.STRING,
            allowNull:{msg:"Le nom de la tâche ne peut etre null"},
            unique:{msg:"Cette tache existe deja"},
            validate:{
                notEmpty:{msg:"Le nom ne peut etre vide"},
                len:{
                    args:[4,10],
                    msg:"Le nom de la tache doit être compris entre 4 et 10 caracteres"
                },
                isAlpha:{msg:"Que des lettres pour le nom"}
            }
        },
        description:{
            type:DataTypes.STRING,
            allowNull:{msg:"La description ne peut être null"},
            validate:{
                notEmpty:{msg:"La dexcription est importante"},
            }
        },
        priority:{
            type:DataTypes.STRING,
            allowNull:{msg:"LA priorité ne peut etre null"},
            defaultValue:"Basse",
            validate:{
                notEmpty:{msg:"La priorité ne peut etre vide"},
                isIn:{
                    args:[["Basse","Moyenne","Haute"]],
                    msg:"La priorité doit etre Basse ,Moyenne ou Haute"
                }
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
}