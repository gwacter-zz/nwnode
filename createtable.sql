CREATE TABLE Users (
UserId SERIAL PRIMARY KEY ,
FirstName VARCHAR (20),
LastName VARCHAR (20),
Username VARCHAR (25),
Password VARCHAR (40),
Email VARCHAR (30),
Score INTEGER
);

INSERT INTO Users (FirstName, LastName, Username, Password, Email) VALUES('Tania', 'Jacob', 'tjacob', 'password', 'tanzjacob@gmail.com', 0);

INSERT INTO Users (FirstName, LastName, Username, Password, Email) VALUES('Kelsey', 'Morrison', 'kmorrison', 'kelsey', 'kelseymorrison@hotmail.co.nz', 0);


