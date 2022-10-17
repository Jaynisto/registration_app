create database registration_number;
create role Johnson login password 'Jnisto9801';
grant all privileges on database registration_number to Johnson;

CREATE TABLE registration_number(
    id SERIAL PRIMARY KEY,
    reg_id INT,
    registration VARCHAR(100)
);