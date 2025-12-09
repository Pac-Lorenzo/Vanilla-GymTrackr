const User = require('../models/User');

async function getAllUsers() {
  return await User.find({}).sort({ createdAt: -1 });
}

async function createUser(data) {
  return await User.create(data);
}

async function getUserById(id) {
  return await User.findById(id);
}

async function updateUser(id, fields) {
  const allowed = ['name', 'email', 'age', 'weight_lbs'];
  const updateData = {};
  for (const key of allowed) {
    if (fields[key] !== undefined) {
      updateData[key] = fields[key];
    }
  }
  return await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });
}

async function deleteUser(id) {
  return await User.findByIdAndDelete(id);
}

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser
};