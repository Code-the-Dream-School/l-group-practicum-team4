const express = require("express");
const router = express.Router();

const { createTestItem, getTestItem } = require("../controllers/item");

router.route("/makeTest").get(createTestItem);
router.route("/getTest").get(getTestItem);

module.exports = router;
