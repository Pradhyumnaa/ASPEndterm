var router = require('express').Router();
const {requiresAuth} = require('express-openid-connect');

//Global Variable for the Current User's Email
var userEmail = "";

//Global Variable to Identify the current subject page.
var currentSubject = 0;

//Global Variable to Identify the current collection page.
var currentCollection = 0;

//Get function for the Login Page if not Authenticated. Subjects page if Authenticated.
router.get('/', function (req, res, next) {
    if (req.oidc.isAuthenticated()) {
        userEmail = req.oidc.user.email; //This stores the userEmail to a variable. Important because this is the identifier in Database.

        let subjectQuery = "SELECT * FROM subjects;";

        global.db.all(subjectQuery, (err, result) =>{
            res.render('subjects', {
                userProfile: JSON.stringify(req.oidc.user, null, 2),
                subjectData: result,
            });
        });

    } else {
        res.render('loginPage', {isAuthenticated: req.oidc.isAuthenticated()});
    }
});


//Get function that controls the collections page
router.get('/collections/:subject', function (req, res) {
    if (req.oidc.isAuthenticated()) {
        currentSubject = req.params.subject;

        var getAllSubjectsQuery = "SELECT * FROM subjects where subject_name=?;";
        var getSubjectCollectionsQuery = "SELECT * from collections WHERE subject_id = ? AND user_email = ?;";

        global.db.all(getAllSubjectsQuery, [currentSubject], function (err, subject) {
            global.db.all(getSubjectCollectionsQuery, [currentSubject, userEmail], function (err, allCollectionsResult){
                if(err){
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


//Post function that controls the "Create Collection" functionality.
router.post("/createCollection" , (req, res, next) => {

    collectionTitle = (req.body.collectionName);

    var createCollectionQuery = "INSERT INTO collections ('collection_name', 'subject_id', 'user_email') VALUES (?,?,?);";
    
    global.db.run(
        createCollectionQuery,
        [collectionTitle, currentSubject, userEmail],
        function(err){
            if(err){
                next(err);
            } else{
                res.redirect('back');
            }
        }
    );
});


//Post function that controls the "Edit Collection Name" functionality.
router.post("/editCollection" , (req, res, next) => {

    collectionTitle = (req.body.collectionName);

    collectionID = Object.keys(req.body)[0];

    var updateCollectionQuery = "UPDATE collections SET collection_name = ? WHERE subject_id = ? AND user_email = ? AND collection_id = ?;";
    
    global.db.run(
        updateCollectionQuery,
        [collectionTitle, currentSubject, userEmail, collectionID],
        function(err){
            if(err){
                next(err);
            } else{
                res.redirect('back');
            }
        }
    );
});


//Post function that controls the "Delete Collection" functionality.
router.post("/deleteCollection" , (req, res, next) => {

    collectionID = Object.keys(req.body)[0];

    var deleteCollectionQuery = "DELETE FROM collections WHERE collection_id = ? AND user_email = ? AND subject_id = ?;";
    
    global.db.run(
        deleteCollectionQuery,
        [collectionID, userEmail, currentSubject],
        function(err){
            if(err){
                next(err);
            } else{
                res.redirect('back');
            }
        }
    );
});


//Get function that goes to the flashcard page of the respective collection
router.get('/collections/:subject/:collection', function (req, res) {
    if (req.oidc.isAuthenticated()) {
        currentSubject = req.params.subject;
        currentCollection = req.params.collection;

        var getAllSubjectsQuery = "SELECT * FROM subjects WHERE subject_name=?;";
        var getCollectionsQuery = "SELECT * FROM collections WHERE subject_id = ? AND user_email = ? AND collection_id = ?;";

        global.db.all(getAllSubjectsQuery, [currentSubject], function (err, subject) {
            global.db.all(getCollectionsQuery, [currentSubject, userEmail, currentCollection], function (err, collection){
                if(err){
                    console.log(err);
                } else {
                    res.render('flashcard', {subject: subject[0], collection: collection[0]});
                }
            });
        });
    } else {
        res.redirect('/');
    }
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
