const User = require("../models/User");

const getAllUsers = async () => {
  return await User.findAll();
};

const getUserById = async (id) => {
  return await User.findByPk(id);
};

const createUser = async (userData) => {
  return await User.create(userData);
};

const updateUser = async (id, userData) => {
  return await User.findByIdAndUpdate(id, userData, { new: true });
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
