import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  id: Number,
  name: String,
  title: String,
  price: Number,
  category: String,
  image:String,
  
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
