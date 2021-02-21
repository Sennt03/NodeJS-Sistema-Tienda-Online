CREATE DATABASE senntshop;

use senntshop;

CREATE TABLE users(
    id int(15) AUTO_INCREMENT not null,
    name VARCHAR(100) not null,
    lastname VARCHAR(100) not null,
    email VARCHAR(100) not null,
    password VARCHAR(255) not null,
    rol VARCHAR(100) not null,
    CONSTRAINT pk_users PRIMARY KEY(id),
    CONSTRAINT uq_email UNIQUE(email)
)Engine=InnoDb;

CREATE TABLE categorias(
    id int(15) AUTO_INCREMENT not null,
    name VARCHAR(100) not null,
    CONSTRAINT pk_categorias PRIMARY KEY(id)
)Engine=InnoDb;

CREATE TABLE productos(
    id int(15) AUTO_INCREMENT not null,
    categoria_id int(15) not null,
    name VARCHAR(255) not null,
    descripcion TEXT,
    precio FLOAT(100,2) not null,
    stock int(100) not null,
    imagen VARCHAR(255) not null,
    CONSTRAINT pk_productos PRIMARY KEY(id),
    CONSTRAINT fk_productos_categorias FOREIGN KEY(categoria_id) REFERENCES categorias(id)
)Engine=InnoDb;

CREATE TABLE pedidos(
    id int(15) AUTO_INCREMENT not null,
    user_id int(15) not null,
    cantidad_productos int(100) not null,
    costo FLOAT(100,2) not null,
    provincia VARCHAR(255) not null,
    ciudad VARCHAR(255) not null,
    direccion VARCHAR(255) not null,
    fecha date not null,
    estado VARCHAR(255) not null,
    CONSTRAINT pk_pedidos PRIMARY KEY(id),
    CONSTRAINT fk_pedidos_users FOREIGN KEY(user_id) REFERENCES users(id)
)Engine=InnoDb;

CREATE TABLE linea_pedidos(
    id int(15) AUTO_INCREMENT not null,
    pedido_id int(15) not null,
    producto_id int(15) not null,
    cantidad int(100) not null,
    costo FLOAT(100,2) not null,
    CONSTRAINT pk_linea_pedidos PRIMARY KEY(id),
    CONSTRAINT fk_linea_pedidos FOREIGN KEY(pedido_id) REFERENCES pedidos(id),
    CONSTRAINT fk_linea_productos FOREIGN KEY(producto_id) REFERENCES productos(id)
)Engine=InnoDb;