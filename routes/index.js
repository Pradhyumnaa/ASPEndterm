const router = require('express').Router();
const {requiresAuth} = require('express-openid-connect');

// Libraries to purify inputs from Summernote editors
const createDOMPurify = require('dompurify');
const {JSDOM} = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Library used to convert HTML to text - so we can see if HTML from Summernote editors are empty
const {htmlToText} = require('html-to-text');

//Global Variable for the Current User's Email
let userEmail = "";

//Global Variable to Identify the current subject page.
let currentSubject = 0;

//Global Variable to Identify the current collection page.
let currentCollection = 0;

//Get function for the Login Page if not Authenticated. Subjects page if Authenticated.
router.get('/', function (req, res, next) {
    if (req.oidc.isAuthenticated()) {
        userEmail = req.oidc.user.email; //This stores the userEmail to a variable. Important because this is the identifier in Database.

        let subjectQuery = "SELECT * FROM subjects;";

        global.db.all(subjectQuery, (err, result) => {
            res.render('subjects', {
                userProfile: JSON.stringify(req.oidc.user, null, 2),
                subjectData: result,
            });
        });

    } else {
        res.render('loginPage', {isAuthenticated: req.oidc.isAuthenticated()});
    }
});


// Get function that controls the collections page
router.get('/collections/:subject', function (req, res) {
    if (req.oidc.isAuthenticated()) {
        currentSubject = req.params.subject;

        var getAllSubjectsQuery = "SELECT * FROM subjects where subject_name=?;";
        var getSubjectCollectionsQuery = "SELECT * from collections WHERE subject_id = ? AND user_email = ?;";

        global.db.all(getAllSubjectsQuery, [currentSubject], function (err, subject) {
            global.db.all(getSubjectCollectionsQuery, [currentSubject, userEmail], function (err, allCollectionsResult) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('collections', {subject: subject[0], collections: allCollectionsResult})
                }
            });
        });
    } else {
        res.redirect('/');
    }
});


// Post function that controls the "Create Collection" functionality.
router.post("/createCollection", (req, res, next) => {

    collectionTitle = (req.body.collectionName);

    var createCollectionQuery = "INSERT INTO collections ('collection_name', 'subject_id', 'user_email') VALUES (?,?,?);";

    global.db.run(
        createCollectionQuery,
        [collectionTitle, currentSubject, userEmail],
        function (err) {
            if (err) {
                next(err);
            } else {
                res.redirect('back');
            }
        }
    );
});

// Post function that controls the "Edit Collection Name" functionality.
router.post("/editCollection", (req, res, next) => {

    collectionTitle = (req.body.collectionName);

    collectionID = Object.keys(req.body)[0];

    var updateCollectionQuery = "UPDATE collections SET collection_name = ? WHERE subject_id = ? AND user_email = ? AND collection_id = ?;";

    global.db.run(
        updateCollectionQuery,
        [collectionTitle, currentSubject, userEmail, collectionID],
        function (err) {
            if (err) {
                next(err);
            } else {
                res.redirect('back');
            }
        }
    );
});


// Post function that controls the "Delete Collection" functionality.
router.post("/deleteCollection", (req, res, next) => {

    let collectionID = Object.keys(req.body)[0];

    var deleteCollectionQuery = "DELETE FROM collections WHERE collection_id = ? AND user_email = ? AND subject_id = ?;";
    // TODO delete all cards of a collection as well

    global.db.run(
        deleteCollectionQuery,
        [collectionID, userEmail, currentSubject],
        function (err) {
            if (err) {
                next(err);
            } else {
                res.redirect('back');
            }
        }
    );
});


// Get function that goes to the flashcard page of the respective collection
router.get('/collections/:subject/:collection', function (req, res, next) {
    if (req.oidc.isAuthenticated()) {
        currentSubject = req.params.subject;
        currentCollection = req.params.collection;
        userEmail = req.oidc.user.email;

        const getAllSubjectsQuery = "SELECT * FROM subjects WHERE subject_name=?;";
        const getCollectionsQuery = "SELECT * FROM collections WHERE subject_id = ? AND user_email = ? AND collection_id = ?;";
        const getFlashcardsQuery = "SELECT * FROM flashcards WHERE collection_id = ? AND subject_id = ?";

        global.db.all(getAllSubjectsQuery, [currentSubject], function (err, subject) {
            global.db.all(getCollectionsQuery, [currentSubject, userEmail, currentCollection], function (err, collection) {
                if (err || collection.length !== 1 || subject.length !== 1) {
                    res.redirect('/');
                } else {
                    global.db.all(getFlashcardsQuery, [collection[0].collection_id, currentSubject], function (err, flashcards) {
                        const data = {
                            subject: subject[0], collection: collection[0], collection_id: collection[0].collection_id,
                            flashcards: flashcards
                        };
                        res.render('flashcard', data);
                    });
                }
            });
        });
    } else {
        res.redirect('/');
    }
});

