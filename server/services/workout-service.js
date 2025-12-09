const Workout = require('../models/Workout');

async function createWorkout(data) {
  const workout = await Workout.create(data);

  return workout;
}

async function getWorkoutsForUser(userId) {
  return await Workout.find({ user_id: userId }).sort({ date: -1 });
}

async function getWorkoutById(id) {
  return await Workout.findById(id);
}

async function deleteWorkoutById(id) {
  return await Workout.findByIdAndDelete(id);
}

module.exports = {
  createWorkout,
  getWorkoutsForUser,
  getWorkoutById,
  deleteWorkoutById
};

