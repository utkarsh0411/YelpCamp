var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
    comment: String,
    created:{type: Date, default:Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model('Comment', commentSchema);