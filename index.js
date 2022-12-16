const express = require("express"); //IMPORTA O EXPRESS
const app = express();  //USA O EXPRESS
const bodyParser = require("body-parser");//IMPORTA O BODYPARSER
const connection = require("./database/database");//IMPORTA A CONEXÃO MYSQL
const Pergunta = require("./database/Pergunta"); //IMPORTA A CRIAÇAO DA TABELA PERGUNTAS
const Resposta = require("./database/Resposta"); //IMPORTA A CRIAÇÂO DA TABELA RESPOSTAS

//DATABASE
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados")
    })
    .catch((msgErro) => {
    console.log(msgErro);
    })

//CARREGA O EJS
app.set('view engine','ejs'); 
app.use(express.static('public')); //CARREGA ARQUIVOS ESTATICOS DE FRONTEND

//TRADUZ FORMULARIO PARA JS
app.use(bodyParser.urlencoded({extended: false})); 
app.use(bodyParser.json());

//ROTAS
app.get("/",(req,res) =>{ 
    Pergunta.findAll({ raw: true, order:[
        ['id','DESC'] // ORDENA 'campo','DESC OU ASC'
    ] }).then(perguntas => { //EQUIVALENTE AO SELECT * FROM PERGUNTAS (raw: sem dados extras)
        res.render("index",{
            perguntas: perguntas
        });
    });  
});

app.get("/perguntar",(req,res) => {
    res.render("perguntar");
});


//SALVAR DADOS DA PERGUNTA
app.post("/salvarpergunta",(req,res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;   //RECEBE OS DADOS

    Pergunta.create({       //EQUIVALENTE A INSERT INTO 
        titulo: titulo,
        descricao: descricao
    }).then(() => {      //CASO OCORRA COM SUCESSO, USUARIO DIRECIONADO PARA HOME
        res.redirect("/");
    });   
});

app.get("/pergunta/:id",(req,res)=>{
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id},
    }).then(pergunta =>{
        if(pergunta != undefined){
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [['id', 'DESC']]
            }).then(respostas => {
                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas: respostas 
                 });
            });            
        }else{
            res.redirect("/");
        }
    })
});

app.post("/responder",(req,res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;   //RECEBE OS DADOS

    Resposta.create({       //EQUIVALENTE A INSERT INTO 
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {      //CASO OCORRA COM SUCESSO, USUARIO DIRECIONADO PARA HOME
        res.redirect("/pergunta/"+perguntaId);
    });   
});

//CRIAÇÃO DE SERVER
app.listen(8080,()=>{
    console.log("App rodando!");
});