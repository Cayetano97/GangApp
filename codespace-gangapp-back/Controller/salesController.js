const express = require("express");
const router = express.Router();
const Sales = require("../Model/salesModel");
const { verifyToken, isAdmin } = require("../lib/utils");

// Get sales by market name

router.get("/sales/:name", verifyToken, async (req, res) => {
  try {
    const name = req.params.name;
    const data = await Sales.find({ market: name });
    res.status(200).json({ status: "Success get market", data, error: null });
  } catch (error) {
    res.status(404).json({ status: "Failed get market", data: null, error });
  }
});

// Get all sales

router.get("/sales", verifyToken, async (req, res) => {
  try {
    const data = await Sales.find();
    res
      .status(200)
      .json({ status: "Success get all sales", data, error: null });
  } catch (error) {
    res.status(404).json({ status: "Failed get all sales", data: null, error });
  }
});

// GET sales unique brands

router.get("/salesunique", verifyToken, async (req, res) => {
  try {
    const data = await Sales.distinct("brand");
    res
      .status(200)
      .json({ status: "Success get all sales", data, error: null });
  } catch (error) {
    res.status(404).json({ status: "Failed get all sales", data: null, error });
  }
});

// Get random sales (preferences)

router.get("/sale/random", verifyToken, async (req, res) => {
  try {
    const data = await Sales.aggregate([{ $sample: { size: 5 } }]);
    res
      .status(200)
      .json({ status: "Success get 5 random sales", data, error: null });
  } catch (error) {
    res.status(404).json({ status: "Failed get all sales", data: null, error });
  }
});

// Get sales by ID

router.get("/salesid/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Sales.find({ _id: id });
    res
      .status(200)
      .json({ status: "Success get sale by ID", data, error: null });
  } catch (error) {
    res
      .status(404)
      .json({ status: "Failed get sale by ID", data: null, error });
  }
});

//Crear nueva oferta

router.post("/newsales", verifyToken, isAdmin, async (req, res) => {
  try {
    const newSales = new Sales({
      id_product: req.body.id_product,
      name: req.body.name,
      url: req.body.url,
      market: req.body.market,
      brand: req.body.brand,
      price_original: req.body.price_original,
      price_discount: req.body.price_discount,
      discount: req.body.discount,
      start_discount: req.body.start_discount,
      end_discount: req.body.end_discount,
    });
    const datasave = await newSales.save();
    res
      .status(200)
      .json({ status: "Success create new sale", datasave, error: null });
  } catch (error) {
    res
      .status(401)
      .json({ status: "Failed create new sale", datasave: null, error });
  }
});

module.exports = router;
