import http from "k6/http";

function generateUrl() {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const length = Math.floor(Math.random() * 5) + 3;
  let string = "";
  for (let i = 0; i < length; ++i) {
    string += chars[Math.floor(Math.random() * chars.length)];
  }
  return "http://" + string + ".com";
}

export function setup() {
  http.del("http://host.docker.internal:4000/api/url");
}

export default function () {
  const payload = JSON.stringify({
    url: generateUrl(),
  });
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  http.post("http://host.docker.internal:4000/api/url", payload, params);
}

export function teardown() {
  http.del("http://host.docker.internal:4000/api/url");
}
