const baseApiUrl = "http://localhost:4000/api";
const urlEl = document.querySelector(".shortener-input");
const formEl = document.querySelector("form.shortener");
const resultEl = document.querySelector("div.result");

function sendUrl(url) {
  return fetch(baseApiUrl + "/url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      url,
    },
  });
}

function showResult(result) {
  resultEl.innerHTML = "";
  const prevLink = document.createElement("a");
  const text = document.createTextNode(" is now at ");
  const newLink = document.createElement("a");

  prevLink.appendChild(document.createTextNode(result.url));
  prevLink.href = result.url;

  newLink.appendChild(document.createTextNode(result.bitly));
  newLink.href = result.bitly;

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
    showError();
  }
});
