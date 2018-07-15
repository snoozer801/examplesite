var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ItemSchema   = new Schema({
    itemName: { type: String, required: true },
    itemType: { type: String, required: true },
    constitution: { type: String, required: true },
    fortitude: { type: String, required: true },
    strength: { type: String, required: true },
    agility: { type: String, required: true },
    intelligence: { type: String, required: true },
    willpower: { type: String, required: true },
    spirit: { type: String, required: true },
    bonusHealth: { type: String, required: true },
    bonusPower: { type: String, required: true },
    bonusPhysical: { type: String, required: true },
    bonusMagical: { type: String, required: true },
    mitigation: { type: String, required: true },
    effectiveness: { type: String, required: true },
    critChance: { type: String, required: true },
    spellStrike: { type: String, required: true },
    dateCreated: String
});

module.exports = mongoose.model('Item', ItemSchema);
