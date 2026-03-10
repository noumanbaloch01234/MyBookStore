import express from "express";
import mongoose from "mongoose";
import cors from "cors"

import bookRoute from "./route/Book.route.js"
import userRoute from "./route/User.route.js"

const PORT = 4000;
const app = express();

app.use(cors());
app.use(express.json());

// Body parser
app.use(express.json());

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `mongodb+srv://noumansher01234_db_user:L9REkWS0X4gaqeDc@clusterone.0iqjqvo.mongodb.net/`
    );
    console.log(`MongoDB Connected:`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

app.use("/book", bookRoute)
app.use("/users",userRoute)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ES Module export
export default connectDB;
