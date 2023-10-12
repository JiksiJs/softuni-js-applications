start();

function start() {
  document.getElementById("editor_create").addEventListener("submit", postData);
  document.getElementById("load_btn").addEventListener("click", loadData);
  document.getElementById("table_body").addEventListener("click", tableAction);
  document.getElementById("save_btn").addEventListener("click", savePart);
}

async function postData(event) {
  event.preventDefault();

  //take input values
  const formData = new FormData(event.target);
  const { label, price, qty } = Object.fromEntries(formData.entries());

  //error handling
  if (label == "" || price == "" || qty == "") {
    return alert("All fields are required!");
  }

  //post request to the server
  const url = "http://localhost:3030/jsonstore/autoparts";

  const postData = {
    label,
    price,
    qty,
  };
  const options = {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  };

  try {
    const response = await fetch(url, options);
    if (response.ok == false) {
      const error = await response.json();
      throw error;
    }
    const data = await response.json();
    // loadData();
  } catch (error) {
    alert(error.message);
  }
  event.target.reset();
}

async function loadData() {
  const url = "http://localhost:3030/jsonstore/autoparts";

  try {
    const response = await fetch(url);
    if (response.ok == false) {
      const error = await response.json();
      throw error;
    }
    const data = await response.json();

    const row = Object.values(data).map(createRow);
    document.getElementById("table_body").replaceChildren(...row);
  } catch (error) {
    alert(error.message);
  }
}

function createRow(record) {
  const element = document.createElement("tr");
  element.innerHTML = `
  <td>${record._id}</td>
  <td>${record.label}</td>
  <td>${record.price}</td>
  <td>${record.qty}</td>
  <td>
    <button data-id=${record._id} class="delete_btn">Delete</button>
    <button data-id=${record._id} class="edit_btn">Edit</button>
  </td>`;
  return element;
}

function tableAction(event) {
  const target = event.target;

  if (target.tagName == "BUTTON") {
    if (target.classList.contains("delete_btn")) {
      deleteRecord(target.dataset.id);
    } else if (target.classList.contains("edit_btn")) {
      loadForEditing(target.dataset.id);
    }
  }
}

async function deleteRecord(recordId) {
  const choice = confirm("Are you sure?");
  if (choice == false) {
    return;
  }
  const url = "http://localhost:3030/jsonstore/autoparts/" + recordId;
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
  loadData();
}

async function loadForEditing(recordId) {
  const url = "http://localhost:3030/jsonstore/autoparts/" + recordId;

  try {
    const response = await fetch(url);
    if (response.ok == false) {
      const error = await response.json();
      throw error;
    }
    const data = await response.json();

    document.getElementById("editor_create").style.display = "none";
    document.getElementById("editor_edit").style.display = "block";

    document.getElementById("edit_part_id").value = data._id;
    document.getElementById("edit_part_label").value = data.label;
    document.getElementById("edit_part_price").value = data.price;
    document.getElementById("edit_part_qty").value = data.qty;
  } catch (error) {
    alert(error.message);
  }
}

async function savePart() {
  const record = {};

  record._id = document.getElementById("edit_part_id").value;
  record.label = document.getElementById("edit_part_label").value;
  record.price = document.getElementById("edit_part_price").value;
  record.qty = document.getElementById("edit_part_qty").value;

  const url = "http://localhost:3030/jsonstore/autoparts/" + record._id;
  const options = {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  };

  try {
    const response = await fetch(url, options);
    if (response.ok == false) {
      const error = await response.json();
      throw error;
    }
    const result = await response.json();
  } catch (error) {
    alert(error.message);
  }
  loadData();
  toggleEditors();
}

function toggleEditors() {
  document.getElementById("editor_create").style.display = "block";
  document.getElementById("editor_edit").style.display = "none";
}
