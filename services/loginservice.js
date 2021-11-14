const bcrypt = require("bcrypt");
const { readFileSync } = require("fs");
const jwt = require("jsonwebtoken")
const mongoClient = require("mongodb").MongoClient;
//const cookieParser = require("cookie-parser")
//const express = express()
const privateKey = readFileSync("./ssl/server.key");
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());


function adminlogin(req, res, next) {

    const passwdHash = "$2a$12$ZPRYqQWDF/l/eu/255BeGeXtOye3GwWBxkXOSCbNvChMxHA2tz1m.";
    const passw = req.body.password;
    const username = req.body.username;
    if (bcrypt.compareSync(passw, passwdHash) && username === "admin") {
        const token = jwt.sign({ user: username, admin: true }, privateKey)
        res.cookie("token", token);
        console.log("Did something")
        res.sendStatus(200).end();
    } else {
        console.log("Nope");
        res.sendStatus(404).end()
    }
    next();
};

async function login(req, res) {
    const mongodbUrl = "mongodb://127.0.0.1/Users";
    const passw = req.body.password;
    const username = req.body.username;
    console.log(passw);
    console.log(username);
    if ((username && passw)) {
        await mongoClient.connect(mongodbUrl, async(err, client) => {
            console.log(passw);
            console.log(username);
            const db = client.db("Users")
            const passwdHash = await db.collection("users").findOne({ "username": username });
            console.log(passwdHash.hash)
            const compirePassword = await bcrypt.compareSync(passw, passwdHash.hash);
            //console.log(compirePassword)
            if (compirePassword) {
                res.redirect("/secret/")
                res.send(dbCollection);
                console.log(dbCollection);
            } else {
                res.redirect("/login")
            }
        })
    }
}

function authentication(req, res, next) {
    jwt.verify(req.cookies.token, privateKey, (err, decode) => {
        if (err) {
            console.log(err);
            res.sendStatus(404);
        } else if (decode.user === "admin" && decode.admin === true) {
            next();
        }

    })
}

module.exports = {
    adminlogin: adminlogin,
    authentication: authentication,
    login: login
}