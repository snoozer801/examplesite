var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SpellSchema   = new Schema({
    spellName: { type: String, required: true },
    tooltip: { type: String, required: true },
    baseDamage: { type: String, required: true },
    graphic: { type: String, required: true },
    castTime: { type: String, required: true },
    powerCost: { type: String, required: true },
    range: { type: String, required: true },
    spellType: { type: String, required: true },
    spellSchool: { type: String, required: true },
    targetType: { type: String, required: true },
    dateCreated: String
});

module.exports = mongoose.model('Spell', SpellSchema);
