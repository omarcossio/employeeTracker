const inquirer = require("inquirer");
var mysql = require("mysql");
const path = require("path");
const fs = require("fs");
//const { start } = require("repl");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "",
    database: "employee_trackerDB"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});


function validateEmpty(name) {
    return name != "";
}

var existingEmployees = [];
var roles = [];
var departments = [];

// function which prompts the user for what action they should take
function start() {


    readEmployees();
    readDepartments(); readRoleTitles();
    inquirer
        .prompt([{
            name: "action",
            type: "list",
            message: "What would action would you like to perform?",
            choices: ["View ALL Employees", "View ALL Roles", "View ALL Departments", "Add Employee", "Add Role", "Add Department", "Update Employee Role", "Quit"],
        }, {
            name: "firstName",
            type: "input",
            message: "What is the employee's first name?",
            when: (answers) => answers.action == "Add Employee",
            validate: validateEmpty,
        },
        {
            name: "lastName",
            type: "input",
            message: "What is the employee's last name?",
            when: (answers) => answers.action == "Add Employee",
            validate: validateEmpty,
        },
        {
            name: "role",
            type: "list",
            message: "What is the employee's role?",
            choices: roles,
            when: (answers) => answers.action == "Add Employee",
            validate: validateEmpty,
        },
        {
            name: "manager",
            type: "list",
            message: "Who's the employee's manager?",
            when: (answers) => answers.action == "Add Employee",
            choices: existingEmployees,
        },
        {
            name: "newRole",
            type: "input",
            message: "What is the new role you'd like to add?",
            when: (answers) => answers.action == "Add Role",
            validate: validateEmpty,
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary for this role?",
            when: (answers) => answers.action == "Add Role",
            validate: validateEmpty,
        },
        {
            name: "department",
            type: "list",
            message: "What department does this role belong to?",
            when: (answers) => answers.action == "Add Role",
            choices: departments,
        },
        {
            name: "newDepartment",
            type: "input",
            message: "What is the name of the new department?",
            when: (answers) => answers.action == "Add Department",
            validate: validateEmpty,
        },
        {
            name: "updateEmployee",
            type: "list",
            message: "Which employee's role would you like to update?",
            when: (answers) => answers.action == "Update Employee Role",
            choices: existingEmployees,
        },
        {
            name: "updateRole",
            type: "list",
            message: "What is the updated role?",
            when: (answers) => answers.action == "Update Employee Role",
            choices: roles,
        },
        ]
        )
        .then(function (answer) {

            switch (answer.action) {
                case "View ALL Employees":
                    printAllEmployees();
                    setTimeout(start, 200);
                    break;
                case "View ALL Departments":
                    printAllDepartments();
                    setTimeout(start, 200);
                    break;
                case "View ALL Roles":
                    printAllRoles();
                    setTimeout(start, 200);
                    break;
                case "Add Employee":
                    //connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES('"+answer.firstName + "', '"+ answer.lastName + "', '" + answer.role + "', '" + answer.manager+"')");
                    //var query = "INSERT "

                    var roleName;
                    connection.query("SELECT * FROM role WHERE ?", { title: answer.role }, function (err, res) {
                        if (err) throw err;
                        roleName = res[0].id;
                        //console.log("*****The Id of the role you selcted is: ");
                        //console.log(roleName);

                    });
                    var managerFirst = answer.manager;
                    managerFirst = managerFirst.split(" ");
                    var managerId;
                    //connection.query("SELECT * FROM employee WHERE ? AND ?", { first_name: managerFirst[0], last_name: managerFirst[1]}, function(err, res) {

                    connection.query("SELECT * FROM employee WHERE ?", { first_name: managerFirst[0] }, function (err, res) {
                        if (err) throw err;
                        managerId = res[0].id;
                        console.log("*****The Id of the manager you selcted is: ");
                        console.log(managerId);

                    });


                    var e_sql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
                    var params = [answer.firstName, answer.lastName, roleName, managerId];

                    connection.query(e_sql, params, (err, results, fields) => {
                        if (err) {
                            return console.error(err.message);
                        }

                        console.log("Employee added: " + results);
                    });

                    readEmployees();
                    setTimeout(start, 200);
                    break;
                case "Add Role":

                    var deptId;
                    connection.query("SELECT * FROM department WHERE ?", { dept_name: answer.department }, function (err, res) {
                        if (err) throw err;
                        deptId = res[0].id;
                        console.log("*****The Id of the DEPT you selcted is: ");
                        console.log(deptId);

                    });
                    var e_sql = "INSERT INTO role (title, salary, department_id) VALUES (?,?,?)";
                    var params = [answer.newRole, answer.salary, deptId];

                    connection.query(e_sql, params, (err, results, fields) => {
                        if (err) {
                            return console.error(err.message);
                        }

                        console.log("Employee added: " + results);
                    });
                /*
                    "INSERT INTO role SET ?",
                    {
                        title: answer.newRole,
                        salary: answer.salary,
                        department_id: answer.department,
                    },
                        function (err) {
                            if (err) throw err;
                            console.log("Role Added Successfully!");
                        };
*/
                    readRoleTitles();
                    setTimeout(start, 200);
                    break;
                case "Add Department":
                    "INSERT INTO department SET ?",
                    {
                        dept_name: answer.newDepartment,
                    },
                        function (err) {
                            if (err) throw err;
                            console.log("Employee Added Successfully!");
                        };
                    readDepartments();
                    setTimeout(start, 200);
                    break;
                case "Update Employee Role":
                    "UPDATE employee SET ? WHERE ?",
                        [
                            {
                                role_id: '00',
                            }
                        ]
                    setTimeout(start, 200);
                    break;
                default: console.log("nothing to show");
            }




            if (answer.action == "Quit") {
                console.log("Goodbye!");
                connection.end();
                process.exit();
            };


        });
}

