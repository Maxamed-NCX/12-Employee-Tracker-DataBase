USE employees_db;

INSERT INTO
    departments (name)
VALUES
    ('sales'),
    ('engineering'),
    ('production');

INSERT INTO
    roles (title, salary, department_id)
VALUES
    ('Sales Manager', 80000, 1),
    ('Engineer', 75000, 2),
    ('Floor Manager', 60000, 3);

INSERT INTO
    employees (
        first_name,
        last_name,
        manager_id,
        role_id
    )
VALUES
    ('James', 'Doe', null, 1),
    ('Jann', 'Doe', 1, 2),
    ('Joe', 'Doe', 2, 3);