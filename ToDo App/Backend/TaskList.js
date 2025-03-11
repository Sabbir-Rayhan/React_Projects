const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/TaskList');

const taskSchema = mongoose.Schema({
    task : String,
    date : {
        type : Date,
        default : Date.now,
    },
    completed : {
        type : Boolean,
        default : false
    }
})

module.exports = mongoose.model('Tasks',taskSchema);