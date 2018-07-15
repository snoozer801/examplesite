var config    = require('../../config.json');
var _         = require('lodash');
var jwt       = require('jsonwebtoken');
var bcrypt    = require('bcrypt');
var Q         = require('q');
var mongo     = require('mongoskin');
var db        = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');
db.bind('characters');

var service = {};

service.characterCount = characterCount;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.populate = populate;
module.exports = service;



function characterCount(_id) {
    var deferred = Q.defer();
    var check = 0;

    check = db.characters.count({ user_id: _id } , function (err, check){
      if (err) deferred.reject(err.name + ': ' + err.message);
    deferred.resolve(check);});
      // less than 4 characters
      if (check <= 3){
        deferred.resolve(check);
      }
    console.log(check);
    return deferred.promise;
}

function populate(_id){
  var deferred = Q.defer();

  db.characters.find({ user_id: _id }).toArray(function (err, characters){
    if (err) deferred.reject(err.name + ': ' + err.message);

    characters = _.map(characters, function (character) {
      return character;
    });

    deferred.resolve(characters);
  });

  return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();

    db.characters.find().toArray(function (err, characters) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        characters = _.map(characters, function (character) {
            return character;
        });

        deferred.resolve(characters);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.characters.findById(_id, function (err, character) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(user);
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(characterParam) {
    var deferred = Q.defer();

    // validation
    db.characters.findOne(
        { characterName: characterParam.characterName },
        function (err, character) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (character) {
                // username already exists
                deferred.reject('There is someone named "' + characterParam.characterName + '" already.');
            } else {
                createCharacter(character);
            }
        });

    function createCharacter(character) {

      var character = characterParam;
        db.characters.insert(
            character,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, characterParam) {
    var deferred = Q.defer();

    // validation
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== characterParam.username) {
            // username has changed so check if the new username is already taken
            db.users.findOne(
                { username: characterParam.username },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: characterParam.firstName,
            lastName: characterParam.lastName,
            username: characterParam.username,
        };

        // update password if it was entered
        if (characterParam.password) {
            set.hash = bcrypt.hashSync(characterParam.password, 10);
        }

        db.users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.characters.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}
