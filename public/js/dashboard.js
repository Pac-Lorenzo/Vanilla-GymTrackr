document.addEventListener('DOMContentLoaded', async () => {
    await loadDashboard();
});

async function loadDashboard() {
    try {
        const [workouts, exercises] = await Promise.all([
            WorkoutAPI.getAll(),
            ExerciseAPI.getAll()
        ]);
        
        document.getElementById('totalWorkouts').textContent = workouts.length;
        document.getElementById('totalExercises').textContent = exercises.length;
        
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekWorkouts = workouts.filter(w => new Date(w.date) >= weekAgo);
        document.getElementById('weekWorkouts').textContent = weekWorkouts.length;
        
        displayRecentWorkouts(workouts.slice(0, 5));
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function displayRecentWorkouts(workouts) {
    const container = document.getElementById('recentWorkouts');
    
    if (workouts.length === 0) {
        return;
    }
    
    container.innerHTML = workouts.map(workout => `
        <div class="border-l-4 border-blue-500 pl-4 py-2">
            <div class="flex justify-between">
                <div>
                    <h3 class="font-semibold">${workout.name}</h3>
                    <p class="text-sm text-gray-600">
                        ${workout.exercises.length} exercises • 
                        ${new Date(workout.date).toLocaleDateString()}
                    </p>
                </div>
                <button onclick="viewWorkout('${workout._id}')" 
                        class="text-blue-500 hover:text-blue-700">
                    View →
                </button>
            </div>
        </div>
    `).join('');
}

function viewWorkout(id) {
    window.location.href = `/workout.html?id=${id}`;
}
