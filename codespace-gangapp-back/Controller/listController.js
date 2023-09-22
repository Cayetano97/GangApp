const express = require("express");
const router = express.Router();

const List = require("../Model/listModel");
const Product = require("../Model/productModel");
const { verifyToken, isAdmin } = require("../lib/utils");

// Get listas, ordenada por fecha

router.get("/list/:id_user", verifyToken, async (req, res) => {
  try {
    const id = req.params.id_user;
    const data = await List.find({ id_user: id }).sort({ createdAt: -1 });
    res.status(200).json({ status: "Success get lists", data, error: null });
  } catch (error) {
    res.status(404).json({ status: "Failed get lists", data: null, error });
  }
});

// Get última lista

router.get("/lastlist/:id_user", verifyToken, async (req, res) => {
  try {
    const id = req.params.id_user;
    const data = await List.find({ id_user: id })
      .sort({ createdAt: -1 })
      .limit(1);
    res
      .status(200)
      .json({ status: "Success get last list", data, error: null });
  } catch (error) {
    res.status(404).json({ status: "Failed get last list", data: null, error });
  }
});

// Get lista por ID

router.get("/lists/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await List.find({ _id: id });
    res
      .status(200)
      .json({ status: "Success get list by ID", data, error: null });
  } catch (error) {
    res
      .status(404)
      .json({ status: "Failed get list by ID", data: null, error });
  }
});

// Crear lista

router.post("/list", verifyToken, async (req, res) => {
  try {
    const data = new List({
      id_user: req.body.id_user,
      id_products: req.body.id_products,
      name_list: req.body.name_list,
      status: req.body.status,
      ticket: req.body.ticket,
      supermarkets: req.body.supermarkets,
    });
    const datasave = await data.save();
    res.status(200).json({ status: "Success list", datasave, error: null });
  } catch (error) {
    res.status(400).json({ status: "Error list", datasave: null, error });
  }
});

// Get lista por ID enviandole supermercado - issue #25

router.get("/listsmarket/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const listaUser = await List.find({ _id: id });
    const listaProducto = await Product.find();
    const marketCount = {};
    const priceCount = {};
    const listShopping = listaUser[0].id_products;

    listShopping.forEach((product) => {
      listaProducto.forEach((listItem) => {
        if (listItem.name_product === product.name) {
          listItem.market.forEach((market) => {
            if (marketCount[market.name_market]) {
              marketCount[market.name_market] += 1;
              priceCount[market.name_market] += market.price;
            } else {
              marketCount[market.name_market] = 1;
              priceCount[market.name_market] = market.price;
            }
          });
        }
      });
    });

    const data = {
      marketCount,
      priceCount,
    };

    res.status(200).json({
      status: "Success get list by ID",
      data: data,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ status: "Failed get list by ID", data: null, error: error });
  }
});

// Patch lista por ID

router.patch("/list/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    const data = await List.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { new: true, upsert: false },
      {returnOrigintal: true}
    );
    res.status(200).json({ status: "Success update list", data, error: null });
  } catch (error) {
    res.status(400).json({ status: "Failed update list", data: null, error });
  }
});

// Delete lista por ID

router.delete("/list/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await List.deleteOne({ _id: id });
    res.status(200).json({ status: "Success delete list", data, error: null });
  } catch (error) {
    res.status(400).json({ status: "Failed delete list", data: null, error });
  }
});

// Obtener el numero total de listas creadas por el usuario

router.get("/total_lists/:id_user", verifyToken, async (req, res) => {
  try {
    const id = req.params.id_user;
    const data = await List.find({ id_user: id }).countDocuments();
    res
      .status(200)
      .json({ status: "Success getting total lists", data, error: null });
  } catch (error) {
    res
      .status(404)
      .json({ status: "Failed getting total lists", data: null, error });
  }
});

// Obtener el numero total de listas guaradas por el usuario

router.get("/total_lists_saved/:id_user", verifyToken, async (req, res) => {
  try {
    const id = req.params.id_user;
    const data = await List.find({
      id_user: id,
      status: "Guardada",
    }).countDocuments();
    res
      .status(200)
      .json({ status: "Success getting total lists saved", data, error: null });
  } catch (error) {
    res
      .status(404)
      .json({ status: "Failed getting total lists saved", data: null, error });
  }
});

