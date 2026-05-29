const Item = require("../models/Item");

const getAllItems = async (req, res) => {
  const items = await Item.find();
  res.status(200).json({ items, count: items.length });
};

const getItem = async (req, res) => {
  const {
    params: { id: itemId }
  } = req;
  const item = await Item.findOne({ _id: itemId });
  if (!item) {
    res.status(404).json({ message: "Item not found" });
    return;
  }
  res.status(200).json({ item });
};

const createItem = async (req, res) => {
  const item = await Item.create(req.body);
  res.status(201).json({ item });
};

const updateItem = async (req, res) => {
  const {
    params: { id: itemId }
  } = req;
  const item = await Item.findOneAndUpdate({ _id: itemId }, req.body, {
    returnDocument: "after",
    runValidators: true
  });
  if (!item) {
    res.status(404).json({ message: "Item not found" });
    return;
  }
  res.status(200).json({ item });
};

const deleteItem = async (req, res) => {
  const {
    params: { id: itemId }
  } = req;
  const item = await Item.findOneAndDelete({ _id: itemId });
  if (!item) {
    res.status(404).json({ message: "Item not found" });
    return;
  }
  res.status(200).json({ message: "Item successfully deleted" });
};

module.exports = { getAllItems, getItem, createItem, updateItem, deleteItem };
