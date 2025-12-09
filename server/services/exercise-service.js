const Exercise = require('../models/Exercise');

async function getGlobalExercises() {
  return await Exercise.find({}).sort({ name: 1 });
}

async function createGlobalExercise(data) {
  if (!data.exercise_id) {
    const count = await Exercise.countDocuments();
    data.exercise_id = `ex${String(count + 1).padStart(3, '0')}`;
  }
  return await Exercise.create(data);
}

async function deleteGlobalExercise(id) {
  return await Exercise.findByIdAndDelete(id);
}

module.exports = {
  getGlobalExercises,
  createGlobalExercise,
  deleteGlobalExercise
};
