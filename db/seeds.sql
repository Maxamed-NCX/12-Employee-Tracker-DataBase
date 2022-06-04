INSERT INTO
    department (name)
VALUES
    ('sales'),
    ('engineering'),
    ('production');

INSERT INTO
    role (title, salary, department_id)
VALUES
    ('sales Manager', 80000, 1),
    ('engineer', 75000, 2),
    ('Floor Manager', 60000, 3);

INSERT INTO
    employee (first_name, last_name, manager_id, role_id)
VALUES
    ('John', 'Doe', NULL, 1),
    ('Jann', 'Doe', 1, 2),
    ('Joe', 'Doe', 1, 3);