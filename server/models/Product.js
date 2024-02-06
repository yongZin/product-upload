const mongoose = require("mongoose");

const ProductSchma = new mongoose.Schema(
	{
    user: {
			_id: { type: mongoose.Types.ObjectId, required: true, index: true },
			name: { type: String, required: true },
			userID: { type: String, required: true },
		},
		key: { type: String, required: true },
		likes: [{ type: mongoose.Types.ObjectId }],
    name: { type: String, required: true },
    price: { type: String, required: true },
    mainImages: [
      {
        key: { type: String, required: true },
        filename: { type: String, required: true },
        originalname: { type: String, required: true },
      },
    ],
    detailImages: [
      {
        key: { type: String, required: true },
        filename: { type: String, required: true },
        originalname: { type: String, required: true },
      },
    ],
    details: [{ type: String, required: true }],
    type: { type: String, required: true },
    material: { type: String, required: true },
    color: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchma);