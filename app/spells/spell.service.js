var config        = require('../../config.json');
var _             = require('lodash');
var jwt           = require('jsonwebtoken');
var bcrypt        = require('bcrypt');
var Q             = require('q');
var mongo         = require('mongoskin');
var db            = mongo.db(config.connectionString, { native_parser: true });
db.bind('spells');

var service = {};

service.castSpell = castSpell;
service.fillTome = fillTome;
service.getById = getById;
service.create = create;
service.unlock = unlock;
service.delete = _delete;

module.exports = service;

function castSpell(spell) {
    var deferred = Q.defer();

    //open the tome to find one of them dang ol spells to cast
    db.spells.findOne({ spell_id: spell_id }, function (err, spell) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (spell.unlocked === true) {
            // request to cast dang ol successful
            deferred.resolve({
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: jwt.sign({ sub: user._id }, config.secret)
            });
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

//peruse your spellbook young mage
function fillTome(user) {
    var deferred = Q.defer();
    db.spells.find().toArray(function (err, spells) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        // return spells (that are unlocked)
        spells = _.map(spells, function (spell) {
          if (spell.unlocked === true)
          {
            return spell;
          }
        });

        deferred.resolve(spells);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.spells.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(spellParam) {
    var deferred = Q.defer();

    // validation
    db.spells.findOne(
        { name: spellParam.name },
        function (err, spell) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (spell) {
                // username already exists
                deferred.reject('Spell named "' + spellParam.name + '" already exists');
            } else {
                createSpell();
            }
        });

    function createSpell() {
        // set spell object to userPara
        var spell = spellParam;
        db.spells.insert(
            spell,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function unlock(spellParam){
  var deferred = Q.defer();

  db.users.findOne(
    { _id: spellParam._id, }, function (err, spell){
      if (err) defferred.reject(err.spellName + ': ' + err.message);

      if (spell){
        defferred.reject(spellParam.spellName + ' already unlocked!');
      } else {
        unlockSpell();
      }
    }
  );

  function unlockSpell() {
    var spell = spellParam;
    db.users.update(
      { _id: spellParam._id}, {$addToSet: { "spellsUnlocked": spellParam.spellName}},
        {upsert: true })
  }
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (spell.name !== userParam.name) {
            // spell has changed so check if the new spell name is already taken
            db.spells.findOne(
                { name: userParam.name },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Spell named "' + req.body.spellName + '" already exists.')
                    } else {
                        updateSpell();
                    }
                });
        } else {
            updateSpell();
        }
    });

    function updateSpell() {
        // fields to update
        var set = {
            name: userParam.name,
            type: userParam.type,
        };

        db.spells.update(
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

    db.spells.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}
