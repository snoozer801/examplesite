var express = require('express');
var router = express.Router();
var userService = require('../users/user.service');
var characterService = require('./character.service');

// routes
router.post('/characterCount', characterCount);
router.post('/populate', populate);
router.post('/create', create);
router.get('/', getAll);
router.get('/current', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

function characterCount(req, res) {
    var check = false;
    characterService.characterCount(req.body.user_id)
        .then(function (check) {
            if (check <= 3) {
                // can create
                res.send("success");
            } else {
                // can't create
                res.status(400).send('You can have only 4 characters.');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function populate(req, res) {

  characterService.populate(req.body.user_id)
      .then(function(characters){
        res.send(characters);
      })
      .catch(function(err){
        res.status(400).send(err);
      });
}

function create(req, res) {
    characterService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    characterService.getAll()
        .then(function (characters) {
            res.send(characters);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    userService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    characterService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
