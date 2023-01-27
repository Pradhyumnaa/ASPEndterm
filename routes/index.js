var router = require('express').Router();
const {requiresAuth} = require('express-openid-connect');

var userEmail = ""

// router.get('/', function (req, res, next) {
//   res.render('index', {
//     title: 'Auth0 Webapp sample Nodejs',
//     isAuthenticated: req.oidc.isAuthenticated()
//   });
// });

router.get('/', function (req, res, next) {
    if (req.oidc.isAuthenticated()) {
        userEmail = req.oidc.user.email; //This stores the userEmail to a variable. Important because this is the identifier in Database.
        res.render('subjects', {
            userProfile: JSON.stringify(req.oidc.user, null, 2)
        });
    } else {
        res.render('loginPage', {
            isAuthenticated: req.oidc.isAuthenticated()
        });
    }
});

// router.get('/profile', requiresAuth(), function (req, res, next) {
//   res.render('profile', {
//     userProfile: JSON.stringify(req.oidc.user, null, 2),
//     title: 'Index Page'
//   });
// });

// router.get('/loginPage', function (req, res, next) {
//   res.render('loginPage', {
//     title: 'Auth0 Webapp sample Nodejs',
//     isAuthenticated: req.oidc.isAuthenticated()
//   });
// });

router.get("/editCard", (req, res) => {
    res.render("editCard");
});

module.exports = router;
