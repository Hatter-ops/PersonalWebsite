const express = require("express");
const path = require("path")
const serveIndex = require("serve-index")
const auth = require("./services/loginservice")
const logging = require("./services/logging")
const http = require("http")
const https = require("https")
const fs = require("fs")
const cookieParser = require("cookie-parser")


const privateKey = fs.readFileSync(path.join(__dirname, "/ssl/server.key"), "utf-8");
const certificate = fs.readFileSync(path.join(__dirname, "/ssl/server.crt"), "utf-8");
const credits = {key: privateKey, cert: certificate};
const app = express();
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credits, app);
const port = 3000;

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "public/pages"))

app.use(cookieParser())
app.use(express.static("public/images"));
app.use(express.static("public"));
app.use("/scripts/", express.static(path.join(__dirname, "public/scripts")))
app.use("/secret", auth.authentication, serveIndex(path.join(__dirname, "secret")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logging.logging)


app.get("/", (req, res) => {
    const reqHeader = JSON.stringify(req.headers);
    console.log(`${reqHeader}`);
    res.render("index");
})

app.get("/login", (req, res) => {
    res.render("login");
})

app.post("/poster", auth.adminlogin, (req, res) => {
    res.redirect("/");
});

app.post("/stolencookie", (req, res) => {
    console.log(req.body);
    res.cookie
    res.sendStatus(200);
})

app.get("/secret/:name", auth.authentication, (req, res) => {
    res.sendFile(path.join(__dirname, "secret/" + req.params.name));
    console.log(path.join(__dirname, "secret/" + req.params.name));
});



httpServer.listen(3000, () => {
    console.log(`Server is running on port ${3000}.`);
});
httpsServer.listen(3001, () => {
    console.log(`Server is running on port ${3001}.`);
});

