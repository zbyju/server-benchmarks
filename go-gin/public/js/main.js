const baseUrl = "http://localhost:4000/";
const baseApiUrl = baseUrl + "api";
const urlEl = document.querySelector(".shortener-input");
const formEl = document.querySelector("form.shortener");
const randomEl = document.querySelector("button.shortener-random");
const resultEl = document.querySelector("div.result");

function sendUrl(url) {
  return fetch(baseApiUrl + "/url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
    }),
  });
}

function goRandom() {
  return fetch(baseUrl + "random", { method: "POST", redirect: "follow" });
}

function showResult(result) {
  resultEl.innerHTML = "";
  const prevLink = document.createElement("a");
  const text = document.createTextNode(" is now at ");
  const nextLink = document.createElement("a");

  prevLink.appendChild(document.createTextNode(result.url));
  prevLink.href = result.url;

  nextLink.appendChild(document.createTextNode(baseUrl + result.bitly));
  nextLink.href = baseUrl + result.bitly;

  resultEl.appendChild(prevLink);
  resultEl.appendChild(text);
  resultEl.appendChild(nextLink);
}

function showError() {
  resultEl.innerHTML = "";
  const paraEl = document.createElement("p");
  paraEl.appendChild(
    document.createTextNode(
      "There has been an error when shortining your link!"
    )
  );
  resultEl.appendChild(paraEl);
}

function showErrorRandom() {
  resultEl.innerHTML = "";
  const paraEl = document.createElement("p");
  paraEl.appendChild(
    document.createTextNode(
      "There has been an error when accessing random link!"
    )
  );
  resultEl.appendChild(paraEl);
}

function showEmptyRandom() {
  resultEl.innerHTML = "";
  const paraEl = document.createElement("p");
  paraEl.appendChild(
    document.createTextNode("No links found, can't go to a random website!")
  );
  resultEl.appendChild(paraEl);
}

formEl.addEventListener("submit", async function (e) {
  e.preventDefault();
  const url = urlEl.value;
  try {
    const response = await sendUrl(url);
    const res = await response.json();
    showResult(res);
  } catch (err) {
    console.log(err);
    showError();
  }
});

randomEl.addEventListener("click", async function (e) {
  e.preventDefault();
  try {
    const response = await goRandom();
    const res = await response.json();
    if (res.url === "") return showEmptyRandom();
    window.location.href = res.url;
  } catch (err) {
    console.log(err);
    showErrorRandom();
  }
});
