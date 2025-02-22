const User = require("../models/User"); // ✅ Load model once

async function getAllUsers() {
  return await User.findAll();
}

async function getUserById(id) {
  return await User.findByPk(id);
}

async function createUser(userData) {
  return await User.create(userData);
}

async function updateUser(id, userData) {
  await User.update(userData, { where: { id } });
  return await User.findByPk(id);
}

async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.destroy();
  return user;
}

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
