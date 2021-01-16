import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.end("Hello Damn World..");
});

app.listen(3000, () => console.log("YEAP"));