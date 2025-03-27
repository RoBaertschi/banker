import { MongoClient } from "mongodb";

const DB_HOST = process.env["DB_HOST"] || "127.0.0.1";
const DB_PORT = process.env["DB_PORT"] || "27017";

const connectionString = `mongodb://${DB_HOST}:${DB_PORT}/?directConnection=true`;
console.log(connectionString);
const mongo = new MongoClient(connectionString);

const db = mongo.db("appDatabase");
const users = db.collection("Users");
const accounts = db.collection("Accounts");

export type User = {
  _id: string;
  name: string;
  email?: string | undefined;
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
//{
//    _id: '67dc0545207f868abb6360c5',
//    owners: [ '67dc0545207f868abb6360cb' ],
//    transactions: [
//      {
//        _id: '67dc0545207f868abb6360c6',
//        type: 'debit',
//        amount: { '$numberDecimal': '2664.11' },
//        timestamp: { '$timestamp': '7483862474693804033' },
//        description: 'Transaction alert: invoice at Schoen Group using card ending ****0928 for an amount of EUR 863.94 on account ***6897.'
//      },
//      {
//        _id: '67dc0545207f868abb6360c7',
//        type: 'debit',
//        amount: { '$numberDecimal': '497.25' },
//        timestamp: { '$timestamp': '7483862474693804033' },
//        description: 'invoice processed at Kassulke - Von for NGN 730.90, using card ending ****3981. Account: ***0636.'
//      },
//      {
//        _id: '67dc0545207f868abb6360c8',
//        type: 'debit',
//        amount: { '$numberDecimal': '431.56' },
//        timestamp: { '$timestamp': '7483862474693804033' },
//        description: 'Your withdrawal of MXN 214.74 at Weimann, Rath and Terry was successful. Charged via card ****0020 to account ***8612.'
//      },
//      {
//        _id: '67dc0545207f868abb6360c9',
//        type: 'credit',
//        amount: { '$numberDecimal': '1914.63' },
//        timestamp: { '$timestamp': '7483862474693804033' },
//        description: 'deposit at Hyatt - Quitzon with a card ending in ****9912 for GYD 181.12 from account ***8445.'
//      }
//    ],
//    number: 502646,
//    description: 'Tenuis alter contego thesis tutis aperiam virga somniculosus tricesimus adnuo.',
//    balance: { '$numberDecimal': '7787.99' },
//    currency: 'ARS',
//    created_at: { '$timestamp': '7483862474693804033' },
//    updated_at: { '$timestamp': '7483862474693804033' }
//  }

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
