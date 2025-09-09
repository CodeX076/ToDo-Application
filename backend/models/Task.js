const mongoose = require("mongoose");

// Task Schema
const TaskSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: Boolean,
    default: false, // false = incomplete, true = complete
  },
  position: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Export Task model
module.exports = mongoose.model("Task", TaskSchema);
