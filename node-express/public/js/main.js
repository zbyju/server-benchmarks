const baseUrl = "http://localhost:4000/";
const baseApiUrl = baseUrl + "api";
const urlEl = document.querySelector(".shortener-input");
const formEl = document.querySelector("form.shortener");
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
