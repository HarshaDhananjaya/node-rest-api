const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validateUser = require("../middlewares/validateUser"); // Import validation middleware

router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);

// Apply validation middleware for POST and PUT requests
router.post("/", validateUser, userController.createUser);
router.put("/:id", validateUser, userController.updateUser);

router.delete("/:id", userController.deleteUser);

module.exports = router;
