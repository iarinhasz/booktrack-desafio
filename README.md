# 📚 BookTrack

**BookTrack** é uma aplicação web para gerenciamento de livros lidos, em leitura ou desejados, permitindo que o usuário acompanhe seu progresso literário. Desenvolvida com Node.js, Express e Handlebars.

---

## 🔧 Tecnologias Utilizadas

- Node.js + Express
- MySQL (ou MariaDB)
- Express-session (sessões de usuário)
- Handlebars (templates HTML)
> *Bootstrap incluído mas não utilizado no layout*

---

## 🚀 Funcionalidades

### 🔐 Menu Principal

- Login de usuário
- Cadastro de novo usuário

### 🏠 Página Inicial (pós-login)

- Exibição de dados do usuário (ID {CPF}, Nome, Email)
- Exclusão da conta
- Cadastro de livros
- Consulta de livros
- Edição de livros
- Exclusão de livros

---

## 📋 Regras de Negócio

- Cada livro pertence a **um único usuário**.
- **Apenas livros do usuário logado** são exibidos/gerenciados.
- Os campos `avaliacao` e `data_conclusao` **só são solicitados se o status do livro for `lido`**.

---

## 🗂️ Organização do Projeto
📁 BookTrack/

├── app.js # Arquivo principal com rotas e lógica da aplicação

├── database.sql

├── package.json

├── package-lock.json

├── /views # Templates Handlebars

│ ├── principal.handlebars

│ ├── paginaInicial.handlebars

│ ├── loginUsuario.handlebars

│ ├── cadastroUsuario.handlebars

│ ├── excluirUsuario.handlebars

│ ├── listarUsuario.handlebars

│ ├── cadastroLivros.handlebars

│ ├── consultarLivros.handlebars

│ ├── editarLivros.handlebars

│ └── excluirLivros.handlebars

├── /css #sem uso

├── /node_modules


> Neste projeto, toda a lógica está concentrada em `app.js` (não há divisão explícita em controllers/services).

---

## 🌐 Interações com o Sistema

Todas as interações com o sistema são feitas **via navegador**, utilizando formulários renderizados por templates Handlebars.
O sistema **não utiliza uma API pública nem suporte a ferramentas como Postman**, pois depende de sessões com cookies e redirecionamentos de rota.

---

### 🔐 Login de Usuário
[http://localhost:8080/login](http://localhost:8080/login)

---

### 🧑 Cadastro de Usuário
[http://localhost:8080/cadastroUsuario](http://localhost:8080/cadastroUsuario)

---

### 📘 Cadastro de Livro
Acesse após login:
[http://localhost:8080/livros/cadastrar](http://localhost:8080/livros/cadastrar)

---

### 🔍 Consulta de Livros
Acesse após login:
[http://localhost:8080/livros/consultar](http://localhost:8080/livros/consultar)

---

### 📝 Edição de Livro
Acesse após login:
[http://localhost:8080/livros/editar/:id](http://localhost:8080/livros/editar/:id)

---

### ❌ Exclusão de Livro
Acesse após login:
[http://localhost:8080/livros/excluir/:id](http://localhost:8080/livros/excluir/:id)

---

## 🛠️ Como Rodar o Projeto Localmente

1. Clone o repositório:
   + git clone https://github.com/iarinhasz/booktrack.git
   + cd booktrack
   
2. Instale as  dependências
   `npm install`

3. Configure o acesso ao banco no arquivo `app.js`

   const conexao = mysql.createConnection({
   host: 'localhost',
   user: 'seu_usuario',
   password: 'sua_senha',
   database: 'booktrack'
   });

5. Inicie o projeto:
    `node app.js`

6. Acesse o navegador:
    http://localhost:8080
