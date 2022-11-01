import Fastify from "fastify";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fastifyStatic from "@fastify/static";
import { customAlphabet } from "nanoid/async";
import pg from "pg";
const { Pool } = pg;

// CONSTANTS
const BITLY_LEN = 10; // should not be 6 to avoid collisions with 'random'
const BITLY_PREFIX = ">"; // fastify could not differentiate between '/' and '/:bitly' endpoints

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fastify = Fastify({
  logger: false,
});
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", BITLY_LEN);
const port = process.env.PORT || 4000;

const pool = new Pool();

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
});

async function generateBitly() {
  return BITLY_PREFIX + (await nanoid());
}

async function deleteAll() {
  await pool.query("TRUNCATE links;");
}

async function saveUrl(body) {
  const link = await getLinkByUrl(body.url);
  if (link) return link;
  const bitly = await generateBitly();
  try {
    await pool.query(
      `INSERT INTO links(url, bitly) VALUES('${body.url}', '${bitly}')`
    );
  } catch (err) {
    if (err.code === "23505") {
      // Duplicate error
      const bitly = await generateBitly();
      await pool.query(
        `INSERT INTO links(url, bitly) VALUES('${body.url}', '${bitly}')`
      );
    }
  }
  return {
    url: body.url,
    bitly: bitly,
  };
}

async function getLinkByBitly(bitly) {
  const { rows } = await pool.query(
    `SELECT * FROM links WHERE bitly='>${bitly}';`
  );
  if (rows.length === 0) return null;
  return rows[0];
}

async function getLinkByUrl(url) {
  const { rows } = await pool.query(`SELECT * FROM links WHERE url='${url}';`);
  if (rows.length === 0) return null;
  return rows[0];
}

async function getRandom() {
  const { rows } = await pool.query(
    "SELECT * FROM links ORDER BY RANDOM() LIMIT 1"
  );
  if (rows.length === 0) return null;
  return rows[0];
}

fastify.delete("/api/url", async (req, res) => {
  await deleteAll();
  return res.status(200).send();
});

fastify.post("/api/url", async (req, res) => {
  if (!req.body.url) return res.status(400).send();
  const bitly = await saveUrl(req.body);
  return res.status(201).send(bitly);
});

fastify.post("/random", async (req, res) => {
  const entry = await getRandom();
  if (entry === null) return res.status(200).json({ url: "" });
  return res.status(200).send(entry);
});

fastify.get("/>:bitly", async (req, res) => {
  const entry = await getLinkByBitly(req.params.bitly);
  return res.redirect(entry.url);
});

const start = async () => {
  try {
    await fastify.listen({ port, host: "0.0.0.0" });
    console.log("Server started on port: " + port);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

process.stdin.resume(); //so the program will not close instantly
async function exitHandler() {
  await pool.end();
}
process.on("exit", exitHandler);
