// ADMIN ROUTER ================================================================
var express   = require('express');
var router    = express.Router();
var User      = require('../../users/user');
var Quest     = require('../../quests/quests');
var Spell     = require('../../spells/spells');
var Item      = require('../../items/items');
var path      = require('path');

// MIDDLEWARE /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\

router.use(express.static(path.join(__dirname, '../public/errors')));
//==============================================================================
//==============================================================================

// GET route -- direct to admin login
router.get('/', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function(error, user) {
        if (user === null) {
          console.log(req.ip + ' attempted to access admin page without logging in on ' + Date() + '.');
          var err = new Error('401 - Not logged in. Go back.');
          err.status = 401;
          return next(err);
        } else {
          if (user.admin === false) {
            console.log(user.username + 'attempted to access admin page on ' + Date() + '. IP: ' + req.ip);
            var err = new Error('401 - Not Authorized.');
            err.status = 401;
            return next(err);
          } else {
            return res.sendFile(path.join(__dirname,'adminLogin.html'));
        }
      }
  });
});

//POST route -- perform login
router.post('/', function (req, res, next) {
  if (req.body.adminLogEmail && req.body.adminLogPassword) {
    User.authenticate(req.body.adminLogEmail, req.body.adminLogPassword, function (error, user) {
      if (error || !user) {
        var err = new Error('401 - Credentials Invalid.');
        console.log('Failed login attempted for Admin: '+req.body.adminLogEmail+' : ' + Date() + '. IP: ' + req.ip);
        err.status = 401;
        return next(err);
      } else {
        if (user.admin === false) {
          console.log(user.username + 'attempted to login on admin page on ' + Date() + '. IP: ' + req.ip);
          var err = new Error('401 - Not Authorized.');
          err.status = 401;
          return next(err);
        } else {
          console.log('Admin: ' + user.username + ' has logged in! - ' + Date() + '. IP: ' + req.ip);
          req.session.userId = user._id;
          return res.redirect('admin/adminDash');
          }
      }
    });
  } else {
    var err = new Error('400 - All fields required.');
    err.status = 400;
    return next(err);
  }
})

// Direct to Admin Dashboard at login.
router.get('/adminDash', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          console.log(req.ip + ' attempted to access adminDash page without logging in on ' + Date() + '.');
          var err = new Error('401 - Not logged in. Go back.');
          err.status = 401;
          return next(err);
        } else {
          if (user.admin === false) {
            console.log(user.username + 'attempted to access adminDash page on ' + Date() + '. IP: ' + req.ip);
            var err = new Error('401 - Not Authorized');
            err.status = 401;
            return next(err);
          } else {
            return res.sendFile(path.join(__dirname,'adminDash.html'));
          } //3rd else
        } //2nd else
      } //1st else
    });
});

//==============================================================================
//==============================================================================

// 8080/admin/quests -- GET -- Direct to Quest Submission Form
router.get('/quests', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          console.log(req.ip + ' attempted to access Admin Quests page without logging in on ' + Date() + '.');
          var err = new Error('401 - Not logged in. Go back.');
          err.status = 401;
          return next(err);
        } else {
          if (user.admin === false) {
            console.log(user.username + 'attempted to access Admin Quests page on ' + Date() + '. IP: ' + req.ip);
            var err = new Error('401 - Not Authorized.');
            err.status = 401;
            return next(err);
          } else {
          return res.sendFile(path.join(__dirname,'questform.html'));
          }
        }
      }
    });
});

//POST route for updating data
router.post('/quests', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
  if (req.body.entryName &&
    req.body.journalType &&
    req.body.journalText &&
    req.body.journalLore &&
    req.body.journalCompleteLore &&
    req.body.progressValue) {

    var questData = {
      entryName: req.body.entryName,
      journalType: req.body.journalType,
      journalText: req.body.journalText,
      journalLore: req.body.journalLore,
      journalCompleteLore: req.body.journalCompleteLore,
      completed: "",
      progressValue: req.body.progressValue,
      currentProgress: "",
      dateCreated: Date()
    }

    Quest.create(questData, function (error, quest) {
      if (error) {
        return next(error);
      } else {
        console.log(user.username + ' has created a quest titled ' + req.body.entryName + '. Date: ' + Date() + '.')
        return res.redirect('quests');
      }
    });
  } else {
    var err = new Error('400 - All fields required.');
    err.status = 400;
    return next(err);
  }
}
})
})

