import mongoose from "mongoose";

export async function connect() {
  // const response = await mongoose.connect(process.env.MONGODB_URI!);

  // const connectDb = response.connection;

  // connectDb.on("connected", () => {
  //   console.log("Database connected!");
  // });

  // connectDb.on("error", (error) => {
  //   console.log("Connection Error, Please make sure db is running" + error);
  //   process.exit(1);
  // });
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Already Connected!");
    return;
  }

  if (connectionState === 2) {
    console.log("Connecting...");
    return;
  }

  try {
    mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "next14restapi",
      bufferCommands: true,
    });

    console.log("Connected!");
  } catch (error: any) {
    console.log("DB connection failed!", error.message);
    throw new Error("Error: ", error);
  }
}
