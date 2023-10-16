document.getElementById("register-form").addEventListener("submit", onRegister);
document.getElementById("load-data").addEventListener("click", loadData);
document.getElementById("login-form").addEventListener("submit", onLogin);

async function onRegister(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { email, password, repass } = Object.fromEntries(formData.entries());

  //error handling
  if (email == "" || password == "") {
    return alert("All fields required!");
  }
  if (password !== repass) {
    return alert("Passwords must match!");
  }

  //post request
  const url = "http://localhost:3030/users/register";

  const options = {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  };

  try {
    const response = await fetch(url, options);
    if (response.ok == false) {
      const error = await response.json();
      throw error;
    }
    const userData = await response.json();
    localStorage.setItem("email", userData.email);
    localStorage.setItem("accessToken", userData.accessToken);
  } catch (error) {
    alert(error.message);
  }
}

async function onLogin(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { email, password } = Object.fromEntries(formData.entries());

  const url = "http://localhost:3030/users/login";

  const options = {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  };

  try {
    const response = await fetch(url, options);
    if (response.ok == false) {
      const error = await response.json();
      throw error;
    }
    const userData = await response.json();
    localStorage.setItem("email", userData.email);
    localStorage.setItem("accessToken", userData.accessToken);
  } catch (error) {
    alert(error.message);
  }
}

async function loadData() {
  const token = localStorage.getItem("accessToken");
  const url = "http://localhost:3030/data/recipes";

  const options = {
    method: "get",
    headers: { "X-Authorization": token },
  };

  try {
    const response = await fetch(url, options);
    if (response.ok == false) {
      const error = await response.json();
      throw error;
    }
    const data = await response.json();
    location = "/Remote Data & Authentication/CRUD Basics";
  } catch (error) {
    alert(error.message);
  }
}
