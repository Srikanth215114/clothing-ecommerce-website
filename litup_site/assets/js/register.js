const regForm = document.getElementById("register-form");
const regErr = document.getElementById("reg-error");

if (regForm) {
  regForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;
    const phone = document.getElementById("reg-phone").value;
    const address = document.getElementById("reg-address").value;

    const result = registerUser(email, password, phone, address);

    if (!result.ok) {
      regErr.textContent = result.message;
      return;
    }

    window.location.href = "login.html";
  });
}
