var config      = require('../../config.json');
var _           = require('lodash');
var jwt         = require('jsonwebtoken');
var bcrypt      = require('bcrypt');
var Q           = require('q');
var mongo       = require('mongoskin');
var db          = mongo.db(config.connectionString, { native_parser: true });
db.bind('quests');

var service = {};

service.authenticate = authenticate;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function authenticate(username, password) {
    var deferred = Q.defer();

    db.users.findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
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
//==============================================================================

function getAll() {
    var deferred = Q.defer();

    db.quests.find().toArray(function (err, quests) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        // return quests (without hashed passwords)
        quests = _.map(quests, function (quest) {
            return (quest);
        });

        deferred.resolve(quests);
    });

    return deferred.promise;
}
//==============================================================================

function getById(_id) {
    var deferred = Q.defer();

    db.quests.findById(_id, function (err, quest) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (quest) {
            // return quest (without hashed password)
            deferred.resolve(_.omit(quest, 'hash'));
        } else {
            // quest not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}
//==============================================================================

function create(questParam) {
    var deferred = Q.defer();

    // validation
    db.quests.findOne(
        { entryName: questParam.entryName },
        function (err, quest) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (quest) {
                // entryName already exists
                deferred.reject('Entry Name "' + questParam.entryName + '" is already taken');
            } else {
                createQuest();
            }
        });
//==============================================================================

    function createQuest() {
        // set quest object to questParam without the cleartext password
        var quest = _.omit(questParam, 'password');

        db.quests.insert(
            quest,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}
//==============================================================================

function update(_id, questParam) {
    var deferred = Q.defer();

    // validation
    db.quests.findById(_id, function (err, quest) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (quest.entryName !== questParam.entryName) {
            // entryName has changed so check if the new entryName is already taken
            db.quests.findOne(
                { entryName: questParam.entryName },
                function (err, quest) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (quest) {
                        // entryName already exists
                        deferred.reject('Entry Name "' + req.body.entryName + '" is already taken')
                    } else {
                        updateQuest();
                    }
                });
        } else {
            updateQuest();
        }
    });
//==============================================================================

    function updateQuest() {
        // fields to update
        var set = {
            firstName: questParam.firstName,
            lastName: questParam.lastName,
            entryName: questParam.entryName,
        };

        // update password if it was entered
        if (questParam.password) {
            set.hash = bcrypt.hashSync(questParam.password, 10);
        }

        db.quests.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}
//==============================================================================

function _delete(_id) {
    var deferred = Q.defer();

    db.quests.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}
