const express = require("express");
const router = express.Router();

// Get products

router.get("/healthy", async (req, res) => {
  res.sendStatus(200);
});

module.exports = router;