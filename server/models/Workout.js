const mongoose = require('mongoose');

const SetSchema = new mongoose.Schema({
  set_id: String,
  weight: Number,
  reps: Number,
  difficulty: Number 
}, { _id: false });

const WorkoutExerciseSchema = new mongoose.Schema({
  exercise_id: String,
  name: String,
  sets: [SetSchema]
}, { _id: false });

const WorkoutSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  total_time_minutes: Number,
  exercises: [WorkoutExerciseSchema]
}, { timestamps: true });

module.exports = mongoose.model('Workout', WorkoutSchema);
