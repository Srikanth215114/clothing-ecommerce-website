/* ============================================================
   AUTH + DATABASE SYSTEM (localStorage based)
   ============================================================ */

const DB_USERS = "litup_users";
const DB_ORDERS = "litup_orders";
const DB_ACTIVE_USER = "litup_active_user";
const ADMIN_EMAIL = "admin@litup.com";
const ADMIN_PASSWORD = "admin123";

/* ----------------- Load Users ----------------- */
function loadUsers() {
  try {
    const data = JSON.parse(localStorage.getItem(DB_USERS));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/* ----------------- Save Users ----------------- */
function saveUsers(users) {
  localStorage.setItem(DB_USERS, JSON.stringify(users));
}

/* ----------------- Register User ----------------- */
function registerUser(email, password, phone, address) {
  const users = loadUsers();
  if (users.find((u) => u.email === email)) {
    return { ok: false, message: "Email already registered" };
  }

  const newUser = {
    email,
    password,
    phone,
    address,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  return { ok: true };
}

/* ----------------- Login User ----------------- */
function loginUser(email, password) {
  // Admin login
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem(
      DB_ACTIVE_USER,
      JSON.stringify({
        email: ADMIN_EMAIL,
        role: "admin",
      })
    );
    return { ok: true, role: "admin" };
  }

  const users = loadUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) return { ok: false, message: "Invalid email or password" };

  localStorage.setItem(
    DB_ACTIVE_USER,
    JSON.stringify({
      email: user.email,
      role: "user",
    })
  );

  return { ok: true, role: "user" };
}

/* ----------------- Get Active User ----------------- */
function getActiveUser() {
  try {
    return JSON.parse(localStorage.getItem(DB_ACTIVE_USER));
  } catch {
    return null;
  }
}

/* ----------------- Logout ----------------- */
function logoutUser() {
  localStorage.removeItem(DB_ACTIVE_USER);
}

/* ----------------- Orders helpers ----------------- */
function loadOrders() {
  try {
    const data = JSON.parse(localStorage.getItem(DB_ORDERS));
    return data || {};
  } catch {
    return {};
  }
}

function saveOrders(orders) {
  localStorage.setItem(DB_ORDERS, JSON.stringify(orders));
}

/* ----------------- Add Order ----------------- */
function addOrder(product, price) {
  const user = getActiveUser();
  if (!user || user.role !== "user") return;

  const allOrders = loadOrders();
  if (!allOrders[user.email]) allOrders[user.email] = [];

  allOrders[user.email].push({
    product,
    price,
    timestamp: new Date().toISOString(),
  });

  saveOrders(allOrders);
}
