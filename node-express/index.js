const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

app.use(express.static("public"));
app.use(express.json());

function saveUrl(body) {
  return {
    url: body.url,
    bitly: body.url,
  };
}

function getUrl(bitly) {
  return "http://google.com";
}

app.post("/api/url", (req, res) => {
  console.log(req.body);
  const bitly = saveUrl(req.body);
  return res.status(201).json(bitly);
});

app.get("/:bitly", (req, res) => {
  console.log(req.params.bitly);
  const url = getUrl(req.params.bitly);
  return res.redirect(url);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
