import mongoose from "mongoose";

const connection_url =
  "mongodb+srv://admin:KJYQYIPgdgkkbfID@cluster0.pwmw9.mongodb.net/tinderdb?retryWrites=true&w=majority";

const connectToDb = async () => {
  try {
    await mongoose.connect(connection_url, {
      useNewURLParser: true,
      //   useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log("Connected online to mongoDB");
  } catch (error) {
    console.log(error.message);
    // process.exit(1);
  }
};

export default connectToDb;
