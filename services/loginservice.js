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
            console.log(username.hash);
            try {
                const db = client.db("Users")
                const passwdHash = await db.collection("users").findOne({ "username": username });
                if (!passwdHash) {
                    res.sendStatus(403).redirect("/login");
                }
                console.log(passwdHash.hash)
                const compirePassword = await bcrypt.compareSync(passw, passwdHash.hash);
                //console.log(compirePassword)
                if (compirePassword) {
                    const token = jwt.sign({ user: passwdHash.username, admin: passwdHash.admin }, privateKey)
                    console.log(token)
                    res.cookie("token", token);
                    res.redirect("/secret")
                } else {
                    res.sendStatus(403).redirect("/login");
                }
            } catch (err) {
                console.log(err)
                res.redirect("/")
            }
        })
    }
}

function authentication(req, res, next) {
    jwt.verify(req.cookies.token, privateKey, (err, decode) => {
        console.log(decode.user)
        console.log(decode.admin)
        if (err) {
            console.log(err);
            res.sendStatus(404);
        } else if (decode.user === "Admin" && decode.admin === true) { next() }

    })
}

module.exports = {
    adminlogin: adminlogin,
    authentication: authentication,
    login: login
}