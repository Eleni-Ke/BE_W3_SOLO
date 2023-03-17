import mongoose from "mongoose";

const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    comment: { type: String, required: true },
    rate: {
      type: Number,
      required,
      validate: {
        validator: function (rate) {
          return [1, 2, 3, 4, 5].includes(rate);
        },
        message: "Unit must be a whole number from 1 to 5.",
      },
    },
  },
  { timestamps: true }
);

export default model("Reviews", reviewSchema);