// Function that returns unix timestamp of today's start time (12 AM)
const todayStartDay = () => {
    let start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    return Math.floor(start.getTime() / 1000);
};

// This function is called when user clicks the Study All or Study Scheduled button
const getQuiz = (req, res, next, onlyScheduled) => {
    currentSubject = req.params.subject;
    currentCollection = req.params.collection;
    userEmail = req.oidc.user.email;

    const getAllSubjectsQuery = "SELECT * FROM subjects WHERE subject_name=?;";
    const getCollectionsQuery = "SELECT * FROM collections WHERE subject_id = ? AND" +
        " user_email = ? AND collection_id = ?;";

    let getFlashcardsQuery;

    // Filtering flashcards - if user clicks on Study Scheduled, only the cards that are scheduled by the SM2
    //  algorithm will be shown
    if (onlyScheduled) {
        getFlashcardsQuery = "SELECT * FROM flashcards WHERE collection_id = ? AND " +
            "subject_id = ? AND (sm2_next_scheduled = 0 OR sm2_next_scheduled <= ?)";
    } else {
        getFlashcardsQuery = "SELECT * FROM flashcards WHERE collection_id = ? " +
            "AND subject_id = ?";

    }

    global.db.all(getAllSubjectsQuery, [currentSubject], (err, subject) => {
        global.db.all(getCollectionsQuery, [currentSubject, userEmail, currentCollection], (err, collection) => {
            if (err || collection.length !== 1 || subject.length !== 1) {
                res.redirect('/');
            } else {
                const params = onlyScheduled ?
                    [collection[0].collection_id, currentSubject, todayStartDay()] :
                    [collection[0].collection_id, currentSubject];
                global.db.all(getFlashcardsQuery, params, (err, flashcards) => {
                    const data = {
                        subject: subject[0], collection: collection[0], flashcards: flashcards
                    };
                    res.render('quiz', data);
                });
            }
        });
    });
}

// Route used if user selects Study All quiz option
// User will see all the flashcards in the collection
router.get('/quiz/:subject/:collection', (req, res, next) => {
    if (req.oidc.isAuthenticated()) {
        getQuiz(req, res, next, false);
    } else {
        res.redirect('/');
    }
});


// Route used if user selects Study Scheduled quiz option
// The user will only see the flashcards that are scheduled for that day using the SM2 algorithm
router.get('/scheduled-quiz/:subject/:collection', (req, res, next) => {
    if (req.oidc.isAuthenticated()) {
        getQuiz(req, res, next, true);
    } else {
        res.redirect('/');
    }
});


// This function is called when user clicks the Study All or Study Scheduled button for a subject
const getSubjectQuiz = (req, res, next, onlyScheduled) => {
    currentSubject = req.params.subject;
    userEmail = req.oidc.user.email;

    const getAllSubjectsQuery = "SELECT * FROM subjects WHERE subject_name = ?;";
    const getCollectionsQuery = "SELECT * FROM collections WHERE subject_id = ? AND" +
        " user_email = ?";

    let getFlashcardsQuery;

    // Filtering flashcards - if user clicks on Study Scheduled, only the cards that are scheduled by the SM2
    //  algorithm will be shown
    if (onlyScheduled) {
        getFlashcardsQuery = "SELECT * FROM flashcards WHERE collection_id IN ($COLLECTIONS$) AND " +
            "subject_id = ? AND (sm2_next_scheduled = 0 OR sm2_next_scheduled <= ?)";
    } else {
        getFlashcardsQuery = "SELECT * FROM flashcards WHERE collection_id IN ($COLLECTIONS$) " +
            "AND subject_id = ?";

    }

    global.db.all(getAllSubjectsQuery, [currentSubject], (err, subject) => {
        global.db.all(getCollectionsQuery, [currentSubject, userEmail], (err, collection) => {
            if (err || collection.length === 0 || subject.length !== 1) {
                res.redirect('/');
            } else {
                const subjectUserCollections = collection.map(x => "" + x.collection_id).join(", ");
                getFlashcardsQuery = getFlashcardsQuery.replace("$COLLECTIONS$", subjectUserCollections);
                const params = onlyScheduled ? [currentSubject, todayStartDay()] : [currentSubject];
                global.db.all(getFlashcardsQuery, params, (err, flashcards) => {
                    const data = {
                        subject: subject[0], collection: {"collection_name": "*"}, flashcards: flashcards
                    };
                    res.render('quiz', data);
                });
            }
        });
    });
}

router.get('/quiz/:subject', (req, res, next) => {
    if (req.oidc.isAuthenticated()) {
        getSubjectQuiz(req, res, next, false);
    } else {
        res.redirect('/');
    }
});

