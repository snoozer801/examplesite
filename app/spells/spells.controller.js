var express       = require('express');
var router        = express.Router();
var spellService  = require('./spell.service');
var userService   = require('../users/user.service');

// routes
router.post('/castSpell', castSpell);
router.post('/createSpell', createSpell);
router.get('/', fillTome);
router.get('/current', getCurrent);
router.put('/unlock', unlock);
router.delete('/:_id', _delete);

module.exports = router;

function castSpell(req, res) {
    spellService.castSpell(req.body.spell)
        .then(function (spell) {
            if (spell.unlocked) {
                // cast success
                res.send(spell);
            } else {
                // authentication failed
                res.status(400).send('Spell not unlocked, RRREEEeeEEeeeEEEEEEE');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function createSpell(req, res) {
    spellService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function fillTome(req, res) {
    db.spells.find()
        .then(function () {
          spellService.fillTome(user)
              .then(function (spells) {
                  res.send(spells);
              })
              .catch(function (err) {
                  res.status(400).send(err);
              })
        });
}

function getCurrent(req, res) {
    spellService.getById(req.spell.sub)
        .then(function (spell) {
            if (spell) {
                res.send(spell);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function unlock(req, res) {
    spellService.unlock(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    spellService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
