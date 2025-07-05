import mongoose from "mongoose";
import app from "./app";
import config from "./config";

const main = async () => {
  try {
    await mongoose.connect(config.database_url!);
    console.log("Sucessfully Connected to db");
  } catch (error) {
    console.log(error);
  }
};
main();

app.listen(config.port, () => {
  console.log(`Express Basic Server Is Running`);
});
