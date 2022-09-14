CREATE DATABASE IF NOT EXISTS `store`;

USE `store`;

CREATE TABLE IF NOT EXISTS cart (
	id INTEGER NOT NULL AUTO_INCREMENT,
	usuario VARCHAR(60),
	isbn VARCHAR(60),
	cantidad INTEGER,
	PRIMARY KEY (id)
);


DELIMITER //
CREATE PROCEDURE GetCartUser(usuario VARCHAR(60))
BEGIN
	SELECT c.* FROM cart c WHERE c.usuario = usuario;
END //

CREATE PROCEDURE AddCartUser(usuario VARCHAR(60),isbn VARCHAR(60), unidades INTEGER)
BEGIN
	DECLARE cant INTEGER DEFAULT NULL;
	SELECT c.cantidad FROM cart c WHERE c.isbn = isbn AND c.usuario = usuario INTO cant;
	if ISNULL(cant) then 
		INSERT INTO cart (usuario,isbn,cantidad) VALUES (usuario, isbn, 1);
	ELSE
		UPDATE cart c SET cantidad=unidades WHERE c.isbn = isbn AND c.usuario = usuario;
	END if;	
END //

CREATE PROCEDURE DeleteCartUser(usuario VARCHAR(60),isbn VARCHAR(60))
BEGIN
	DELETE FROM cart c WHERE c.isbn = isbn AND c.usuario = usuario;
END //

CREATE PROCEDURE DeleteAllCartUser(usuario VARCHAR(60))
BEGIN
	DELETE FROM cart c WHERE c.usuario = usuario;
END //

DELIMITER ;

INSERT INTO cart (usuario,isbn,cantidad) VALUES ("student", "9789584276971", 5);
INSERT INTO cart (usuario,isbn,cantidad) VALUES ("juan", "9789584276971", 1);
INSERT INTO cart (usuario,isbn,cantidad) VALUES ("juan", "9789585190603", 1);