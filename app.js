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
  updateStats();
  renderFeed();
  renderCelebrationWall();
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

// NAVIGATION 
function showView(viewName) {
  // Hide all views
  const views = ['feed', 'myprojects', 'celebration', 'profile'];
  views.forEach(v => {
    document.getElementById('view-' + v).style.display = 'none';
    document.getElementById('nav-' + v).classList.remove('active');
  });

  // Show selected view
  document.getElementById('view-' + viewName).style.display = 'block';
  document.getElementById('nav-' + viewName).classList.add('active');
}

// STATS 
function updateStats() {
  document.getElementById('statTotal').textContent = projects.length;
  document.getElementById('statBuilders').textContent = new Set(projects.map(p => p.authorId)).size;
  document.getElementById('statShipped').textContent = projects.filter(p => p.completed).length;
}

// PROJECT MODAL
function openNewProjectModal() {
  document.getElementById('newProjectModal').style.display = 'flex';
}

function closeNewProjectModal() {
  document.getElementById('newProjectModal').style.display = 'none';
  // Clear the form
  document.getElementById('projTitle').value = '';
  document.getElementById('projDesc').value = '';
  document.getElementById('projStage').value = 'Idea';
  document.getElementById('projSupport').value = '';
  document.getElementById('projectError').textContent = '';
}

function closeModalOnOverlay(event) {
  if (event.target.classList.contains('modal-overlay')) {
    closeNewProjectModal();
  }
}

// ADD PROJECT
function addProject() {
  const title = document.getElementById('projTitle').value.trim();
  const desc = document.getElementById('projDesc').value.trim();
  const stage = document.getElementById('projStage').value;
  const support = document.getElementById('projSupport').value;
  const errorMsg = document.getElementById('projectError');

  // Validation
  if (!title || !desc) {
    errorMsg.textContent = 'Please fill in the title and description.';
    return;
  }

  // Create new project object
  const newProject = {
    id: generateId(),
    authorId: currentUser.id,
    title: title,
    desc: desc,
    stage: stage,
    support: support,
    milestones: [],
    comments: [],
    hands: [],
    completed: false,
    ts: new Date().toISOString()
  };

  // Save it
  projects.unshift(newProject);
  saveProjects();

  // Close modal and refresh feed
  closeNewProjectModal();
  renderFeed();
  updateStats();
  showToast('Project added to the feed!');
}

