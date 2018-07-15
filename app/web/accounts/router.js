var express     = require('express');
var router      = express.Router();
var User        = require('../../users/user');
var path        = require('path');

// ROUTES
// =============================================================================



// for routes that end in /test
// -----------------------------------------------------------------------------
/*router.route('/test')

    // create a user (accessed at POST :8080/api/users)
    .post(function(req, res) {

        var user = new User();      // create a new instance of User model
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.username = req.body.username;
        user.email = req.body.email;
        user.password = req.body.password;


        // save the user + error checking
        user.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'User created!' });
        });
    })

    // get all users (accessed at GET :8080/api/users)
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });



// on routes that end in /test/:user_id
// -----------------------------------------------------------------------------
router.route('/test/:user_id')

    // get the user with this id (accessed at GET :8080/api/users/:user_id)
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })

    // update the user with this id (accessed at PUT :8080/api/users/:user_id)
    .put(function(req, res) {
        // find user by id with user model
        User.findById(req.params.user_id, function(err, user) {

            if (err)
                res.send(err);

            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.username = req.body.username;
            user.email = req.body.email;
            user.password = req.body.password;

            // save the user
            user.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'User updated!' });
            });
        });
    })

    // delete the user with this id (accessed at DELETE :8080/api/users/:user_id)
    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });

*/

router.use(express.static(path.join(__dirname, '../public/errors')));


//==============================================================================
//==============================================================================

// GET route for reading data
router.get('/', function (req, res, next) {
  return res.sendFile(path.join(__dirname,'login.html'));
});

//==============================================================================
//==============================================================================

//POST route for updating data
router.post('/', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('400 - Passwords do not match.');
    err.status = 400;
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.firstname &&
    req.body.lastname &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      age: "",
      dateCreated: Date(),
      birthdate: "",
      charCount: "",
      token: "",
      admin: "",
      expansionOwnership: ""
    };

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        console.log('Account: ' + user.username + ' has been created on ' + Date() + ' IP: ' + req.ip);
        req.session.userId = user._id;
        return res.redirect('/accounts/profile');
      }
    });

  } else if (req.body.logusername && req.body.logpassword) {
    User.usernameAuthenticate(req.body.logusername, req.body.logpassword, function (error, user) {
      if (error || !user) {
        console.log('Failed login attempted for User: '+req.body.logusername+' : ' + Date() + '. IP: ' + req.ip);
        var err = new Error('401 - Credentials Invalid');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        console.log('User: '+ user.username +' has logged in! - ' + Date() + '. IP: ' + req.ip);
        return res.redirect('/accounts/profile');
      }
    });

  } else {
    console.log(req.ip + ' did not enter credentials in all fields when logging in to accounts page');
    var err = new Error('400 - All fields required.');
    err.status = 400;
    return next(err);
  }
})

//==============================================================================
//==============================================================================


// GET route after registering
router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          console.log(req.ip + ' attempted to access Profile page without logging in on ' + Date() + '.')
          var err = new Error('401 - Not logged in. Go back.');
          err.status = 401;
          return next(err);
        } else {
          return res.send('<h1>Name: </h1>' + user.firstName +' '+ user.lastName + '<br>' + user.username + '<h2>Mail: </h2>' + user.email + '<br> Session: ' + user._id + '<br> <a type="button" href="/accounts/logout">Logout</a>')
        }
      }
    });
});

//==============================================================================
//==============================================================================


// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
    // delete session object
    console.log('User: ' + user.username + ' has logged out - ' + Date() + '.');
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/accounts');
          }
        });
      }
    })
  }
});

//==============================================================================
//==============================================================================


//GET for all other nonexistent ROUTES
/*router.get('*', function (req, res, next) {
  var err = new Error('404 - Credentials Invalid');
  err.status = 404;
  return next(err);
});*/

//MIDDLEWARE/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
///\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\

router.use(function(req, res, next){
    res.status(404).sendFile(path.join(__dirname, '../public/errors', '404.html'));
});

// Error Handling
router.use(function(err, req, res, next) {
  if(res.status === 404) {
    console.log(req.ip + ' tried to find nonexistent accounts page.' + Date() + '.');
  } else {
    if(err.status === 400) {
      return res.sendFile(path.join(__dirname, '../public/errors','400.html'));
      res.send(err.message || '400 - Fields incomplete or passwords do not match');
    } else {
      if (err.status=== 401) {
        return res.sendFile(path.join(__dirname, '../public/errors','401.html'));
        res.send(err.message || '401 - Authorization. Not logged in or invalid credentials.');
      }
    }
  }
   next();
});


module.exports = router;
