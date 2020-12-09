DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;


CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    dept_name VARCHAR (30),
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL(10,2),
    department_id INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT(10),
    manager_id INT(10),
    PRIMARY KEY (id)
);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ('Omar', 'Cossio',1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES('Avm', 'Larsib',2,1),
('Bob', 'Smith',2,1);

INSERT INTO role (title, salary, department_id)
VALUES ('Engineer', 75000, 1),
('Sales Rep', 25000, 2);

INSERT INTO department (dept_name)
VALUES ('Management'),
('Sales Team');


/* 
INSERT INTO department (id, name) VALUES ();

INSERT INTO role (id, title, salary, department_id) VALUES ();

INSERT INTO department (id, first_name, last_name, role_id, manager_id) VALUES ();

print table on terminal***

*/
