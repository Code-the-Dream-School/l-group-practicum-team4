const express = require("express");
const router = express.Router();

const { createTestChar, getTestChar } = require("../controllers/character");

router.route("/makeTest").get(createTestChar);
router.route("/getTest").get(getTestChar);

module.exports = router;
