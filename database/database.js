const Sequelize = require("sequelize");
const connection = new Sequelize('guiaperguntas','root','Nay@1404',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;