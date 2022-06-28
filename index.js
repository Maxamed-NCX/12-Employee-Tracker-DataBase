const db = require("./db/connection");
const { prompt } = require("inquirer");
const readline = require("readline");
const { get } = require("http");

const prompts = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//VIEW OPTIONS
// View Departments
function viewDepartments() {
  db.promise()
    .query("SELECT * FROM departments")
    .then(([rows, fields]) => {
      console.table(rows);
      init();
    });
}

//Update Manager Role
function viewByManager() {
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
    let questions = [
      {
        type: "list",
        name: "id",
        choices: employeeChoice,
        message: "which manager would you like to view?",
      },
    ];

    prompt(questions)
      .then((response) => {
        const query = `select * from employees WHERE manager_id = ?;`;
        db.query(query, response.id, (err, res) => {
          if (err) throw err;
          console.table(res);
          init();
        });
      })
      .catch((err) => {
        console.error(err);
      });
  });
}

function viewByDepartments() {
  //get all the employee list
  db.query("SELECT * FROM departments", (err, deptRes) => {
    if (err) throw err;
    const deptChoice = [];
    deptRes.forEach(({ id, name }) => {
      deptChoice.push({
        name: name,
        value: id,
      });
    });
    let questions = [
      {
        type: "list",
        name: "id",
        choices: deptChoice,
        message: "which department would you like to view?",
      },
    ];

    prompt(questions)
      .then((response) => {
        const query = `select * from employees WHERE role_id = ?;`;
        db.query(query, response.id, (err, res) => {
          if (err) throw err;
          console.table(res);
          ``;
          init();
        });
      })
      .catch((err) => {
        console.error(err);
      });
  });
}

// View Employees
// function viewBudget() {
//   db.promise()
//     .query(
//       "SELECT first_name, last_name,  title, salary  FROM roles INNER JOIN employees WHERE roles.id=employees.role_id "
//     )
//     .then(([rows, fields]) => {
//       console.table(rows);
//       init();
//     });
// }

function viewRoles() {
  db.promise()
    .query("SELECT * FROM roles")
    .then(([rows, fields]) => {
      console.table(rows);
      init();
    });
}

function viewBudget() {
  //get all the employee list
  db.query("SELECT * FROM departments", (err, deptRes) => {
    if (err) throw err;
    const budgetChoice = [];
    deptRes.forEach(({ id, name }) => {
      budgetChoice.push({
        name: name,
        value: id,
      });
    });
    let questions = [
      {
        type: "list",
        name: "id",
        choices: budgetChoice,
        message: "which department budget would you like to view?",
      },
    ];

    prompt(questions)
      .then((response) => {
        const query = `SELECT * FROM employees_db.employees e INNER JOIN (select  * from roles WHERE department_id = ?) r where e.role_id = r.id; `;
        db.query(query, response.id, (err, res) => {
          if (err) throw err;
          console.table(res);
          console.log(
            `Budget:`,
            res.reduce((acc, { salary }) => acc + parseInt(salary) || 0, 0)
          );
          init();
        });
      })
      .catch((err) => {
        console.error(err);
      });
  });
}

// View Employees
function viewEmployees() {
  db.promise()
    .query("SELECT * FROM employees")
    .then(([rows, fields]) => {
      console.table(rows);
      init();
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
// Add Roles
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
// Add Employees
function addEmployee(firstName, lastName, roleId, managerId, department) {
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

//DELETE OPTIONS
// Delete Employees
function deleteEmployee(employeeId) {
  db.promise()
    .query(`DELETE FROM employees WHERE id = ${employeeId}`)
    .then(console.log("Employee is deleted from the database."));
}
// Delete Roles
function deleteRole(roleId) {
  db.promise()
    .query(`DELETE FROM roles WHERE id = ${roleId}`)
    .then(console.log("Role is deleted from the database."));
}

// Delete Departments
function deleteDepartment(department) {
  db.promise()
    .query(`DELETE FROM departments WHERE id = ${department}`)
    .then(console.log("Department is deleted from the database."));
}

//ADD PROMPTS
// Prompt Add Deparment
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

// Prompt Add Role
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
    addRole(roleInfo.title, roleInfo.salary, roleInfo.department);
    init();
  });
}

// Prompt Add Employees
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

//DELETE Prompts
// Prompt Delete Employees
function promptDeleteEmployee() {
  db.promise()
    .query("SELECT * from employees")
    .then(([rows, fields]) => {
      console.table(rows);
      prompt([
        {
          type: "input",
          name: "employeeId",
          message: "Enter employee's ID?",
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log("Please enter an Employee's ID!");
              return false;
            }
          },
        },
      ]).then((employeeInfo) => {
        deleteEmployee(employeeInfo.employeeId);
        init();
      });
    });
}

//Prompt Delete Role
function promptDeleteRole() {
  db.promise()
    .query("SELECT * from roles")
    .then(([rows, fields]) => {
      console.table(rows);
      prompt([
        {
          type: "input",
          name: "roleId",
          message: "Enter Role ID?",
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log("Please enter an Role ID!");
              return false;
            }
          },
        },
      ]).then((roleInfo) => {
        deleteRole(roleInfo.roleId);
        init();
      });
    });
}

// Prompt Delete Department
function promptDeleteDepartment() {
  db.promise()
    .query("SELECT * from departments")
    .then(([rows, fields]) => {
      console.table(rows);
      prompt([
        {
          type: "input",
          name: "department",
          message: "Enter Department ID?",
          validate: (idInput) => {
            if (idInput) {
              return true;
            } else {
              console.log("Please enter an Department ID!");
              return false;
            }
          },
        },
      ]).then((departmentInfo) => {
        deleteDepartment(departmentInfo.department);
        init();
      });
    });
}

// UPDATE OPTIONS
//Update Employee Role
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

function updateManagerRole() {
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
          message: "what is the Managers's new role?",
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

function init() {
  prompt([
    {
      type: "list",
      name: "task",
      message: "What would you like to do?",
      choices: [
        "View all Departments",
        "View all Roles",
        "View all Employees",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Delete an Employee",
        "Delete an Role",
        "Delete an Department",
        "Update an Employee role",
        "Update an Manager role",
        "View by Departments",
        "View by Manager",
        "View by viewBudget",
      ],
    },
  ]).then(({ task }) => {
    if (task == "View all Departments") {
      viewDepartments();
    } else if (task == "View by Departments") {
      viewByDepartments();
    } else if (task == "View all Roles") {
      viewRoles();
    } else if (task == "View by Manager") {
      viewByManager();
    } else if (task == "View all Employees") {
      viewEmployees();
    } else if (task == "Add a Department") {
      promptAddDepartment();
    } else if (task == "Add a Role") {
      promptAddRole();
    } else if (task == "Add an Employee") {
      promptAddEmployee();
    } else if (task == "Delete an Employee") {
      promptDeleteEmployee();
    } else if (task == "Delete an Role") {
      promptDeleteRole();
    } else if (task == "Delete an Department") {
      promptDeleteDepartment();
    } else if (task == "Update an Employee role") {
      updateEmployeeRole();
    } else if (task == "Update an Manager role") {
      updateManagerRole();
    } else {
      viewBudget();
    }
  });
}

init();
