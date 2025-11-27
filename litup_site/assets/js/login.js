const form = document.getElementById("login-form");
const err = document.getElementById("error-msg");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const result = loginUser(email, password);

    if (!result.ok) {
      err.textContent = result.message;
      return;
    }

    if (result.role === "admin") {
      window.location.href = "admin/index.html";
    } else {
      window.location.href = "index.html";
    }
  });
}
