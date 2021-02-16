var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table")

var choices = [
"Add employee", 
"Add role", 
"Add department", 
"View employees", 
"View roles", 
"View departments", 
"Update employee roles"
];

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: process.env.PORT || 3306,

  // Your username
  user: "root",

  // Your password
  password: "Codysql3!3",
  database: "employee_trackerdb"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: choices
    })
    .then(function(answer) {
      switch (answer.action) {
      case choices[0]/*add employee*/:
        addEmployee();
        break;
      case choices[1]/*add role*/:
        addRole();
        break;
      case choices[2]/*add department*/:
        addDepartment();
        break;
      case choices[3]/*view employee*/:
        viewEmployees();
        break;
      case choices[4]/*view role*/:

        break;
      case choices[5]/*view department*/:

        break;
      case choices[6]/*update employee role*/:

        break;

      }
    });
}

function addEmployee()
{
  var roles = [];
  var roleTitles = [];
  connection.query("SELECT * FROM role", function(err, result, fields){
    if(err) throw err;
    roles = result;
    result.forEach(role => {
      roleTitles.push(role.title);
    });
  });
  // console.log(roles);
  inquirer
    .prompt(
      [
        {
          type: "input",
          message: "Employee's first name: ",
          name: "firstName",
          validate: validateStrings
        },
        {
          type: "input",
          message: "Employee's last name: ",
          name: "lastName",
          validate: validateStrings
        },
        {
          type: "list",
          message: "Employee's role: ",
          choices: roleTitles,
          name: "role"
        }
      ]
    )
    .then(function(answer) {
      var roleId = 0;
      roles.forEach(role => {
          if(answer.role == role.title)
          {
            roleId = role.id;
          }
      });
      connection.query("INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)", [answer.firstName, answer.lastName, roleId], function(err, result, fields){
        if(err) throw err;
        else{
          console.log("Success! Employee added");
        }
      });
    });
}
function addRole()
{
  // console.log("role");
  var departments = [];
  var departmentTitles = [];
  connection.query("SELECT * FROM department", function(err, result, fields){
    if(err) throw err;
    departments = result;
    result.forEach(department => {
      departmentTitles.push(department.name);
    });
  });
  inquirer
    .prompt([
      {
        type: "input",
        message: "Title of role: ",
        name: "title",
        validate: validateStrings
      },
      {
        type: "input",
        message: "Roles salary: ",
        name: "salary",
        validate: validateNum
      },
      {
        type: "list",
        message: "Department for role: ",
        name: "department",
        choices: departmentTitles
      }   
    ])
    .then(function(answer) {
        var departmentId = 0;
        departments.forEach(department => {
            if(answer.department == department.name)
            {
              departmentId = department.id;
            }
        });
        console.log(departmentId);
        connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.title, answer.salary, departmentId], function(err, result, fields){
          if(err) throw err;
          else{
            console.log("Success! Department added");
          }
        });
    // INSERT INTO role (title, salary, department_id) VALUES ("Salesperson", 56000, 1);
    });
}
function addDepartment()
{

  inquirer
    .prompt({
        type: "input",
        message: "Name of department: ",
        name: "name",
        validate: validateStrings
    })
    .then(function(answer) {
        connection.query("INSERT INTO department (department) VALUES (?)", [answer.name], function (err, result, fields){
            if(err) throw err;
            else{
                console.log("Success! Department added");
            }
        });
    });
}

function viewEmployees(){
    connection.query('SELECT employee.id, first_name, last_name, manager_id, title, salary, department FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id;', function(err, result, fields){
        console.table(result);
    });
}

function viewRoles(){

}

function viewDepartments(){

}

function validateStrings(input){
  var regex = /^[a-zA-Z ]{2,30}$/;
  return regex.test(input);
}

function validateNum(input){
  return !isNaN(input); //because isNaN returns false if the input is a number we want to return the opposite value so that inquirer receives the proper response for validation
}