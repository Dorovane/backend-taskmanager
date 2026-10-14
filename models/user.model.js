const { DataTypes } = require("sequelize")

module.exports = (sequelize)=>{
   return sequelize.define("users",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        pseudo:{
            type:DataTypes.STRING,
            allowNull:{msg:"Le pseudo ne peut etre null"},
            validate:{
                notEmpty:{msg:"Le pseudo ne peut etre vide"},
                len:{
                    args:[3,10],
                    msg:"Le pseudo doit etre compris entre 3 et 10 caracteres"
                },
                isAlphanumeric:{msg:"Le pseudo n'est pas correct"},
            }
        },
        email:{
            type:DataTypes.STRING,
            allowNull:{msg:"L'email est obligatoire"},
            unique:{msg:"Cet email existe deja"},
            validate:{
                notEmpty:{msg:"L'email ne peut etre vide"},
                isEmail:{msg:"L'email n'est pas correct"}
            }
        },
        isAdmin:{
            type:DataTypes.BOOLEAN,
            allowNull:{msg:"Le champs d'admin est obligatoire"},
            defaultValue:false,
            validate:{
                notEmpty:{msg:"Le champs admin est obligatoire"}
            }
        },
        password:{
            type:DataTypes.STRING,
            allowNull:{msg:"Le mot de passe est obligatoire"},
            validate:{
                notEmpty:{msg:"Le mot de pass ne peut etre vide"}
            }
        }
    })
}