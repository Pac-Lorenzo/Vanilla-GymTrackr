const Workout = require('../models/Workout');
const PR = require('../models/PersonalRecord');

async function createWorkout(data) {
  const workout = await Workout.create(data);

  // Update PRs 
  for (const ex of workout.exercises || []) {
    if (!ex.exercise_id) continue;

    for (const set of ex.sets || []) {
      if (!set || typeof set.weight !== 'number') continue;

      const filter = {
        user_id: workout.user_id,
        exercise_id: ex.exercise_id
      };

      const existing = await PR.findOne(filter);

      if (!existing) {
        await PR.create({
          user_id: workout.user_id,
          exercise_id: ex.exercise_id,
          best_weight: set.weight,
          date_set: workout.date
        });
      } else if (set.weight > existing.best_weight) {
        existing.best_weight = set.weight;
        existing.date_set = workout.date;
        await existing.save();
      }
    }
  }

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


