var express = require('express');
var router = express.Router();
var questService = require('./quest.service');

// routes
router.post('/authenticate', authenticate);
router.post('/add', add);
router.get('/', getAll);
router.get('/current', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

function authenticate(req, res) {
    questService.authenticate(req.body.username, req.body.password)
        .then(function (user) {
            if (user) {
                // authentication successful
                res.send(user);
            } else {
                // authentication failed
                res.status(400).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
//==============================================================================

function add(req, res) {
    questService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
//==============================================================================

function getAll(req, res) {
    questService.getAll()
        .then(function (quests) {
            res.send(quests);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
//==============================================================================

function getCurrent(req, res) {
    questService.getById(req.params._id)
        .then(function (quest) {
            if (quest) {
                res.send(quest);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
//==============================================================================

function update(req, res) {
    questService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
//==============================================================================

function _delete(req, res) {
    questService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
