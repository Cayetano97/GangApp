const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SalesSchema = new Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    id_products: {
      type: String,
    },
    name: {
      type: String,
    },
    url: {
      type: String,
    },
    market: {
      type: [String],
    },
    brand: {
      type: String,
    },
    price_original: {
      type: Number,
    },
    price_discount: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    start_discount: {
      type: Date,
    },
    end_discount: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Sales = mongoose.model("Sales", SalesSchema, "sales");

module.exports = Sales;
