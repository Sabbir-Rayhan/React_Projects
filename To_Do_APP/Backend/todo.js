const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/Todo')

// Define Schema
const todoSchema = new mongoose.Schema({
    text: String,
    completed: {
        type: Boolean,
        default: false // Task is incomplete by default
    },
    date: {
      type: Date,
      default: () => new Date() // Ensures both date & time are saved
  },
  
},{ timestamps: true });

// Create Model
module.exports = mongoose.model('Todo', todoSchema);
