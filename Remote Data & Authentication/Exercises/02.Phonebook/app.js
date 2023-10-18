function attachEvents() {
  document.getElementById("btnCreate").addEventListener("click", postData);
  document.getElementById("btnLoad").addEventListener("click", loadData);
}

attachEvents();

async function postData() {
  const name = document.getElementById("person");
  const phone = document.getElementById("phone");
  const url = "http://localhost:3030/jsonstore/phonebook";

  if (name.value == "" || phone.value == "") {
    return alert("All fields are required!");
  }

  const userData = {
    person: name.value,
    phone: phone.value,
  };
  const options = {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  };

  try {
    const response = await fetch(url, options);
    if (response.ok == false) {
      const error = await response.json();
      throw error;
    }
    loadData();
  } catch (error) {
    alert(error.message);
  }
}

async function loadData() {
  const url = "http://localhost:3030/jsonstore/phonebook";

  try {
    const response = await fetch(url);
    if (response.ok == false) {
      const error = await response.json();
      throw error;
    }
    const data = await response.json();
    console.log(data);

    Object.keys(data).forEach((key) => localStorage.setItem("key", key));
    Object.values(data).map(createListItem);
  } catch (error) {
    alert(error.message);
  }
}

function createListItem(record) {
  const element = document.createElement("li");
  const list = document.getElementById("phonebook");

  element.textContent = `${record.person}: ${record.phone}`;

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete_btn");
  deleteButton.textContent = "Delete";
  element.appendChild(deleteButton);

  deleteButton.addEventListener("click", async (event) => {
    const key = localStorage.getItem("key");
    const url = `http://localhost:3030/jsonstore/phonebook/${key}`;

    const options = {
      method: "delete",
    };

    try {
      const response = await fetch(url, options);
      if (response.ok == false) {
        const error = await response.json();
        throw error;
      }
      event.target.parentNode.remove();
    } catch (error) {
      alert(error.message);
    }
  });

  list.appendChild(element);

  return list;
}

/*
async function deleteRequest() {
  const key = localStorage.getItem("key");
  console.log(key);
  const url = `http://localhost:3030/jsonstore/phonebook/${key}`;

  const options = {
    method: "delete",
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

function deleteRecord(event) {
  const target = event.target;

  if (target.tagName === "BUTTON") {
    if (target.classList.contains("delete_btn")) {
      console.log("clicked delete");
    }
  }
}
*/
