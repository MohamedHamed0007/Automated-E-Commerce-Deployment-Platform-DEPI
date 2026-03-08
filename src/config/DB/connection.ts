import mongoose from "mongoose";
import { env } from "../env/env";

export const connectDB = async (): Promise<void> => {
  const mongoURI = env.MONGO_URI;
  
  if (!mongoURI) {
    console.error("MONGO_URI is missing from environment config");
    return;
  }

  await mongoose.connect(mongoURI).then(()=>{
      console.log("MongoDB Connected 🚀");
  }).catch((err)=>{
        console.error("MongoDB Connection Error: ", err);
  });
};