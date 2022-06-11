const db = require("./db/connection");
const { prompt } = require("inquirer");
const readline = require("readline");
const { get } = require("http");

const prompts = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function viewDepartments() {
  db.promise()
    .query("SELECT * FROM departments")
    .then(([rows, fields]) => {
      console.log(rows);
      init();
    });
}

function viewEmployees() {
  db.promise()
    .query("SELECT * FROM employees")
    .then(([rows, fields]) => {
      console.log(rows);
      init();
    });
}

function viewRoles() {
  db.promise()
    .query("SELECT * FROM roles")
    .then(([rows, fields]) => {
      console.log(rows);
      init();
    });
}

function addEmployee(firstName, lastName, roleId, managerId) {
  const employee = {
    first_name: firstName,
    last_name: lastName,
    role_id: roleId,
    manager_id: managerId,
  };

  db.promise()
    .query(`INSERT INTO employees SET ?`, employee)
    .then(console.log("Employee is added to the database."));
}

function addRole(title, salary, department) {
  const role = {
    title: title,
    salary: salary,
    department_id: department,
  };
  db.promise()
    .query(`INSERT INTO roles SET ?`, role)
    .then(console.log("Role is added to the database."));
}

function addDepartment(name) {
  const department = {
    name: name,
  };
  db.promise()
    .query(`INSERT INTO departments SET ?`, department)
    .then(console.log("Department is added to the database."));
}

function promptAddEmployee() {
  db.promise()
    .query("SELECT * from roles")
    .then(([rows, fields]) => {
      console.table(rows);
      prompt([
        {
          type: "input",
          name: "firstName",
          message: "Enter first name?",
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log("Please enter an Employee's First Name!");
              return false;
            }
          },
        },
        {
          type: "input",
          name: "lastName",
          message: "Enter last name?",
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log("Please enter an Employee's last Name!");
              return false;
            }
          },
        },
        {
          type: "input",
          name: "roleId",
          message: "Enter Role id?",
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log("Please enter an Role id!");
              return false;
            }
          },
        },
        {
          type: "input",
          name: "managerId",
          message: "Enter manager id?",
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log("Please enter an Role id!");
              return false;
            }
          },
        },
      ]).then((employeeInfo) => {
        addEmployee(
          employeeInfo.firstName,
          employeeInfo.lastName,
          employeeInfo.roleId,
          employeeInfo.managerId
        );
        init();
      });
    });
}
function addDepartment(name) {
  const department = {
    name: name,
  };
  db.promise()
    .query(`INSERT INTO departments SET ?`, department)
    .then(console.log("Department is added to the database."));
}

function updateEmployeeRole() {
  //get all the employee list
  db.query("SELECT * FROM employees", (err, emplRes) => {
    if (err) throw err;
    const employeeChoice = [];
    emplRes.forEach(({ first_name, last_name, id }) => {
      employeeChoice.push({
        name: first_name + " " + last_name,
        value: id,
      });
    });

    //get all the role list to make choice of employee's role
    db.query("SELECT * FROM roles", (err, rolRes) => {
      if (err) throw err;
      const roleChoice = [];
      rolRes.forEach(({ title, id }) => {
        roleChoice.push({
          name: title,
          value: id,
        });
      });

      let questions = [
        {
          type: "list",
          name: "id",
          choices: employeeChoice,
          message: "whose role do you want to update?",
        },
        {
          type: "list",
          name: "role_id",
          choices: roleChoice,
          message: "what is the employee's new role?",
        },
      ];

      prompt(questions)
        .then((response) => {
          const query = `UPDATE employees SET ? WHERE ?? = ?;`;
          db.query(
            query,
            [{ role_id: response.role_id }, "id", response.id],
            (err, res) => {
              if (err) throw err;

              console.log("successfully updated employee's role!");
              init();
            }
          );
        })
        .catch((err) => {
          console.error(err);
        });
    });
  });
}

function promptAddRole() {
  prompt([
    {
      type: "input",
      name: "title",
      message: "Enter your Job Title?",
      validate: (nameInput) => {
        if (nameInput) {
          return true;
        } else {
          console.log("Please enter your title!");
          return false;
        }
      },
    },
    {
      type: "input",
      name: "salary",
      message: "Enter your salary?",
      validate: (nameInput) => {
        if (nameInput) {
          return true;
        } else {
          console.log("Please enter your salary!");
          return false;
        }
      },
    },
    {
      type: "input",
      name: "department",
      message: "Enter your department ID",
      validate: (nameInput) => {
        if (nameInput) {
          return true;
        } else {
          console.log("Enter your department ID!");
          return false;
        }
      },
    },
  ]).then((roleInfo) => {
    addRole(roleInfo.title, roleInfo.salary, roleInfo.departmentId);
    init();
  });
}

function promptAddDepartment() {
  prompt([
    {
      type: "input",
      name: "name",
      message: "Enter your department name?",
      validate: (nameInput) => {
        if (nameInput) {
          return true;
        } else {
          console.log("Please enter your Department name!");
          return false;
        }
      },
    },
  ]).then((departmentInfo) => {
    addDepartment(departmentInfo.name);
    init();
  });
}

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
    if (task == "View all departments") {
      viewDepartments();
    } else if (task == "View all roles") {
      viewRoles();
    } else if (task == "View all employees") {
      viewEmployees();
    } else if (task == "Add a role") {
      promptAddRole();
    } else if (task == "Add a department") {
      promptAddDepartment();
    } else if (task == "Add an employee") {
      promptAddEmployee();
    } else {
      updateEmployeeRole();
    }
  });
}

init();
