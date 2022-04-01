import express from "express";
import fs from "fs";
import crypto from "crypto";
import path from "path";
import http from "http";
import https from "https";
import { exit } from "process";

let app = express();
app.use(express.json());
app.use(express.static("dist"));

// (2n) different values, visible game1, invisible game1, visible game2, invisible game2
let blockRandom: number[] = [];

// from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array: number[]) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// app.use((req, res, next) => {
//     req.ip;
//     next();
// });

app.get("/api/id", (req, res) => {
    let id = crypto.randomBytes(9).toString("hex");
    if (blockRandom.length == 0) {
        blockRandom = [0, 1, 2, 3];
        shuffleArray(blockRandom);
    }
    id += blockRandom.pop();
    res.json({ id });
});

app.post("/api/log", (req, res) => {
    let data = req.body;
    data.server_time = new Date();
    fs.writeFile(
        path.join(__dirname, "log.txt"),
        JSON.stringify(data) + "\n",
        { flag: "a+" },
        (err) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        }
    );
});

const PORT = process.env.PORT || 4000;
let server;
if (process.env.NODE_ENV === "prod") {
    if (typeof process.env.SSLKEY === "undefined") {
        console.log("SSLKEY env variable must be defined to run with https");
        exit(1);
    }
    if (typeof process.env.SSLCERT === "undefined") {
        console.log("SSLCERT env variable must be defined to run with https");
        exit(1);
    }

    console.log("Starting in production mode, serving https");
    let key = fs.readFileSync(process.env.SSLKEY, "utf8");
    let cert = fs.readFileSync(process.env.SSLCERT, "utf8");
    server = https.createServer({ key, cert }, app);
} else {
    console.log("Starting in development mode, serving http");
    server = http.createServer(app);
}

server.listen(PORT);
