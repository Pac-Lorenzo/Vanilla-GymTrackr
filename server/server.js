const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config')
const path = require('path');
const port = config.port

const userService = require('./services/user-service');
const exerciseService = require('./services/exercise-service');
const workoutService = require('./services/workout-service');

const app = express();

app.use(cors()); 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()) 
app.use(express.static(path.join(__dirname, '..', 'public')));

const uri = `mongodb+srv://${config.database.user}:${config.database.password}@firstcluster.tcooogm.mongodb.net/${config.database.dbName}?retryWrites=true&w=majority&appName=FirstCluster`;

const clientOptions = {
    serverApi: { version: '1', strict: true, deprecationErrors: true },
    dbName: config.database.dbName
}

async function run() {
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
    })
  } catch (error) {
        console.error("Failed to connect to MongoDB:", error)
        mongoose.disconnect()
        process.exit(1)
}
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('GymTracker API running');
});

app.get('/api/users', async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

app.post('/api/users', async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

app.get('/api/users/:id', async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

app.put('/api/users/:id', async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/users/:id', async (req, res, next) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully', user });
  } catch (err) {
    next(err);
  }
});


app.get('/api/exercises', async (req, res, next) => {
  try {
    const exercises = await exerciseService.getGlobalExercises();
    res.json(exercises);
  } catch (err) {
    next(err);
  }
});

app.post('/api/exercises', async (req, res, next) => {
  try {
    const exercise = await exerciseService.createGlobalExercise(req.body);
    res.status(201).json(exercise);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/exercises/:id', async (req, res, next) => {
  try {
    const exercise = await exerciseService.deleteGlobalExercise(req.params.id);
    if (!exercise) return res.status(404).json({ error: 'Exercise not found' });
    res.json({ message: 'Exercise deleted from global library', exercise });
  } catch (err) {
    next(err);
  }
});


app.post('/api/workouts', async (req, res, next) => {
  try {
    const workout = await workoutService.createWorkout(req.body);
    res.status(201).json(workout);
  } catch (err) {
    next(err);
  }
});

app.get('/api/workouts/:userId', async (req, res, next) => {
  try {
    const workouts = await workoutService.getWorkoutsForUser(req.params.userId);
    res.json(workouts);
  } catch (err) {
    next(err);
  }
});

app.get('/api/workouts/byid/:id', async (req, res, next) => {
  try {
    const workout = await workoutService.getWorkoutById(req.params.id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    res.json(workout);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/workouts/byid/:id', async (req, res, next) => {
  try {
    const workout = await workoutService.deleteWorkoutById(req.params.id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    res.json({ message: 'Workout deleted successfully', workout });
  } catch (err) {
    next(err);
  }
});