//==============================================================================
//==============================================================================

// Direct to spell form
router.get('/spells', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          console.log(req.ip + ' attempted to access Admin Spells page without logging in on ' + Date() + '.');
          var err = new Error('401 - Not logged in. Go back.');
          err.status = 401;
          return next(err);
        } else {
          if (user.admin === false) {
            console.log(user.username + 'attempted to access Admin Spells page on ' + Date() + '. IP: ' + req.ip);
            var err = new Error('401 - Not Authorized.');
            err.status = 401;
            return next(err);
          } else {
          return res.sendFile(path.join(__dirname,'spellform.html'));
          }
        }
      }
    });
});

router.post('/spells', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
  if (req.body.spellName &&
    req.body.tooltip &&
    req.body.baseDamage &&
    req.body.graphic &&
    req.body.castTime &&
    req.body.powerCost &&
    req.body.range &&
    req.body.spellType &&
    req.body.spellSchool &&
    req.body.targetType) {

    var spellData = {
      spellName: req.body.spellName,
      tooltip: req.body.tooltip,
      baseDamage: req.body.baseDamage,
      graphic: req.body.graphic,
      castTime: req.body.castTime,
      powerCost: req.body.powerCost,
      range: req.body.range,
      spellType: req.body.spellType,
      spellSchool: req.body.spellSchool,
      targetType: req.body.targetType,
      dateCreated: Date()
    }

    Spell.create(spellData, function (error, spell) {
      if (error) {
        return next(error);
      } else {
        console.log(user.username + ' has created a spell titled ' + req.body.spellName + '. Date: ' + Date() + '.')
        return res.redirect('/admin/spells');
      }
    });
  } else {
    var err = new Error('400 - All fields required.');
    err.status = 400;
    return next(err);
  }
  }
})
})

//==============================================================================
//==============================================================================

// Direct to item form
router.get('/items', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          console.log(req.ip + ' attempted to access Admin Items page without logging in on ' + Date() + '.');
          var err = new Error('401 - Not logged in. Go back.');
          err.status = 401;
          return next(err);
        } else {
          if (user.admin === false) {
            console.log(user.username + 'attempted to access Admin Items page on ' + Date() + '. IP: ' + req.ip);
            var err = new Error('401 - Not Authorized');
            err.status = 401;
            return next(err);
          } else {
          return res.sendFile(path.join(__dirname,'itemform.html'));
          }
        }
      }
    });
});

router.post('/items', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
  if (req.body.itemName &&
    req.body.itemType &&
    req.body.constitution &&
    req.body.fortitude &&
    req.body.strength &&
    req.body.agility &&
    req.body.intelligence &&
    req.body.willpower &&
    req.body.spirit &&
    req.body.bonusHealth &&
    req.body.bonusPower &&
    req.body.bonusPhysical &&
    req.body.bonusMagical &&
    req.body.mitigation &&
    req.body.effectiveness &&
    req.body.critChance &&
    req.body.spellStrike) {

    var itemData = {
      itemName: req.body.itemName,
      itemType: req.body.itemType,
      constitution: req.body.constitution,
      fortitude: req.body.fortitude,
      strength: req.body.strength,
      agility: req.body.agility,
      intelligence: req.body.intelligence,
      willpower: req.body.willpower,
      spirit: req.body.spirit,
      bonusHealth: req.body.bonusHealth,
      bonusPower: req.body.bonusPower,
      bonusPhysical: req.body.bonusPhysical,
      bonusMagical: req.body.bonusMagical,
      mitigation: req.body.mitigation,
      effectiveness: req.body.effectiveness,
      critChance: req.body.critChance,
      spellStrike: req.body.spellStrike,
      dateCreated: Date()
    }

    Item.create(itemData, function (error, item) {
      if (error) {
        return next(error);
      } else {
        console.log(user.username + ' has created an item titled ' + req.body.itemName + '. Date: ' + Date() + '.')
        return res.redirect('/admin/items');
      }
    });
  } else {
    var err = new Error('400 - All fields required.');
    err.status = 400;
    return next(err);
  }
}
})
})

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
    console.log('Admin: ' + user.username + ' has logged out - ' + Date() + '.');
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
  console.log(req.ip + ' tried to find nonexistent Admin page.' + Date() + '.');
  return res.sendFile(path.join(__dirname, '../public/errors','404.html'));
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
