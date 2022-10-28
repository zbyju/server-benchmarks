import Fastify from "fastify";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fastifyStatic from "@fastify/static";
import { customAlphabet } from "nanoid/async";

// CONSTANTS
const BITLY_LEN = 5; // should not be 6 to avoid collisions with 'random'
const BITLY_PREFIX = ">"; // fastify could not differentiate between '/' and '/:bitly' endpoints

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fastify = Fastify({
  logger: true,
});
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", BITLY_LEN);
const port = process.env.PORT || 4000;

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
});

function isBitlyOk(bitly) {
  return true;
}

async function generateBitly() {
  let bitly = BITLY_PREFIX + (await nanoid());
  while (!isBitlyOk(bitly)) bitly = BITLY_PREFIX + (await nanoid());
  return bitly;
}

async function saveUrl(body) {
  const bitly = await generateBitly();
  return {
    url: body.url,
    bitly: bitly,
  };
}

async function getEntry(bitly) {
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

fastify.post("/api/url", async (req, res) => {
  const bitly = await saveUrl(req.body);
  return res.status(201).send(bitly);
});

fastify.post("/random", async (req, res) => {
  const entry = await getRandom();
  return res.status(200).send(entry);
});

fastify.get("/>:bitly)", async (req, res) => {
  const entry = await getEntry(req.params.bitly);
  return res.redirect(entry.url);
});

const start = async () => {
  try {
    await fastify.listen({ port });
    console.log("Server started on port: " + port);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
