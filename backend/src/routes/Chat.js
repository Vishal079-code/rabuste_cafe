const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  console.log("✅ CHAT ROUTE HIT");
  res.json({ reply: "Coffee Buddy connected ☕" });
});

module.exports = router;
