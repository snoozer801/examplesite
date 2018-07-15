var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var QuestSchema   = new Schema({
    entryName: { type: String, required: true },
    journalType: { type: String, required: true },
    journalText: { type: String, required: true },
    journalLore: { type: String, required: true },
    journalCompleteLore: { type: String, required: true },
    completed: Boolean,
    progressValue: { type: String, required: true },
    currentProgress: String,
    dateCreated: String
});

module.exports = mongoose.model('Quest', QuestSchema);
