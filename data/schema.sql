DROP TABLE IF EXISTS digimon_table;
CREATE TABLE digimon_table (
id SERIAL PRIMARY KEY,
name VARCHAR(255),
image VARCHAR(255),
level VARCHAR(255)
);