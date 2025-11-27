const usersBody = document.getElementById("admin-users-body");
const totalUsersEl = document.getElementById("admin-total-users");
const totalOrdersEl = document.getElementById("admin-total-orders");
const clearOrdersBtn = document.getElementById("admin-clear-orders");
const logoutBtn = document.getElementById("admin-logout");

// Redirect if not admin
const active = getActiveUser();
if (!active || active.role !== "admin") {
  window.location.href = "../login.html";
}

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

function renderAdmin() {
  const users = loadUsers();
  const ordersMap = loadOrders();

  usersBody.innerHTML = "";

  let totalOrders = 0;

  users.forEach((user, index) => {
    const orders = ordersMap[user.email] || [];
    totalOrders += orders.length;

    const totalSpent = orders.reduce((sum, o) => sum + Number(o.price || 0), 0);

    const tr = document.createElement("tr");

    const historyHtml = orders.length
      ? `
        <details>
          <summary>View (${orders.length})</summary>
          <ul class="admin-history-list">
            ${orders
              .map(
                (o) => `
              <li>
                <span>${o.product} - ₹${o.price}</span>
                <span class="admin-history-date">${formatDate(
                  o.timestamp
                )}</span>
              </li>
            `
              )
              .join("")}
          </ul>
        </details>
      `
      : `<span>No orders</span>`;

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.email}</td>
      <td>${user.phone || "-"}</td>
      <td>${user.address || "-"}</td>
      <td>${formatDate(user.createdAt)}</td>
      <td>${orders.length}</td>
      <td>${totalSpent}</td>
      <td>${historyHtml}</td>
    `;

    usersBody.appendChild(tr);
  });

  totalUsersEl.textContent = users.length;
  totalOrdersEl.textContent = totalOrders;
}

if (clearOrdersBtn) {
  clearOrdersBtn.addEventListener("click", () => {
    if (confirm("Clear all stored orders?")) {
      saveOrders({});
      renderAdmin();
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    logoutUser();
    window.location.href = "../login.html";
  });
}

renderAdmin();
