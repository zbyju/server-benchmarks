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
  const res = http.post("http://localhost:4000/api/url", payload, params);
  return res.json();
}

export function saveUrls(n) {
  return generateUrls(n).map((u) => saveUrl(u));
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
  http.del("http://host.docker.internal:4000/api/url");
  const urls = saveUrls(1000);
  return { urls };
}

export default function (data) {
  const bitly = data.urls[Math.floor(Math.random() * data.urls.length)];
  http.get(`http://host.docker.internal:4000/${bitly}`);
}

export function teardown() {
  http.del("http://host.docker.internal:4000/api/url");
}
