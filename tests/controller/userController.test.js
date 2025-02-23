const request = require("supertest");
const express = require("express");
const userController = require("../../src/controllers/userController");
const userService = require("../../src/services/userService");
const CustomError = require("../../src/utils/customError");

const app = express();

jest.mock("../../src/services/userService");

app.use(express.json());

// Attach routes
app.get("/users", userController.getAllUsers);
app.get("/users/:id", userController.getUserById);
app.post("/users", userController.createUser);
app.put("/users/:id", userController.updateUser);
app.delete("/users/:id", userController.deleteUser);

// Add an error-handling middleware
app.use((err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(404).json({ message: err.message });
  }
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

describe("User Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return all users", async () => {
    const mockUsers = [{ id: 1, name: "John Doe" }];
    userService.getAllUsers.mockResolvedValue(mockUsers);

    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockUsers);
  });

  test("should return 500 if getAllUsers throws an error", async () => {
    userService.getAllUsers.mockRejectedValue(new Error("Database error"));

    const res = await request(app).get("/users");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Database error" });
  });

  test("should return a user by ID", async () => {
    const mockUser = { id: 1, name: "John Doe" };
    userService.getUserById.mockResolvedValue(mockUser);

    const res = await request(app).get("/users/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockUser);
  });

  test("should return 500 if getUserById throws an error", async () => {
    userService.getUserById.mockRejectedValue(new Error("Unexpected error"));

    const res = await request(app).get("/users/1");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Unexpected error" });
  });

  test("should return 404 if user not found", async () => {
    userService.getUserById.mockResolvedValue(null);

    const res = await request(app).get("/users/1");
    expect(res.status).toBe(404);
  });

  test("should create a user", async () => {
    const newUser = { id: 2, name: "Jane Doe" };
    userService.createUser.mockResolvedValue(newUser);

    const res = await request(app).post("/users").send({ name: "Jane Doe" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual(newUser);
  });

  test("should return 500 if createUser throws an error", async () => {
    userService.createUser.mockRejectedValue(new Error("Invalid input"));

    const res = await request(app).post("/users").send({ name: "John" });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Invalid input" });
  });

  test("should update a user", async () => {
    const updatedUser = { id: 1, name: "John Updated" };
    userService.updateUser.mockResolvedValue(updatedUser);

    const res = await request(app).put("/users/1").send({ name: "John Updated" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(updatedUser);
  });

  test("should return 404 when updating a non-existing user", async () => {
    userService.updateUser.mockResolvedValue(null);

    const res = await request(app).put("/users/1").send({ name: "John Updated" });
    expect(res.status).toBe(404);
  });

  test("should return 500 if updateUser throws an error", async () => {
    userService.updateUser.mockRejectedValue(new Error("Update failed"));

    const res = await request(app).put("/users/1").send({ name: "New Name" });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Update failed" });
  });

  test("should delete a user", async () => {
    userService.deleteUser.mockResolvedValue(true);

    const res = await request(app).delete("/users/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "User deleted successfully" });
  });

  test("should return 404 when deleting a non-existing user", async () => {
    userService.deleteUser.mockResolvedValue(null);

    const res = await request(app).delete("/users/1");
    expect(res.status).toBe(404);
  });

  test("should return 500 if deleteUser throws an error", async () => {
    userService.deleteUser.mockRejectedValue(new Error("Deletion failed"));

    const res = await request(app).delete("/users/1");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Deletion failed" });
  });
});