function printAllEmployees() {
    connection.query("SELECT employee.id, first_name,last_name,role.title,role.salary,department.dept_name FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.department_id=department.id", function (err, res) {
        if (err) throw err;
        //existingEmployees = res;

        // Log all results of the SELECT statement
        console.log("Table of employees:");
        console.table(res);
        //connection.end();
    });
}

function printAllDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        //departments = res;

        // Log all results of the SELECT statement
        console.log("Table of departments:");
        console.table(res);
        //connection.end();
    });
}

function printAllRoles() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;

        // Log all results of the SELECT statement
        console.log("Table of roles:");
        console.table(res);
        //connection.end();
    });
}

function readRoleTitles() {
    connection.query("SELECT title FROM role", function (err, res) {
        if (err) throw err;
        roles = [];

        var roleOptions = new Set();
        for (var i = 0; i < res.length; i++) {
            //line below returns title ONLY
            roleOptions.add(res[i].title);
            //roles.push(res[i].title);
        }
        roleOptions.forEach(function (item) {
            roles.push(item);
        })

        //console.log(roles);
    });
}

function readEmployees() {

    connection.query("SELECT first_name, last_name FROM employee", function (err, res) {
        if (err) throw err;
        existingEmployees = [];

        var managerOptions = new Set();
        for (var i = 0; i < res.length; i++) {
            //line below returns title ONLY
            var name = res[i].first_name + ' ' + res[i].last_name;
            managerOptions.add(name);
        }
        managerOptions.forEach(function (item) {
            existingEmployees.push(item);
        });

    });

}

function readDepartments() {
    connection.query("SELECT dept_name FROM department", function (err, res) {
        if (err) throw err;
        departments = [];

        var departmentOptions = new Set();
        for (var i = 0; i < res.length; i++) {
            //line below returns title ONLY
            departmentOptions.add(res[i].dept_name);
        }
        departmentOptions.forEach(function (item) {
            departments.push(item);
        });

    });

}

function addNewEmployee() {
    var sql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES('Avm', 'Laaa',2,1)";
}