var mysql = require("mysql");
var inquirer = require("inquirer");

var choices = [
"Add employee", 
"Add role", 
"Add department", 
"View employee", 
"View role", 
"View department", 
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
  console.log(roles);
  inquirer
    .prompt(
      [
        {
          type: "input",
          message: "Employee's first name: ",
          name: "firstName"
        },
        {
          type: "input",
          message: "Employee's last name: ",
          name: "lastName"
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
      // INSERT INTO employee (first_name, last_name, role_id) VALUES ("John", "Doe", 1);
    });
}
function addRole()
{
  // console.log("role");

  // inquirer
  //   .prompt({
  //   })
  //   .then(function(answer) {
    // INSERT INTO role (title, salary, department_id) VALUES ("Salesperson", 56000, 1);
  //   });
}
function addDepartment()
{
  // console.log("department");

  // inquirer
  //   .prompt({
  //   })
  //   .then(function(answer) {

    // INSERT INTO department (name) VALUES ("Sales");
  //   });
}