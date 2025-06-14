const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/rolesMiddleware");

router.get("/admin-tasks", authMiddleware, roleMiddleware("admin"), (req, res) => {
  res.json({ msg: "This is visible only to admins" });
});

router.get("/employee-tasks", authMiddleware, roleMiddleware("employee"), (req, res) => {
  res.json({ msg: "Welcome Employee! These are your tasks" });
});

module.exports = router;
