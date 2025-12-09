const Exercise = require('../models/Exercise');
const User = require('../models/User');

async function getGlobalExercises() {
  return await Exercise.find({}).sort({ name: 1 });
}

async function getExerciseLibrary(userId) {
  const globalExercises = await Exercise.find({}).sort({ name: 1 });
  const user = await User.findById(userId);
  const userCustomExercises = user ? (user.custom_exercises || []) : [];

  return {
    global: globalExercises,
    custom: userCustomExercises,
    combined: [
      ...globalExercises.map(ex => ({
        ...ex.toObject(),
        is_custom: false,
        source: 'global'
      })),
      ...userCustomExercises.map(ex => ({
        ...ex,
        is_custom: true,
        source: 'user'
      }))
    ]
  };
}

async function createGlobalExercise(data) {
  if (!data.exercise_id) {
    const count = await Exercise.countDocuments();
    data.exercise_id = `ex${String(count + 1).padStart(3, '0')}`;
  }
  return await Exercise.create(data);
}

async function addCustomExercise(userId, data) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  if (!data.exercise_id) {
    const customCount = user.custom_exercises ? user.custom_exercises.length : 0;
    data.exercise_id = `user_${userId}_ex${String(customCount + 1).padStart(3, '0')}`;
  }

  const exists = user.custom_exercises?.some(ex =>
    ex.exercise_id === data.exercise_id ||
    ex.name.toLowerCase() === data.name.toLowerCase()
  );
  if (exists) {
    const err = new Error('Exercise already exists in your library');
    err.status = 400;
    throw err;
  }

  user.custom_exercises = user.custom_exercises || [];
  const exercise = {
    exercise_id: data.exercise_id,
    name: data.name,
    type: data.type || 'Custom'
  };
  user.custom_exercises.push(exercise);
  await user.save();

  return {
    message: 'Exercise added to your library',
    exercise
  };
}

async function updateCustomExercise(userId, exerciseId, data) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  const exercise = user.custom_exercises?.find(ex => ex.exercise_id === exerciseId);
  if (!exercise) return null;

  if (data.name && data.name !== exercise.name) {
    const nameExists = user.custom_exercises.some(
      ex =>
        ex.name.toLowerCase() === data.name.toLowerCase() &&
        ex.exercise_id !== exerciseId
    );
    if (nameExists) {
      const err = new Error('Exercise name already exists in your library');
      err.status = 400;
      throw err;
    }
  }

  if (data.name !== undefined) exercise.name = data.name;
  if (data.type !== undefined) exercise.type = data.type;

  await user.save();
  return exercise;
}

async function deleteCustomExercise(userId, exerciseId) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  const originalLength = (user.custom_exercises || []).length;
  user.custom_exercises = (user.custom_exercises || []).filter(
    ex => ex.exercise_id !== exerciseId
  );
  const changed = user.custom_exercises.length !== originalLength;
  if (changed) {
    await user.save();
  }
  return changed;
}

async function deleteGlobalExercise(id) {
  return await Exercise.findByIdAndDelete(id);
}

module.exports = {
  getGlobalExercises,
  getExerciseLibrary,
  createGlobalExercise,
  addCustomExercise,
  updateCustomExercise,
  deleteCustomExercise,
  deleteGlobalExercise
};