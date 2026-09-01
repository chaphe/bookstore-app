CREATE DATABASE IF NOT EXISTS `catalog-library`;

USE `catalog-library`;
CREATE TABLE IF NOT EXISTS Book (
	titulo VARCHAR(60), 
	ISBN VARCHAR(60) PRIMARY KEY, 
	autor VARCHAR(60), 
	descripcion VARCHAR(250),
	valor VARCHAR(60),
  	unidades INT
);

INSERT INTO Book VALUES ('El milagro metabolico', '9789584276971', 'Carlos Jaramillo', 'En este libro, el célebre doctor Carlos Jaramillo ofrece respuestas contundentes a esas preguntas y plantea que la clave para un peso óptimo y una salud plena está en el metabolismo', '49', 10);
INSERT INTO Book VALUES ('A fuego lento', '9789584295446', 'Paula Hawkins', 'El descubrimiento del cuerpo de un joven asesinado brutalmente en una casa flotante de Londres desencadena sospechas sobre tres mujeres. ', '59', 20);
INSERT INTO Book VALUES ('Silence', '9789585191426', 'Flor M. Salvador', 'La confusión se ha disipado y ya no hay nada que perturbe la relación entre Patch y Nora', '55', 15);
INSERT INTO Book VALUES ('inquebrantables', '9789585190300', 'Daniel Habif', 'Proporciona inspiracion y motivacion para ayudar allector a superar obstaculos y crear la vida que desea vivir', '39', 18);
INSERT INTO Book VALUES ('La bailarina de Auschwitz', '9789585191066', 'Edith Egerr', 'inspiradora historia de supervivencia', '40', 15);
INSERT INTO Book VALUES ('Los fantasmas de canterville y otras historias', '9789585190366', 'Oscar wilde', 'Presenta 3 pequeñas historias que relatan la aventura de los protagonistas', '20', 15);
INSERT INTO Book VALUES ('Los cuatro acuerdos', '9789585190603', 'Don Miguel Ruiz', 'una guia practica para la libertad personal', '55', 15);
INSERT INTO Book VALUES ('El super zorro', '9789585190367', 'Roald dahl', 'novela para niños, que cuenta la aventura de un zorro y familia mientras son perseguidos por tres hermanos', '12', 14);
INSERT INTO Book VALUES ('El arte de la programacion: introduccion a la informática.', '10010090321', 'Leonel Parra', 'Introduccion a la informatica mediante la progamacion en C++', '15', 50);
INSERT INTO Book VALUES ('Cien años de soledad', '132414019321', 'Gabriel Garcia Márquez', 'El libro narra la historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo', '20', 5);
INSERT INTO Book VALUES ('Se tu propio jefe en 12 meses', '03213128888', 'Melinda Emerson', '¿Cuántas veces has soñado con abrir tu empresa y ser tu propio jefe? ', '5', 90);
INSERT INTO Book VALUES ('The Ultimate Beginners Guide to Learn Docker Step-By-Step', '0321299999', 'Mark Reed', 'Libro para aprender docker', '8', 12);
INSERT INTO Book VALUES ('Le Petit Prince', '123132131321', 'Antoine de Saint-Exupery', 'El principito es un cuento poético que viene acompañado de ilustraciones hechas con acuarelas por el mismo Saint-Exupéry.', '20', 50);

-- Store database for cart service
CREATE DATABASE IF NOT EXISTS `store`;

USE `store`;
CREATE TABLE IF NOT EXISTS cart (
    usuario VARCHAR(60),
    isbn VARCHAR(60),
    cantidad INT,
    PRIMARY KEY (usuario, isbn)
);

INSERT INTO cart (usuario, isbn, cantidad) VALUES
('usuario1', '9789584276971', 2),
('usuario1', '9789584295446', 1),
('usuario2', '9789585190603', 3);