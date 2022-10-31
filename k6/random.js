import http from "k6/http";

export function saveUrl(url) {
  const payload = JSON.stringify({
    url,
  });
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  http.post("http://localhost:4000/api/url", payload, params);
}

export function saveUrls(n) {
  generateUrls(n).forEach((u) => {
    saveUrl(u);
  });
}

function generateUrl() {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const length = Math.floor(Math.random() * 5) + 3;
  let string = "";
  for (let i = 0; i < length; ++i) {
    string += chars[Math.floor(Math.random() * chars.length)];
  }
  return "http://" + string + ".com";
}

function generateUrls(n) {
  return [
    ...Array(n)
      .fill(0)
      .map((x) => generateUrl()),
  ];
}

export function setup() {
  http.del("http://localhost:4000/api/url");
  saveUrls(1000);
}

export default function () {
  http.get("http://localhost:4000/random");
}

export function teardown() {
  http.del("http://localhost:4000/api/url");
}
