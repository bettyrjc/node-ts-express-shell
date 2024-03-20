import mongoose from "mongoose";

interface Options {
  mongoUrl: string;
  dbName: string;
}

export class MongoDatabase {
  static async connect(options: Options) {
    const { mongoUrl, dbName } = options;

    try {
      await mongoose.connect(mongoUrl, {
        dbName,
      });
      // console.log('Mongo conected')
    } catch (error) {
      console.log("Mongo conection error", error);
      throw error;
    }
  }
  static async disconnect() {
    await mongoose.disconnect();
  }
}
