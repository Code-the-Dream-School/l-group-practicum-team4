const Item = require("../models/Item");

const createTestItem = async (req, res) => {
  const itemJSON = {
    name: "test",
    description: "test item",
    coinCost: 1,
    stat: "health",
    value: 2
  };
  try {
    const newItem = await Item.create(itemJSON);
    res.json(newItem);
  } catch (e) {
    console.log(e);
    res.json("Could not create new item");
  }
};

const getTestItem = async (req, res) => {
  const itemData = await Item.find();
  res.json(itemData);
};

module.exports = { createTestItem, getTestItem };
