// Session Management - Include this on every page
const Session = {
  // Get current user from localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Set current user
  setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  // Clear session (logout)
  clearSession() {
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  },

  // Check if logged in
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  // Protect page (redirect if not logged in)
  requireLogin() {
    if (!this.isLoggedIn()) {
      window.location.href = '/';
      return false;
    }
    return true;
  },

  // Redirect if already logged in
  redirectIfLoggedIn() {
    if (this.isLoggedIn()) {
      window.location.href = '/dashboard.html';
    }
  }
};

// Navbar Component - Call this function on protected pages
function renderNavbar() {
  const user = Session.getCurrentUser();
  if (!user) return;

  const navHTML = `
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-8">
            <h1 class="text-xl font-semibold">💪 GymTracker</h1>
            <div class="hidden md:flex space-x-4">
              <a href="/dashboard.html" class="text-gray-700 hover:text-blue-500">Dashboard</a>
              <a href="/profile.html" class="text-gray-700 hover:text-blue-500">Profile</a>
              <a href="/workout.html" class="text-gray-700 hover:text-blue-500">Workout</a>
              <a href="/exercises.html" class="text-gray-700 hover:text-blue-500">Exercises</a>
              <a href="/history.html" class="text-gray-700 hover:text-blue-500">History</a>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-600">👤 ${user.name}</span>
            <button onclick="Session.clearSession()" 
                    class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  `;

  // Insert navbar at the beginning of body
  document.body.insertAdjacentHTML('afterbegin', navHTML);
}