// TOAST NOTIFICATION
function showToast(message) {
  // Remove existing toast if any
  const existing = document.getElementById('toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

// RENDER FEED 
function renderFeed() {
  const feedContainer = document.getElementById('view-feed');
  const activeProjects = projects.filter(p => !p.completed);

  let html = `
    <div class="feed-header">
      <h2>Live Feed</h2>
      <span class="feed-count">${activeProjects.length} projects</span>
    </div>
  `;

  if (activeProjects.length === 0) {
    html += `
      <div class="empty-state">
        <div class="empty-icon">◈</div>
        <p>No projects yet. Be the first to build in public!</p>
      </div>
    `;
  } else {
    activeProjects.forEach(project => {
      const author = users.find(u => u.id === project.authorId) || { name: 'Unknown' };
      const isMine = project.authorId === currentUser.id;
      const hasHand = project.hands.includes(currentUser.id);
      const latestMilestone = project.milestones.length > 0
        ? project.milestones[project.milestones.length - 1]
        : null;

      html += `
        <div class="project-card ${isMine ? 'mine' : ''}">
          <div class="card-top">
            <div>
              <div class="card-title">${project.title}</div>
              <div class="card-author">by ${author.name} · ${formatDate(project.ts)}</div>
            </div>
            <div class="badges">
              <span class="badge badge-stage">${project.stage}</span>
              ${project.support ? `<span class="badge badge-support">Needs: ${project.support}</span>` : ''}
            </div>
          </div>

          <p class="card-desc">${project.desc}</p>

          ${latestMilestone ? `
            <div class="latest-milestone">
              <p class="milestone-label">Latest milestone</p>
              <p class="milestone-text">✓ ${latestMilestone.text}</p>
            </div>
          ` : ''}

          <div class="card-actions">
            <button class="icon-btn" onclick="toggleComments('${project.id}')">
              💬 ${project.comments.length}
            </button>
            ${!isMine ? `
              <button class="icon-btn ${hasHand ? 'active' : ''}" onclick="toggleHand('${project.id}')">
                ${hasHand ? '✋ Hand raised' : '🤝 Raise hand'} ${project.hands.length}
              </button>
            ` : ''}
            ${isMine ? `
              <button class="icon-btn" onclick="openMilestoneModal('${project.id}')">+ Milestone</button>
              <button class="icon-btn" onclick="completeProject('${project.id}')">✓ Complete</button>
            ` : ''}
          </div>

          <div class="comments-section" id="comments-${project.id}" style="display:none;">
            ${renderComments(project)}
            <div class="comment-input-row">
              <input type="text" id="commentInput-${project.id}" placeholder="Write a comment..." 
                onkeydown="if(event.key==='Enter') addComment('${project.id}')" />
              <button class="btn btn-green btn-sm" onclick="addComment('${project.id}')">Post</button>
            </div>
          </div>
        </div>
      `;
    });
  }

  feedContainer.innerHTML = html;
}

// RENDER COMMENTS 
function renderComments(project) {
  if (project.comments.length === 0) return '<p style="font-size:13px;color:var(--gray);margin-bottom:8px;">No comments yet.</p>';

  return project.comments.map(c => {
    const author = users.find(u => u.id === c.userId) || { name: 'Unknown' };
    const initials = author.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    return `
      <div class="comment">
        <div class="avatar">${initials}</div>
        <div class="comment-body">
          <div class="comment-author">${author.name}</div>
          <div class="comment-text">${c.text}</div>
        </div>
      </div>
    `;
  }).join('');
}

// FORMAT DATE 
function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

// TOGGLE COMMENTS 
function toggleComments(projectId) {
  const section = document.getElementById('comments-' + projectId);
  section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

// ADD COMMENT 
function addComment(projectId) {
  const input = document.getElementById('commentInput-' + projectId);
  const text = input.value.trim();
  if (!text) return;

  const project = projects.find(p => p.id === projectId);
  if (!project) return;

  project.comments.push({
    userId: currentUser.id,
    text: text,
    ts: new Date().toISOString()
  });

  saveProjects();
  input.value = '';
  renderFeed();
  toggleComments(projectId);
}

// RAISE HAND 
function toggleHand(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (!project) return;

  const hasHand = project.hands.includes(currentUser.id);
  if (hasHand) {
    project.hands = project.hands.filter(h => h !== currentUser.id);
    showToast('Removed collaboration request');
  } else {
    project.hands.push(currentUser.id);
    showToast('Raised your hand for collaboration!');
  }

  saveProjects();
  renderFeed();
}

// MILESTONE MODAL
let currentMilestoneProjectId = null;

function openMilestoneModal(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (!project) return;

  currentMilestoneProjectId = projectId;
  document.getElementById('milestoneProjectName').textContent = 'Project: ' + project.title;
  document.getElementById('milestoneText').value = '';
  document.getElementById('milestoneError').textContent = '';
  document.getElementById('milestoneModal').style.display = 'flex';
}

function closeMilestoneModal() {
  document.getElementById('milestoneModal').style.display = 'none';
  currentMilestoneProjectId = null;
}

// ADD MILESTONE
function addMilestone() {
  const text = document.getElementById('milestoneText').value.trim();
  const errorMsg = document.getElementById('milestoneError');

  if (!text) {
    errorMsg.textContent = 'Please describe your milestone.';
    return;
  }

  const project = projects.find(p => p.id === currentMilestoneProjectId);
  if (!project) return;

  project.milestones.push({
    text: text,
    date: new Date().toISOString().split('T')[0]
  });

  saveProjects();
  closeMilestoneModal();
  renderFeed();
  showToast('Milestone added!');
}

// COMPLETE PROJECT 
function completeProject(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (!project) return;

  const confirmed = confirm('Are you sure you want to mark "' + project.title + '" as completed? You will be added to the Celebration Wall!');
  if (!confirmed) return;

  project.completed = true;
  project.stage = 'Completed';
  saveProjects();
  renderFeed();
  renderCelebrationWall();
  updateStats();
  showToast('Congratulations! You have been added to the Celebration Wall!');
}

// CELEBRATION WALL 
function renderCelebrationWall() {
  const container = document.getElementById('view-celebration');
  const completedProjects = projects.filter(p => p.completed);

  let html = `
    <div class="feed-header">
      <h2>🎉 Celebration Wall</h2>
    </div>
    <p class="wall-subtitle">Developers who built in public and shipped!</p>
  `;

  if (completedProjects.length === 0) {
    html += `
      <div class="empty-state">
        <div class="empty-icon">★</div>
        <p>No completed projects yet. Be the first to ship!</p>
      </div>
    `;
  } else {
    html += '<div class="celebration-grid">';
    completedProjects.forEach(project => {
      const author = users.find(u => u.id === project.authorId) || { name: 'Unknown' };
      const initials = author.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
      html += `
        <div class="celeb-card">
          <div class="celeb-avatar">${initials}</div>
          <div class="celeb-name">${author.name}</div>
          <div class="celeb-project">${project.title}</div>
          <div class="celeb-emoji">🚀</div>
        </div>
      `;
    });
    html += '</div>';
  }

  container.innerHTML = html;
}