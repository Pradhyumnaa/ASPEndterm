PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;


CREATE TABLE IF NOT EXISTS subjects (
    subject_id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_name TEXT NOT NULL,
    level_id  INTEGER NOT NULL
);


INSERT INTO subjects ("subject_name", "level_id") VALUES ("ITP I", 1);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("ITP II", 1);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("CM", 1);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("DM", 1);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("HCW", 1);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("FCS", 1);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("WD", 1);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("ADS I", 1);

INSERT INTO subjects ("subject_name", "level_id") VALUES ("OOP", 2);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("SDD", 2);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("DNW", 2);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("ASP", 2);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("CS", 2);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("GP", 2);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("ADS II", 2);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("PWD", 2);

INSERT INTO subjects ("subject_name", "level_id") VALUES ("DS", 3);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("DADT", 3);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("MLNN", 3);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("AI", 3);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("VR", 3);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("GD", 3);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("AWD", 3);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("IOT", 3);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("3D", 3);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("MD", 3);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("ID", 3);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("NLP", 3);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("ISP", 3);


COMMIT;