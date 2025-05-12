CREATE TABLE usuario(
    id INT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email varchar(100) UNIQUE NOT NULL,
    senha VARCHAR(15) NOT NULL
);
CREATE TABLE livro (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(200) NOT NULL,
    autor VARCHAR(100),
    status ENUM('quero ler', 'lendo', 'lido') NOT NULL,
    avaliacao INT CHECK (avaliacao BETWEEN 1 AND 5),
    data_conclusao DATE,
    usuario_id INT NOT NULL,

    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);
CREATE TABLE adm(
    id INT PRIMARY KEY AUTO_INCREMENT,
    email varchar(100) UNIQUE NOT NULL,
    senha VARCHAR(15) NOT NULL
);