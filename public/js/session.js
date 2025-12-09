const Session = {
  getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  clearSession() {
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  },

  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  requireLogin() {
    if (!this.isLoggedIn()) {
      window.location.href = '/';
      return false;
    }
    return true;
  },

  redirectIfLoggedIn() {
    if (this.isLoggedIn()) {
      window.location.href = '/dashboard.html';
    }
  }
};

function renderNavbar() {
  const user = Session.getCurrentUser();
  if (!user) return;

  const navHTML = `
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-8">
            <h1 class="text-xl font-semibold">GymTracker</h1>
            <div class="hidden md:flex space-x-4">
              <a href="/dashboard.html" class="text-gray-700 hover:text-blue-500">Dashboard</a>
              <a href="/workout.html" class="text-gray-700 hover:text-blue-500">Workout</a>
              <a href="/exercises.html" class="text-gray-700 hover:text-blue-500">Exercises</a>
              <a href="/history.html" class="text-gray-700 hover:text-blue-500">History</a>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-600">${user.name}</span>
            <button onclick="Session.clearSession()" 
                    class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  `;

  document.body.insertAdjacentHTML('afterbegin', navHTML);
}
