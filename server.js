// call packages
var express    = require('express');
var app        = express();  // define app using express
var bodyParser = require('body-parser');
var cors       = require('cors');
var mongoose   = require('mongoose');
var User       = require('./app/users/user');
var Quest      = require('./app/quests/quests');
var Spell      = require('./app/spells/spells');
var Item       = require('./app/items/items');
var session    = require('express-session');
var MongoStore = require('connect-mongo')(session);
var path       = require('path');

// connect to database
mongoose.connect('mongodb://snoozer801:knuckles801@ds151955.mlab.com:51955/rpg', { useMongoClient: true });

//use sessions for tracking logins
app.use(session({
  secret: 'succ',
  resave: true,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(cors());

// configure app to use bodyParser(), parse incoming requests
// Allow getting the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set port

// serve static files
app.use(express.static(path.join(__dirname, './app/web/public','home')));

// REGISTER ROUTES
var routes              = require('./app/web/accounts/router');
var adminRoutes         = require('./app/web/admin/adminrouter');
var userController      = require('./app/users/users.controller');
var questController     = require('./app/quests/quest.controller');
var spellController     = require('./app/spells/spells.controller');
var characterController = require('./app/characters/characters.controller');
// all routes used
app.use('/accounts', routes);
app.use('/admin', adminRoutes);
app.use('/users', userController);
app.use('/quests', questController);
app.use('/spells', spellController);
app.use('/characters', characterController);
//GET for all other nonexistent ROUTES

app.use(function(req, res, next){
    res.status(404).sendFile(path.join(__dirname, './app/web/public/errors', '404.html'));
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server listening on port: ' + port);



/*
/api/users	GET	Get all the users.
/api/users	POST	Create a user.
/api/users/:user_id	GET	Get a single user.
/api/users/:user_id	PUT	Update a user with new info.
/api/users/:user_id	DELETE	Delete a user.
*/
