USE automeow

CREATE TABLE device_info
(
    `uid` INT(6) AUTO_INCREMENT NOT NULL,
    `device_name` CHAR(20) NOT NULL,
    PRIMARY KEY(`uid`),
    UNIQUE (`device_name`)
);

CREATE TABLE environment_data
(
    `device_name` CHAR(20) NOT NULL,
    `humidity` FLOAT(8) NOT NULL,
    `temperature` FLOAT(8) NOT NULL,
    `lastupdate` DATETIME NOT NULL,
    FOREIGN KEY(`device_name`) REFERENCES device_info(`device_name`)
);