router.get('/scheduled-quiz/:subject', (req, res, next) => {
    if (req.oidc.isAuthenticated()) {
        getSubjectQuiz(req, res, next, true);
    } else {
        res.redirect('/');
    }
});


// Function that uses html-to-text library to check if a Question or Answer summernote editor is empty
const cardsFilterNonEmpty = (card) => {
    return htmlToText(card[1]).trim().length !== 0 && htmlToText(card[2]).trim().length !== 0;
}

// Function to purify inputs entered by users in summernote editors against XSS and DOM Clobbering attacks
// Any scripts added to Summernote editor will be removed when Save button is clicked
const purifyCard = (card) => {
    const purified = card.slice();
    purified[1] = DOMPurify.sanitize(purified[1]);
    purified[2] = DOMPurify.sanitize(purified[2]);
    return purified;
}

// Function to save flashcards when Save button is pressed
router.post("/saveCardsOfCollection", (req, res, next) => {
    const collectionId = (req.body.collection_id);
    userEmail = req.oidc.user.email;

    // Filtering out cards where Question or Answer is an empty string
    const cards = req.body.cards.filter(cardsFilterNonEmpty).map(purifyCard);
    const subject = req.body.subject;

    // From https://stackoverflow.com/questions/56210899/inserting-multiple-rows-with-multiple-columns-in-node-and-sqlite3
    // Separate the values for INSERT INTO operation using map() function
    let cardsPlaceholders = cards.map(() => "(?, ?, ?, ?, ?, ?, ?, ?)").join(', ');
    // Flatten cards object into one array - this allows us to insert all the rows with one INSERT operation
    let flatCard = cards.flat();

    // Select the collection that belongs to current user using collection id
    const getCollectionQuery = "SELECT * FROM collections WHERE collection_id = ? AND user_email = ?";
    // Delete all the flashcards, so they can be reinserted to db
    const deleteFlashCardsQuery = "DELETE FROM flashcards WHERE collection_id = ? AND subject_id = ?"
    // Insert card
    const insertCardQuery = 'INSERT INTO flashcards ("collection_id", "question", "answer",' +
        ' "subject_id", "sm2_repetitions", "sm2_interval", "sm2_easiness", "sm2_next_scheduled") VALUES ' +
        cardsPlaceholders;

    global.db.all(
        getCollectionQuery,
        [collectionId, userEmail],
        (err, collectionData) => {
            // If the collection data is not present then it is an invalid request
            // Example scenario: This collection does not belong to this student
            if (err || collectionData.length !== 1) {
                next(err || "Invalid request");
            } else {
                global.db.run(deleteFlashCardsQuery, [collectionId, subject], (err) => {
                    if (err) {
                        next(err);
                    } else {
                        global.db.run(insertCardQuery, flatCard, (err) => {
                            if (err) {
                                next(err);
                            } else {
                                res.status(200).end(); // Set success
                            }
                        });
                    }
                });
            }
        }
    );
});

// Function to update database with SM2 state of a card when user clicks a confidence number button
router.post("/saveCardSM2State", (req, res, next) => {
    const collectionId = req.body.collectionId;
    const subject = req.body.subject;
    userEmail = req.oidc.user.email;
    // Select the collection that belongs to current user using collection id
    const getCollectionQuery = "SELECT * FROM collections WHERE collection_id = ? AND user_email = ?";
    // Update SM2 state information of the card
    const updateFlashcardSM2Query = "UPDATE flashcards SET sm2_repetitions=?, sm2_interval=?," +
        " sm2_easiness=?, sm2_next_scheduled=? WHERE collection_id=? AND subject_id=? AND flashcard_id=?";

    global.db.run(
        getCollectionQuery,
        [collectionId, userEmail],
        (err) => {
            if (err) {
                next(err);
            } else {
                global.db.run(updateFlashcardSM2Query,
                    [req.body.sm2Rep, req.body.sm2Interval, req.body.sm2Easiness, req.body.sm2NextSchedule,
                        collectionId, subject, req.body.flashcardIndex], (err) => {
                        if (err) {
                            next(err);
                        } else {
                            res.status(200).end(); // Set success
                        }
                    });
            }
        }
    );
});


// router.get('/', function (req, res, next) {
// res.render('index', {
//     title: 'Auth0 Webapp sample Nodejs',
//     isAuthenticated: req.oidc.isAuthenticated()
// });
// });


// router.get('/profile', requiresAuth(), function (req, res, next) {
// res.render('profile', {
//     userProfile: JSON.stringify(req.oidc.user, null, 2),
//     title: 'Index Page'
// });
// });

// router.get('/loginPage', function (req, res, next) {
// res.render('loginPage', {
//     title: 'Auth0 Webapp sample Nodejs',
//     isAuthenticated: req.oidc.isAuthenticated()
// });
// });

module.exports = router;
