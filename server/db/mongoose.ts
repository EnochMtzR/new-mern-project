import * as mongoose from "mongoose";

export const connectDB = () => {
  mongoose.set("useCreateIndex", true);
  mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true }
  );
};
