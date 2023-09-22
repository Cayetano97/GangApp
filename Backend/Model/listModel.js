const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listSchema = new Schema(
  {
    id_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    id_products: {
      type: Object,
      required: true,
      properties: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "products",
        },
        name: { type: String, required: true },
      },
    },
    name_list: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: ["Guardada", "Comprando", "Finalizada"],
    },
    price: {
      type: Number,
    },
    ticket: {
      type: {
        url: String,
        addedAt: Date,
      },
      default: {
        url: "",
        addedAt: "",
      },
    },
    supermarkets: {
      type: [
        {
          type: String,
          enum: ["Mercadona", "Lidl", "Aldi", "Dia"],
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const List = mongoose.model("List", listSchema, "list");
module.exports = List;
