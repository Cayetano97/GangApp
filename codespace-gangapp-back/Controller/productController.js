const express = require("express");
const router = express.Router();

const Product = require("../Model/productModel");
const { verifyToken, isAdmin } = require("../lib/utils");

// Get products

router.get("/product/:supermarket", verifyToken, async (req, res) => {
  try {
    const supermarket = req.params.supermarket
    if(supermarket != 'ALL'){
      const data = await Product.find({'market.name_market': supermarket}).limit(10);
      res
        .status(200)
        .json({ status: "Success get all products", data, error: null });
    }else {
      const data = await Product.find().limit(10);
      res
        .status(200)
        .json({ status: "Success get all products", data, error: null });
    }
  } catch (error) {
    console.log(error)
    res
      .status(404)
      .json({ status: "Failed get all products", data: null, error });
  }
});

// Get products by name

router.get("/products/:name", verifyToken, async (req, res) => {
  try {
    const name = req.params.name;
    const regex = new RegExp(name, "i"); //"RegExp" crea un objeto de expresión regular para que coincida con el texto con un patrón
    const data = await Product.find({ name_product: regex }); // Busca todos los productos que contengan el nombre indicado
    res
      .status(200)
      .json({ status: "Success get all products", data, error: null });
  } catch (error) {
    res
      .status(404)
      .json({ status: "Failed get all products", data: null, error });
  }
});

// Get products by name without regex

router.get("/productsfind/:name", verifyToken, async (req, res) => {
  try {
    const name = req.params.name;
    const data = await Product.find({ name_product: name });
    res
      .status(200)
      .json({ status: "Success get all products", data, error: null });
  } catch (error) {
    res
      .status(404)
      .json({ status: "Failed get all products", data: null, error });
  }
});

// Get products by market

router.get("/supermarkets", verifyToken, async (req, res) => {
  try {
    const supermarkets = await Product.aggregate([
      { $unwind: "$market" },
      { $group: { _id: "$market.name_market" } },
    ]);

    // const supermarkets = await Product.find({
    //   "market.name_market": { $exists: true },
    // }).distinct("market.name_market");

    const supermarketNames = supermarkets.map((supermarket) => supermarket._id);
    console.log(supermarketNames);
    console.log(supermarkets);
    res.status(200).json({
      status: "Success get all supermarkets",
      data: supermarkets,
      error: null,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "Failed to get supermarkets", error: error.message });
  }
});

//ROLE ADMIN

//Crear nuevo producto

router.post("/newproduct", verifyToken, isAdmin, async (req, res) => {
  try {
    const newProduct = new Product({
      name_product: req.body.name_product,
      url: req.body.url,
      market: req.body.market,
    });
    const datasave = await newProduct.save();
    res
      .status(200)
      .json({ status: "Success new product", datasave, error: null });
  } catch (error) {
    res
      .status(401)
      .json({ status: "Failed create new product", datasave: null, error });
  }
});

//Actualizar productos

router.patch("/product/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const id_product = req.params.id;
    const data = await Product.updateOne(
      { _id: id_product },
      { $set: req.body }
    );
    res
      .status(200)
      .json({ status: "Success updating product", data, error: null });
  } catch (error) {
    res
      .status(401)
      .json({ status: "Failed updating product", data: null, error });
  }
});

//Eliminar productos por ID

router.delete("/productdelete/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const id_product = req.params.id;
    const data = await Product.deleteOne({ _id: id_product });
    res
      .status(200)
      .json({ status: "Success deleting product", data, error: null });
  } catch (error) {
    res
      .status(401)
      .json({ status: "Failed deleting product", data: null, error });
  }
});

module.exports = router;
