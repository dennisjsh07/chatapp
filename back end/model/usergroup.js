const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const Usergroup= sequelize.define('usergroup',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        unique:true,
        autoIncrement:true,
        primaryKey:true
    },
    groupname:Sequelize.STRING,
    name:Sequelize.STRING,
    isAdmine:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

module.exports = Usergroup;
 