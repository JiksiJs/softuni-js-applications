function attachEvents() {
  document.getElementById("submit").addEventListener("click", postData);
  document.getElementById("refresh").addEventListener("click", getData);
}

attachEvents();

async function postData() {
  const name = document.querySelector("[name=author]");
  const message = document.querySelector("[name=content]");
  const url = "http://localhost:3030/jsonstore/messenger";

  if (name.value == "" || message.value == "") {
    return alert("All fields are required!");
  }

  const username = {
    author: name.value,
    content: message.value,
  };
  const options = {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(username),
  };

  try {
    const response = await fetch(url, options);
    if (response.ok == false) {
      const error = await response.json();
      throw error;
    }
  } catch (error) {
    alert(error.message);
  }
}

async function getData() {
  const textArea = document.getElementById("messages");
  const url = "http://localhost:3030/jsonstore/messenger";

  const messages = [];

  try {
    const response = await fetch(url);
    if (response.ok == false) {
      const error = await response.json();
      throw error;
    }
    const data = await response.json();
    console.log(data);
    Object.values(data).forEach((entry) =>
      messages.push(`${entry.author}:${entry.content}`)
    );
    textArea.textContent = messages.join("\n");
  } catch (error) {
    alert(error.message);
  }
}
