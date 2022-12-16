const Sequelize = require("sequelize");
const connection = require("./database");

const Pergunta = connection.define('perguntas',{  //CRIANDO TABELA
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Pergunta.sync({force: false}).then(() => {});//ENVIA TABELA PRO MYSQL, FORCE PARA NAO RECRIAR

module.exports = Pergunta;