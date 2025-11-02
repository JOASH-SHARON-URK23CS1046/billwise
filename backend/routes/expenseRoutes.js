import express from "express";
const router = express.Router();

// Temporary in-memory expenses (for testing)
let expenses = [];

// ✅ GET all expenses
router.get("/", (req, res) => {
  res.json(expenses);
});

// ✅ POST add expense
router.post("/", (req, res) => {
  const { title, amount, payer, participants } = req.body;
  if (!title || !amount || !payer || !participants) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const newExpense = { title, amount, payer, participants, date: new Date() };
  expenses.push(newExpense);
  res.json({ message: "Expense added successfully", expense: newExpense });
});

// ✅ DELETE all expenses (optional for testing)
router.delete("/", (req, res) => {
  expenses = [];
  res.json({ message: "All expenses cleared" });
});

export default router;
