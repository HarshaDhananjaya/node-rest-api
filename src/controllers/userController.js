const userService = require("../services/userService");
const CustomError = require("../utils/customError");
const { logWithRequestMetadata, logger } = require("../logger");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  let userId = req.params.id;
  try {
    const user = await userService.getUserById(userId);

    if (!user) return next(new CustomError("USER_NOT_FOUND"));

    logWithRequestMetadata(req, `Fetching user with ID: ${userId}`);
    res.status(200).json(user);
  } catch (error) {
    logWithRequestMetadata(req, `Fetching user with ID: ${userId}`);
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser) return next(new CustomError("USER_NOT_FOUND"));
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser) return next(new CustomError("USER_NOT_FOUND"));
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
