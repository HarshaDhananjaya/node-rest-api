const User = require("../../src/models/User");
const userService = require("../../src/services/userService");
const { Sequelize } = require("sequelize");

jest.mock("../../src/models/User");

describe("User Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should get all users", async () => {
    const users = [{ id: 1, name: "John Doe" }];
    User.findAll.mockResolvedValue(users);
    const result = await userService.getAllUsers();
    expect(result).toEqual(users);
    expect(User.findAll).toHaveBeenCalledTimes(1);
  });

  test("should get user by ID", async () => {
    const user = { id: 1, name: "John Doe" };
    User.findByPk.mockResolvedValue(user);
    const result = await userService.getUserById(1);
    expect(result).toEqual(user);
    expect(User.findByPk).toHaveBeenCalledWith(1);
  });

  test("should create a new user", async () => {
    const userData = { name: "Jane Doe" };
    const newUser = { id: 2, ...userData };
    User.create.mockResolvedValue(newUser);
    const result = await userService.createUser(userData);
    expect(result).toEqual(newUser);
    expect(User.create).toHaveBeenCalledWith(userData);
  });

  test("should update a user", async () => {
    const userData = { name: "Updated Name" };
    const updatedUser = { id: 1, ...userData };
    User.update.mockResolvedValue([1]);
    User.findByPk.mockResolvedValue(updatedUser);
    const result = await userService.updateUser(1, userData);
    expect(result).toEqual(updatedUser);
    expect(User.update).toHaveBeenCalledWith(userData, { where: { id: 1 } });
    expect(User.findByPk).toHaveBeenCalledWith(1);
  });

  test("should delete a user", async () => {
    const user = { id: 1, destroy: jest.fn() };
    User.findByPk.mockResolvedValue(user);
    const result = await userService.deleteUser(1);
    expect(result).toEqual(user);
    expect(user.destroy).toHaveBeenCalled();
  });

  test("should return null if deleting a non-existent user", async () => {
    User.findByPk.mockResolvedValue(null);
    const result = await userService.deleteUser(99);
    expect(result).toBeNull();
  });
});
