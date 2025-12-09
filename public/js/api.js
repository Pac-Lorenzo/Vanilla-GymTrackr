(function () {
  const BASE_URL = "/api";

  async function request(endpoint, method = "GET", data) {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (data !== undefined) {
      options.body = JSON.stringify(data);
    }

    const res = await fetch(BASE_URL + endpoint, options);
    if (!res.ok) {
      const message = await res.text();
      throw new Error(message || `Request failed (${res.status})`);
    }
    return res.json();
  }

  const api = {
    users: {
      list: () => request("/users"),
      create: (data) => request("/users", "POST", data),
      get: (id) => request(`/users/${id}`),
      update: (id, data) => request(`/users/${id}`, "PUT", data),
      remove: (id) => request(`/users/${id}`, "DELETE"),
    },
    workouts: {
      listForUser: (userId) => request(`/workouts/${userId}`),
      create: (data) => request("/workouts", "POST", data),
      get: (id) => request(`/workouts/byid/${id}`),
      remove: (id) => request(`/workouts/byid/${id}`, "DELETE"),
    },
    exercises: {
      listGlobal: () => request("/exercises"),
      addGlobal: (data) => request("/exercises", "POST", data),
      removeGlobal: (id) => request(`/exercises/${id}`, "DELETE"),
    },
    prs: {
      listForUser: (userId) => request(`/prs/${userId}`),
      getForExercise: (userId, exerciseId) =>
        request(`/prs/${userId}/${exerciseId}`),
    },
  };

  window.API = api;
})();
