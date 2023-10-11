start();

function start() {
  document.getElementById("create_btn").addEventListener("click", postData);
  document.getElementById("save_btn").addEventListener("click", savePart);
  document.getElementById("load_btn").addEventListener("click", loadData);
  document.getElementById("table_body").addEventListener("click", tableAction);
  document
    .getElementById("cancel_btn")
    .addEventListener("click", toggleEditors);
}

async function postData() {
  const label = document.getElementById("part_label").value;
  const price = Number(document.getElementById("part_price").value);
  const qty = Number(document.getElementById("part_qty").value);

  const url = "http://localhost:3030/jsonstore/autoparts";

  const partData = {
    label,
    price,
    qty,
  };

  const options = {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(partData),
  };

  const response = await fetch(url, options);
  const result = await response.json();
  console.log(result);
  loadData();
}

async function loadData() {
  const url = "http://localhost:3030/jsonstore/autoparts";

  const response = await fetch(url);
  const data = await response.json();

  const row = Object.values(data).map(createRow);
  document.getElementById("table_body").replaceChildren(...row);
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

  if (target.tagName === "BUTTON") {
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

  const response = await fetch(url, options);
  loadData();
}

async function loadForEditing(recordId) {
  const url = "http://localhost:3030/jsonstore/autoparts/" + recordId;

  const response = await fetch(url);
  const data = await response.json();
  console.log(data);

  document.getElementById("editor_create").style.display = "none";
  document.getElementById("editor_edit").style.display = "block";

  document.getElementById("edit_part_id").value = data._id;
  document.getElementById("edit_part_label").value = data.label;
  document.getElementById("edit_part_price").value = data.price;
  document.getElementById("edit_part_qty").value = data.qty;
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

  const response = await fetch(url, options);
  const result = await response.json();
  loadData();
  toggleEditors();
}

function toggleEditors() {
  document.getElementById("editor_create").style.display = "block";
  document.getElementById("editor_edit").style.display = "none";
}
