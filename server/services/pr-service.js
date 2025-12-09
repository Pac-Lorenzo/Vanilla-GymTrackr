const PR = require('../models/PersonalRecord');

async function getPrsForUser(userId) {
  return await PR.find({ user_id: userId });
}

async function getPrForUserExercise(userId, exerciseId) {
  return await PR.findOne({
    user_id: userId,
    exercise_id: exerciseId
  });
}

module.exports = {
  getPrsForUser,
  getPrForUserExercise
};