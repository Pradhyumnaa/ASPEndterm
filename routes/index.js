var router = require('express').Router();
const {requiresAuth} = require('express-openid-connect');

//Global Variable for the Current User's Email
var userEmail = "";

//Global Variable to Identify the current subject page.
var currentSubject = 0;

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


router.get('/collections/:subject', function (req, res) {
    if (req.oidc.isAuthenticated()) {
        const subject_id = req.params.subject;
        currentSubject = subject_id;
        
        console.log(currentSubject);

        var getSubjectCollectionsQuery = "SELECT * from collections WHERE subject_id = ? AND user_email = ?;";

        global.db.all("SELECT * FROM subjects where subject_id=?", [subject_id], function (err, subject) {
            global.db.all(getSubjectCollectionsQuery, [subject_id, userEmail], function (err, allCollectionsResult){
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

router.post("/createCollection" , (req, res, next) => {

    collectionTitle = (req.body.collectionName);

    console.log(collectionTitle);

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
