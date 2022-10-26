import express from "express";
const app = express();
import { customAlphabet } from "nanoid/async";
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 6);
const port = process.env.PORT || 4000;

app.use(express.static("public"));
app.use(express.json());

async function saveUrl(body) {
  const bitly = await nanoid();
  return {
    url: body.url,
    bitly: bitly,
  };
}

function getUrl(bitly) {
  return "http://google.com";
}

app.post("/api/url", async (req, res) => {
  const bitly = await saveUrl(req.body);
  return res.status(201).json(bitly);
});

app.get("/:bitly", (req, res) => {
  const url = getUrl(req.params.bitly);
  return res.redirect(url);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
