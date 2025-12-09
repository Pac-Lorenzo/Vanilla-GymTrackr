// Base URL for API requests
const BASE_URL = "/api";



// Generic requrest function
async function request(endpoint, method = "GET", data = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  // If there's body data (POST/PUT), attach it
  if (data !== null) {
    options.body = JSON.stringify(data);
  }

  // Send the request
  const response = await fetch(BASE_URL + endpoint, options);

  // Handle non-200 errors
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Request failed");
  }

  // Parse JSON response
  return response.json();
}



// ================================================
// Shortcut helper functions (GET, POST, PUT, DELETE)
// These mimic axios.get/post/put/delete()
// ================================================
const GET = (url) => request(url, "GET");
const POST = (url, data) => request(url, "POST", data);
const PUT = (url, data) => request(url, "PUT", data);
const DELETE = (url) => request(url, "DELETE");



// ================================
// USERS
// ================================
export const getAllUsers = () => GET("/users");
export const createUser = (data) => POST("/users", data);
export const getUser = (id) => GET(`/users/${id}`);
export const deleteUser = (id) => DELETE(`/users/${id}`);



// ================================
// WORKOUTS
// ================================
export const createWorkout = (data) => POST("/workouts", data);
export const getWorkouts = (userId) => GET(`/workouts/${userId}`);
export const deleteWorkout = (id) => DELETE(`/workouts/byid/${id}`);



// ================================
// PRs
// ================================
export const getPRs = (userId) => GET(`/prs/${userId}`);



// ================================
// EXERCISES
// ================================
export const getExercises = () => GET("/exercises");

export const getExerciseLibrary = (userId) =>
  GET(`/exercises/library/${userId}`);

export const addGlobalExercise = (data) =>
  POST("/exercises", data);

export const addUserCustomExercise = (userId, data) =>
  POST(`/exercises/custom/${userId}`, data);

export const deleteUserCustomExercise = (userId, exerciseId) =>
  DELETE(`/exercises/custom/${userId}/${exerciseId}`);

export const deleteGlobalExercise = (id) =>
  DELETE(`/exercises/${id}`);



// ================================
// TEMPLATES
// ================================
export const getTemplateLibrary = (userId) =>
  GET(`/templates/library/${userId}`);

export const getGlobalTemplates = () =>
  GET("/templates/global");

export const getUserTemplates = (userId) =>
  GET(`/templates/${userId}`);

export const getTemplate = (id) =>
  GET(`/templates/byid/${id}`);

export const createTemplate = (data) =>
  POST("/templates", data);

export const deleteTemplate = (id) =>
  DELETE(`/templates/${id}`);

export const updateTemplate = (id, data) =>
  PUT(`/templates/${id}`, data);
