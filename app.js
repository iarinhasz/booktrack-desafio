//importando modulos
const express = require('express');
const mysql = require('mysql2');
const { engine } = require('express-handlebars');

const app = express();

app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));

app.use('/css', express.static('./css'));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

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

//serv
app.listen(8080);