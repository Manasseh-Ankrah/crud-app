import mongoose from "mongoose";

const cardSchema = mongoose.Schema({
  name: String,
  imgUrl: String,
  newId: Number,
});

export default mongoose.model("cards", cardSchema);
