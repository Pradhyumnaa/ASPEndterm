PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS subjects (
    subject_id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_name TEXT NOT NULL UNIQUE,
    level_id  INTEGER NOT NULL
);

-- Collections are created per user, therefore we do not need to specify user_email per card
-- as that is identified by the collection
CREATE TABLE IF NOT EXISTS collections (
    collection_id INTEGER PRIMARY KEY AUTOINCREMENT,
    collection_name TEXT NOT NULL,
    subject_id TEXT NOT NULL,
    user_email TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS flashcards (
    flashcard_id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    collection_id INTEGER,
    subject_id TEXT NOT NULL
);

-- Both subjects and collections will have id == 1 for the first entry,
--      therefore, we can add a collection by specifying subject_id as 1
--      now we can add flash cards by specifying subject collection_id as 1

INSERT INTO subjects ("subject_name", "level_id") VALUES ("ITP1", 4);

INSERT INTO collections("collection_name", "subject_id", "user_email")
    VALUES ("Midterm collection", "ITP1", "nethashavithana@gmail.com"); -- id -> 1

INSERT INTO flashcards ("question", "answer", "collection_id", "subject_id")
    VALUES ("What is JavaScript?", "A programming language", 1, "ITP1" /* "Midterm collection" */),
           ("What is Python?", "A programming language", 1, "ITP1"),
           ("What is Juce?", "An audio programming library for C++", 1, "ITP1");

-- Add the rest of the subjects
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