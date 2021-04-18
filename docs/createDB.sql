DROP DATABASE fyfappdb;
CREATE DATABASE fyfappdb;
Use fyfappdb;
CREATE TABLE usuario (
id INT PRIMARY KEY AUTO_INCREMENT,
secreto  VARCHAR(10) NOT NULL
);
CREATE TABLE accesos (
id INT PRIMARY KEY AUTO_INCREMENT,
idUsuario int not null,
tipoAcceso int not null,
foreign key(idUsuario) references usuario(id)
);
CREATE TABLE acceso_Nativo (
id INT PRIMARY KEY AUTO_INCREMENT,
email varchar(100) NOT NULL,
pass varchar(100) NOT NULL,
idAcceso int not null,
foreign key(idAcceso) references accesos(id));
CREATE TABLE acceso_Gmail (
id INT PRIMARY KEY AUTO_INCREMENT,
gmail varchar(100) not null,
idAcceso int not null,
foreign key(idAcceso) references accesos(id)
);
CREATE TABLE favoritos(
id INT PRIMARY KEY AUTO_INCREMENT,
favorito  varchar(100),
idUsuario int not null,
foreign key(idUsuario) references usuario(id)
);
CREATE TABLE profile(
id int primary key auto_increment,
nombre varchar(15),
apellidos varchar(50),
foto varchar(200),
idUsuario INT NOT NULL UNIQUE,
foreign key(idUsuario) references usuario(id)
);