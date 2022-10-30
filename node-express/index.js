import express from "express";
import { customAlphabet } from "nanoid/async";
import pg from "pg";
const { Pool } = pg;

// CONSTANTS
const BITLY_LEN = 5; // should not be 6 to avoid collisions with 'random'

const app = express();
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", BITLY_LEN);
const port = process.env.PORT || 4000;

app.use(express.static("public"));
app.use(express.json());

const pool = new Pool();

function isBitlyOk(bitly) {
  return true;
}

async function generateBitly() {
  let bitly = await nanoid();
  while (!isBitlyOk(bitly)) bitly = nanoid();
  return bitly;
}

async function saveUrl(body) {
  const bitly = await generateBitly();
  return {
    url: body.url,
    bitly: bitly,
  };
}

function getEntry(bitly) {
  return {
    bitly,
    url: "http://placeholder.com",
  };
}

async function getRandom() {
  return {
    bitly: "bitly",
    url: "http://placeholder.com",
  };
}

app.post("/api/url", async (req, res) => {
  const bitly = await saveUrl(req.body);
  return res.status(201).json(bitly);
});

app.post("/random", (req, res) => {
  const entry = getRandom();
  return res.status(200).json(entry);
});

app.get("/:bitly", async (req, res) => {
  const entry = await getEntry(req.params.bitly);
  return res.redirect(entry.url);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

process.stdin.resume(); //so the program will not close instantly
async function exitHandler() {
  await pool.end();
}
process.on("exit", exitHandler);
process.on("SIGINT", exitHandler);
process.on("SIGUSR1", exitHandler);
process.on("SIGUSR2", exitHandler);
