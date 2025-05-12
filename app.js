//importando modulos
const express = require('express');
const mysql = require('mysql2');
const { engine } = require('express-handlebars');
const app = express();
const session = require('express-session');
app.use(session({
    secret: 'segredo-super-seguro',
    resave: false,
    saveUninitialized: true
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));

app.use('/css', express.static('./css'));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'iarinhasz',
    password: 'sua_senha',
    database: 'booktrack'
});
//teste conectcao
conexao.connect(function(erro){
    if(erro) throw erro;
    console.log('conexao ok');
});

//renderizar
app.get('/', function(req, res){
    res.render('principal')
});


//rota principal
app.post('/principal', function(req, res){
    const cursor = req.body.cursor;

    if(cursor === "login"){
        res.redirect('/login');
    }
    else if(cursor === "cadastrar"){
        res.redirect('/cadastrar');
    }
    else if(cursor === "painelAdm"){
        res.redirect('/painelAdm');
    }
    else{
        res.send("invalido");
    }


});

//ROTA DO LOGIN
app.get('/login', function(req, res){
    res.render('loginUsuario');
});
app.post('/login', function(req, res){
    let email = req.body.email.trim();
    let senha = req.body.senha.trim();
    
    let sql = `SELECT id, email FROM usuario WHERE email = '${email}' AND senha = '${senha}'`;
    
    conexao.query(sql, function(erro, retorno){
        if(erro) throw erro;

        if(retorno.length > 0 ){
            req.session.usuarioId = retorno[0].id;
            console.log("sessao criada: ", req.session);
            res.redirect('/paginaInicial');
        }
        else{
            res.send("email ou senha incorretos");
        }
    });


});

//ROTA DO CADASTRO
app.get('/cadastrar', function(req, res){ //renderizar
    res.render('cadastroUsuario');
});
app.post('/cadastrar', function(req, res){
    let nome = req.body.nome;
    let id = req.body.id;
    let email = req.body.email;
    let senha = req.body.senha;

    //NOME >3 CARACTERES
    if(!nome || nome.length < 3){
        return res.send("O nome deve ter no minimo 3 caracteres");
    }
    //id eh o cpf
    const cpfValido = /^\d{11}$/;
    if(!id || !cpfValido.test(id)){
        return res.send("O cpf deve conter exatamente 11 digitos numericos");
    }
    //email valido
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailValido.test(email)) {
        return res.send("O e-mail não é válido.");
    }
    //senha >8 catarcete
    if(!senha || senha.length<8){
        return res.send("A senha deve ter no minimo 8 caracteres");
    }

    let sql =`INSERT INTO usuario (id, nome, email, senha)  VALUES ('${id}', '${nome}', '${email}', '${senha}')`;
    conexao.query(sql, function(erro, retorno){
        if(erro) throw erro;
        console.log(retorno);
        res.redirect('/');
    });
});

//ROTA PAGINA INICIAL
app.get('/paginaInicial', function(req, res){
    res.render('paginaInicial');
});
app.post('/paginaInicial', function(req, res){
    const cursor = req.body.cursor;
    //cadastrar livro
    if (cursor === "Cadastrar Livro"){
        res.redirect(`/livros/cadastrar`);
    }
    //consultar (listagem) livros
    else if (cursor === "Consultar Livros"){
        res.redirect('/livros/consultar');
    }
    else {
        res.send("Opção inválida");
    }

});

//rota cadastrar livro
app.get('/livros/cadastrar', function(req, res){
    const usuario_id = req.session.usuarioId;
    if (!usuario_id) {
        return res.send("Usuario nao autenticado");
    }
    res.render('cadastroLivros', { usuario_id });
});
app.post('/livros/cadastrar', function(req, res){
    const usuario_id = req.body.usuario_id;

    let titulo = req.body.titulo;
    let autor = req.body.autor;
    let status = req.body.status;
    let avaliacao = req.body.avaliacao;
    let data_conclusao = req.body.data_conclusao;

    if(!titulo || titulo.length < 3 || titulo > 100){
        return res.send("Entre 3 e 100 caracteres");
    }
    let sql;
    
    if(status === "Lido"){
        if(!data_conclusao) return res.send("Campo 'data de conclusao obrigatorio");
        sql = `INSERT INTO livro (titulo, autor, status, avaliacao, data_conclusao, usuario_id) VALUES  ('${titulo}', '${autor}', '${status}', '${avaliacao}', '${data_conclusao}', '${usuario_id}')`;
    }
    else{
        sql = `INSERT INTO livro (titulo, autor, status, usuario_id) VALUES  ('${titulo}', '${autor}', '${status}', '${usuario_id}')`;
    }

    conexao.query(sql, function(erro, retorno){
        if(erro) throw erro;
        res.redirect('/paginaInicial');
    });
});
//ROTA CONSULTAR LIVROS (LISTAGEM)
app.get('/livros/consultar', function(req, res){
    let sql = 'SELECT * FROM livro';
    conexao.query(sql, function(erro, retorno){
        if (erro) throw erro;
        res.render('consultarLivros', { livros: retorno });
    });
});
// ROTA CONSULTAR LIVROS COM CONSULTA
app.post('/livros/consultar', function(req, res){
    const status = req.body.status;
    
    let sql = `SELECT * FROM livro`;
    let aux = [];

    if(status && status !=='todos'){
        sql += ' WHERE status = ?';
        aux.push(status);
    }
    conexao.query(sql, aux,function(erro, retorno){
        if(erro) throw erro;
        res.render('consultarLivros', {livros: retorno});
    });

});


//serv
app.listen(8080);