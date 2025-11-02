import express from "express";
import Group from "../models/groupModel.js";

const router = express.Router();

// ➕ Create new group
router.post("/", async (req, res) => {
  try {
    const { name, members, createdBy } = req.body;
    const group = await Group.create({ name, members, createdBy });
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 📜 Get all groups of a user
router.get("/:userId", async (req, res) => {
  try {
    const groups = await Group.find({ createdBy: req.params.userId });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
