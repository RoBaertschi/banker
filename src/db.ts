import { MongoClient } from "mongodb"

const connectionString = "mongodb://127.0.0.1:27017/?directConnection=true"

const mongo = new MongoClient(connectionString);

const db = mongo.db("appDatabase");
const users = db.collection("Users");
const accounts = db.collection("Accounts");

export type User = {
    _id: string,
    name: string;
    email: string;
    address: string;
    date_of_birth: Date,
    created_at: Date,
    updated_at: Date,
    is_verified: boolean,
    accounts: string[],
};

//{
//    _id: "67dc0545207f868abb6360dd",
//    name: "Mr. Rodney Dare",
//    email: "Greyson5@yahoo.com",
//    address: "544 N Pine Street",
//    date_of_birth: "1982-10-23T00:30:48.434Z",
//    created_at: "2025-03-20T12:08:37.312Z",
//    updated_at: "2025-03-20T12:08:37.312Z",
//    is_verified: true,
//    accounts: [ "67dc0545207f868abb63608c", "67dc0545207f868abb6360ac", "67dc0545207f868abb6360a1" ]

export { mongo, users, accounts };
