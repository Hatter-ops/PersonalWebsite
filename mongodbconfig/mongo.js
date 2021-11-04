const mongodbClient = require("mongodb");

const url = "mongodb://127.0.0.1:27017/";
const client = new mongodbClient.MongoClient(url);


function run() {

    client.connect();
    console.log("Connected to db");
    const db = client.db("Users");
    const dbCollection = db.collection("users");

}