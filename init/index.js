const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// connection to database
const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(() => {
  console.log("connection to Database");
})
.catch((err) => {
  console.log(err);
})
async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async() => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj, owner : "6a9919d81369998424c6115a",
  }));

  await Listing.insertMany(initData.data);
  console.log("data was initialzed");
};
initDB();