// Obtener el numero total de listas comprando por el usuario

router.get("/total_lists_shopping/:id_user", verifyToken, async (req, res) => {
  try {
    const id = req.params.id_user;
    const data = await List.find({
      id_user: id,
      status: "Comprando",
    }).countDocuments();
    res.status(200).json({
      status: "Success getting total lists shopping",
      data,
      error: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed getting total lists shopping",
      data: null,
      error,
    });
  }
});

// Obtener el numero total de listas finalizadas por el usuario

router.get("/total_lists_finished/:id_user", verifyToken, async (req, res) => {
  try {
    const id = req.params.id_user;
    const data = await List.find({
      id_user: id,
      status: "Finalizada",
    }).countDocuments();
    res.status(200).json({
      status: "Success getting total lists finished",
      data,
      error: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed getting total lists finished",
      data: null,
      error,
    });
  }
});

// Obtener el supermercado mas usado por el usuario

router.get("/most_used_market/:id_user", verifyToken, async (req, res) => {
  try {
    const id = req.params.id_user;
    const listaUser = await List.find({ id_user: id });
    const listaProducto = await Product.find();
    const marketCount = {};
    const priceCount = {};
    const listShopping = listaUser[0].id_products;

    listShopping.forEach((product) => {
      listaProducto.forEach((listItem) => {
        if (listItem.name_product === product.name) {
          listItem.market.forEach((market) => {
            if (marketCount[market.name_market]) {
              marketCount[market.name_market] += 1;
              priceCount[market.name_market] += market.price;
            } else {
              marketCount[market.name_market] = 1;
              priceCount[market.name_market] = market.price;
            }
          });
        }
      });
    });

    const data = {
      marketCount,
      priceCount,
    };

    const mostUsedMarket = Object.keys(data.marketCount).reduce((a, b) =>
      data.marketCount[a] > data.marketCount[b] ? a : b
    );

    res.status(200).json({
      status: "Success getting most used market",
      data: mostUsedMarket,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "Failed getting most used market",
      data: null,
      error: error,
    });
  }
});

// Obtener la media que un usuario se ha ahorrado en sus listas

router.get("/totalmedia/:id_user", verifyToken, async (req, res) => {
  try {
    const id = req.params.id_user;
    const data = await List.find({ id_user: id });
    let media = 0;
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      total += data[i].total;
    }
    media = total / data.length;
    res.status(200).json({ status: "Success get media", media, error: null });
  } catch (error) {
    res.status(404).json({ status: "Failed get media", media: null, error });
  }
});

// Obtener el total que un usuario se ha ahorrado en sus listas

router.get("/totalsave/:id_user", verifyToken, async (req, res) => {
  try {
    const id = req.params.id_user;
    const data = await List.find({ id_user: id });
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      total += data[i].total;
    }
    res.status(200).json({ status: "Success get total", total, error: null });
  } catch (error) {
    res.status(404).json({ status: "Failed get total", total: null, error });
  }
});

// Obtener el histórico de listas finalizadas por el usuario mostrando los siguientes datos fecha, cantidad y  supermercado de cada una de las listas

router.get("/historyList/:id_user", async (req, res) => {
  try {
    const id = req.params.id_user;
    const historyLists = await List.find({
      id_user: id,
      status: "Finalizada",
    }).select("supermarkets name_list createdAt");

    // Mapeo de los resultados para obtener los datos que necesitamos
    const historyListsMap = historyLists.map((list) => {
      return {
        supermarkets: list.supermarkets,
        name_list: list.name_list,
        createdAt: list.createdAt,
      };
    });

    res.status(200).json({
      status: "Success get history",
      data: historyListsMap,
      error: null,
    });
  } catch (error) {
    res.status(404).json({ status: "Failed get history", data: null, error });
  }
});

//ROLE ADMIN

// Get listas de todos los usuarios

router.get("/all_lists", verifyToken, isAdmin, async (req, res) => {
  try {
    const data = await List.find({});
    res
      .status(200)
      .json({ status: "Success getting all lists", data, error: null });
  } catch (error) {
    res
      .status(404)
      .json({ status: "Failed getting all lists", data: null, error });
  }
});

module.exports = router;
