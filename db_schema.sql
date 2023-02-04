PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS subjects (
    subject_id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_name TEXT NOT NULL,
    level_id  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS collections (
    collection_id INTEGER PRIMARY KEY AUTOINCREMENT,
    collection_name TEXT NOT NULL,
    subject_id INTEGER NOT NULL,
    user_email TEXT NOT NULL
);



INSERT INTO subjects ("subject_name", "level_id") VALUES ("ITP1", 4);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("ITP2", 4);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("CM", 4);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("DM", 4);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("HCW", 4);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("FCS", 4);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("WD", 4);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("ADS1", 4);

INSERT INTO subjects ("subject_name", "level_id") VALUES ("OOP", 5);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("SDD", 5);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("DNW", 5);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("ASP", 5);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("CS", 5);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("GP", 5);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("ADS2", 5);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("PWD", 5);

INSERT INTO subjects ("subject_name", "level_id") VALUES ("DS", 6);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("DADT", 6);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("MLNN", 6);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("AI", 6);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("VR", 6);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("GD", 6);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("AWD", 6);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("IOT", 6);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("3D", 6);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("MD", 6);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("ID", 6);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("NLP", 6);
INSERT INTO subjects ("subject_name", "level_id") VALUES ("ISP", 6);

COMMIT;