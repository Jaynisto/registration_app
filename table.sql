create database registration_numbers;
create role postgres login password 'Jnisto9801';
grant all privileges on database registration_numbers to postgres;

CREATE TABLE my_towns(
    id SERIAL PRIMARY KEY,
    town VARCHAR(100),
    tag VARCHAR(10)
);

INSERT INTO my_towns(town, tag) VALUES('Bellville', 'CY');
INSERT INTO my_towns(town, tag) VALUES('Paarl', 'CJ');
INSERT INTO my_towns(town, tag) VALUES('CapeTown', 'CA');

CREATE TABLE registration_number(
    id SERIAL PRIMARY KEY,
    town_id INT,
    registration VARCHAR(100),
    foreign key (town_id) references my_towns(id)
);