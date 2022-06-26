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
    ('Sales Manager', 80000, 5),
    ('Engineer', 75000, 6),
    ('Floor Manager', 60000, 7),
    ('Mail Room', 40000, 8),
    ('Human Resources', 75000, 9),
    ('Information Technology', 900000, 10);

INSERT INTO
    employees (
        first_name,
        last_name,
        manager_id,
        role_id,
    )
VALUES
    ('James', 'Doe', 47, 16),
    ('Jann', 'Doe', 47, 17),
    ('Joe', 'Doe', 47, 18);