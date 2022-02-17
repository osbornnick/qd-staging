import express from "express";
import fs from "fs";
import crypto from "crypto";
import path from "path";
import { nextTick } from "process";

let app = express();
app.use(express.json());
app.use(express.static("dist"));

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

app.use((req, res, next) => {
    req.ip = ""; // obfuscate the IP
    next();
});

app.get("/api/id", (req, res) => {
    let id = crypto.randomBytes(9).toString("hex");
    if (blockRandom.length == 0) {
        blockRandom = [0, 1];
        shuffleArray(blockRandom);
    }
    id += blockRandom.pop();
    res.json({ id });
});

app.post("/api/log", (req, res) => {
    fs.writeFile(
        "./log.txt",
        JSON.stringify(req.body) + "\n",
        { flag: "a+" },
        (err) => {
            if (err) {
                console.error(err);
                return;
            } else {
                res.sendStatus(200);
            }
        }
    );
});

const PORT = 4000;
app.listen(process.env.PORT || PORT);
