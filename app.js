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
    //editar livros
    else if(cursor === "Editar Livros"){
        res.redirect('/livros/editar');
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

//ROTA EDITAR LIVROS
app.get('/livros/editar', function(req, res){
    //entrar e aparecer apenas com status != lido
    const sql = "SELECT id, titulo FROM livro WHERE status != 'lido'";
    conexao.query(sql, function(erro, retorno){
        if (erro) throw erro;
        console.log("livros: ", retorno);
        res.render('editarLivros', { livros: retorno });
    });
});

app.post('/livros/editar', function(req, res){
    //quero ler > lendo || lendo > lido
    
    // const cursor = req.body.cursor;
    const id = req.body.id;
    const novoTitulo = req.body.novoTitulo;
    const novoAutor = req.body.novoAutor || null;
    const novoStatus = req.body.novoStatus;
    const avaliacao = req.body.avaliacao || null;
    const dataConclusao = req.body.dataConclusao;
    
    //let novoValor;

    let sql = `SELECT status FROM livro WHERE id = '${id}'`;
    
    //console.log("cursor", cursor);

    conexao.query(sql, function(erro, retorno){
        if (erro) throw erro;
        if (retorno.length === 0){
            res.send("Livro não encontrado");
            return;
        }

        const statusAtual = retorno[0].status.toLowerCase();

        if (statusAtual === "lido") {
            res.send("Livros concluídos não podem ser editados");
            return;
        }
        //tem q armazenar as modificacoes em um bloco, um por um n funciona
        let updates = [];

        if(novoTitulo) updates.push(`titulo = '${novoTitulo}'`);

        /*else if (novoTitulo) {
            let sqlAt = `UPDATE livro SET titulo = '${novoTitulo}' WHERE id = '${id}'`;
            conexao.query(sqlAt, function(erro){
                if (erro) throw erro;
                res.send("Título atualizado!");
                //res.redirect('/livros/editar');
            });
        }*/

        if(novoAutor) updates.push(`autor = '${novoAutor}'`);

        /*else if (novoAutor) {
            let sqlAt = `UPDATE livro SET autor = '${novoAutor}' WHERE id = '${id}'`;
            conexao.query(sqlAt, function(erro){
                if (erro) throw erro;
                res.send("Autor atualizado!");
            });
        }*/
        if(novoStatus && novoStatus !== statusAtual){
            if(statusAtual === "quero ler" && novoStatus === "lendo"){
                updates.push(`status = 'lendo'`);
            }
            else if(statusAtual === "lendo" && novoStatus === "lido"){
                updates.push(`status = 'lido'`);
                if(avaliacao) updates.push(`avaliacao = '${avaliacao}'`);
                if(dataConclusao) updates.push(`data_conclusao = '${dataConclusao}'`);
            }
            else{
                res.send(`Transição inválida de '${statusAtual}' para '${novoStatus}'.`);
                return;
            }
        }

/*        else if(novoStatus){
            
            if(novoStatus === statusAtual){
                res.send("O status selecioando é igual ao atual");
                res.redirect('/livros/editar');
            }

            if(statusAtual === "quero ler" && novoStatus === "lendo"){
                sql = `UPDATE livro SET status = '${novoStatus}' WHERE id = '${id}'`;
                conexao.query(sql, function(erro){
                    if(erro) throw erro;
                    res.send("status: quero ler > lendo atualizado");
                });
            }

            if(statusAtual === "lendo" && novoStatus === "lido"){
                let avaliacao = req.body.avaliacao || null;
                let dataConclusao = req.body.dataConclusao;
                
                sql = `UPDATE livro SET status = 'lido', avaliacao ='${avaliacao}', data_conclusao = '${dataConclusao}' WHERE id = '${id}'`;
                conexao.query(sql, function(erro){
                    if(erro) throw erro;
                    res.send("status: lendo > lido atualizado");
                });
            }

            res.send(`Transição inválida de '${statusAtual}' para '${novoValor}'.`);
            //res.redirect('/livros/editar');

        }*/
        if(updates.length === 0){
            res.send("nenhuma alteracao enviada");
            return;
        }

        /*if (cursor === "Voltar Pagina Inicial") {
            res.redirect('/paginaInicial');
        }*/

        const sqlAtualizacoes = `UPDATE livro SET ${updates.join(', ')} WHERE id = '${id}'`;
        conexao.query(sqlAtualizacoes, function(erro){
            if(erro) throw erro;
            res.redirect('/livros/editar');
        });
    });
});


//serv
app.listen(8080);