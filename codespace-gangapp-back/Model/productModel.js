const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name_product: {
      type: String,
    },
    url: {
      type: String,
    },
    market: {
      type: [
        {
          name_market: String,
          id_market: Number,
          price: Number,
          date: Date,
        }
      ],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
