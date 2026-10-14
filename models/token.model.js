const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    return sequelize.define("tokens",
        {
            id:{
                type:DataTypes.INTEGER,
                autoIncrement:true,
                primaryKey:true
            },
            token:{
                type:DataTypes.STRING,
                allowNull:false
            },
            expiresDate:{
                type:DataTypes.DATE,
                allowNull:false
            },
            userId:{
                type:DataTypes.INTEGER,
                allowNull:false
            }
        }
    )
}