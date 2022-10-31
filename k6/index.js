import http from "k6/http";

export function setup() {
  http.del("http://localhost:4000/api/url");
}

export default function () {
  http.get("http://localhost:4000/");
}

export function teardown() {}
