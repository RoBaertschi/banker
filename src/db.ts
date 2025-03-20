import { MongoClient } from "mongodb";

const connectionString = "mongodb://127.0.0.1:27017/?directConnection=true";
const mongo = new MongoClient(connectionString);

const db = mongo.db("appDatabase");
const users = db.collection("Users");
const accounts = db.collection("Accounts");

export type User = {
  _id: string;
  name: string;
  email: string;
  address: string;
  date_of_birth: Date;
  created_at: Date;
  updated_at: Date;
  is_verified: boolean;
  accounts: string[];
};

async function connectToMongo() {
  try {
    await mongo.connect();
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

connectToMongo();

export { mongo, users, accounts };
