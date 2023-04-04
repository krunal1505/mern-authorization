import app from "./app";
import env from "./utils/validateEnv";
import mongoose from "mongoose";

const port = env.PORT || 5000;

mongoose
  .connect(env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => {
      console.log(`Server started at port: ${port}`);
    });
  })
  .catch(console.error);
