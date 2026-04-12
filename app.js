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

//REGISTER
function register() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const bio = document.getElementById('regBio').value.trim();
  const skills = document.getElementById('regSkills').value.trim();
  const errorMsg = document.getElementById('registerError');

  // Validation
  if (!name || !email || !password) {
    errorMsg.textContent = 'Please fill in name, email and password.';
    return;
  }

  if (password.length < 6) {
    errorMsg.textContent = 'Password must be at least 6 characters.';
    return;
  }

  // Check if email already exists
  const exists = users.find(u => u.email === email);
  if (exists) {
    errorMsg.textContent = 'An account with that email already exists.';
    return;
  }

  // Create new user
  const newUser = {
    id: generateId(),
    name: name,
    email: email,
    password: password,
    bio: bio,
    skills: skills
  };

  users.push(newUser);
  saveUsers();

  // Log them in straight away
  currentUser = newUser;
  saveSession();
  showApp();
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
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
}

function showLogin() {
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
}

//On page load, check if user is logged in
if (currentUser) {
  showApp();
} else {
  showAuth();
}