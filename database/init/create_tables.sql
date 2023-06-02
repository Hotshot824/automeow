USE automeow

CREATE TABLE device_info
(
    `uid` INT(6) AUTO_INCREMENT NOT NULL,
    `devicename` CHAR(20) NOT NULL,
    PRIMARY KEY(`uid`),
    UNIQUE (`devicename`)
);

CREATE TABLE DHT22_data
(
    `devicename` CHAR(20) NOT NULL,
    `humidity` FLOAT(8) NOT NULL,
    `temperature` FLOAT(8) NOT NULL,
    `lastupdate` DATETIME NOT NULL,
    FOREIGN KEY(`devicename`) REFERENCES device_info(`devicename`)
);

INSERT INTO `device_info`(`devicename`) VALUES ('DHT22');