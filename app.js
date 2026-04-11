// MzansiBuilds- Main Application Logic 

// DATA STORE- holds all users and project in memory
let users = JSON.parse(localStorage.getItem('mb_users')) || [];
let projects = JSON.parse(localStorage.getItem('mb_projects')) || [];
let currentUser = JSON.parse(localStorage.getItem('mb_session')) || null;

//HELPER FUNCTIONS- save data to localStorage so it persists on refresh
function saveUsers() {
  localStorage.setItem('mb_users', JSON.stringify(users));
}

function saveProjects() {
  localStorage.setItem('mb_projects', JSON.stringify(projects));
}

function saveSession() {
  localStorage.setItem('mb_session', JSON.stringify(currentUser));
}

//Generate a unique ID for new users and projects
function generateId() {
  return 'id_' + Math.random().toString(36).slice;
}

//AUTHENTICATION- Register, Login, Logout
function login(){
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const errorMsg =  document.getElementById('loginError');

  // Validation
  if (!email || !password) {
    errorMsg.textContent = 'Please fill in all fields.';
    return;
  }

  // Find user
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    errorMsg.textContent = 'Invalid email or password.';
    return;
  }

  // Log in
  currentUser = user;
  saveSession();
  showApp();
}

function logout() {
  currentUser = null;
  localStorage.removeItem('mb_session');
  showAuth();
}

//SCREEN SWITCHING
function showApp() {
  document.getElementById('authScreen').style.display = 'none';
  document.getElementById('mainApp').style.display = 'block';
  document.getElementById('currentUserName').textContent = currentUser.name;
}

function showAuth() {
  document.getElementById('authScreen').style.display = 'flex';
  document.getElementById('mainApp').style.display = 'none';
}

function showRegister() {
  alert('Register form coming soon!');
}

//On page load, check if user is logged in
if (currentUser) {
  showApp();
} else {
  showAuth();
}