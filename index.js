const db = require("./db/connection");
const { prompt } = require("inquirer");

init();

function init() {
  prompt([
    {
      type: "list",
      name: "task",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
      ],
    },
  ]).then(({ task }) => {
    task == "View all departments" ? viewDepartments() : "";
  });
}

function viewDepartments() {
  db.promise()
    .query("SELECT * FROM department")
    .then((data) => console.log(data));
}
