const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config')
const path = require('path');
const port = config.port

const userService = require('./services/user-service');
const exerciseService = require('./services/exercise-service');
const templateService = require('./services/template-service');
const workoutService = require('./services/workout-service');
const prService = require('./services/pr-service');

const app = express();

app.use(cors()); 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()) 

// Route registration
app.use('/api/users', userRoutes);
app.use('/api/exercises', exercisesRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/workouts', workoutsRouter);
app.use('/api/prs', prsRouter);

const uri = `mongodb+srv://${config.database.user}:${config.database.password}@firstcluster.tcooogm.mongodb.net/${config.database.dbName}?retryWrites=true&w=majority&appName=FirstCluster`;

const clientOptions = {
    serverApi: { version: '1', strict: true, deprecationErrors: true },
    dbName: config.database.dbName
}

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
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

// User Routes
// GET all users
app.get('/api/users', async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// POST create user
app.post('/api/users', async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

// GET single user
app.get('/api/users/:id', async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// PUT update user
app.put('/api/users/:id', async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// DELETE user
app.delete('/api/users/:id', async (req, res, next) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully', user });
  } catch (err) {
    next(err);
  }
});


// Exercise Routes
// GET global exercises
app.get('/api/exercises', async (req, res, next) => {
  try {
    const exercises = await exerciseService.getGlobalExercises();
    res.json(exercises);
  } catch (err) {
    next(err);
  }
});

// GET combined library (global + custom for user)
app.get('/api/exercises/library/:userId', async (req, res, next) => {
  try {
    const library = await exerciseService.getExerciseLibrary(req.params.userId);
    res.json(library);
  } catch (err) {
    next(err);
  }
});

// POST create global exercise
app.post('/api/exercises', async (req, res, next) => {
  try {
    const exercise = await exerciseService.createGlobalExercise(req.body);
    res.status(201).json(exercise);
  } catch (err) {
    next(err);
  }
});

// POST add custom exercise for a user
app.post('/api/exercises/custom/:userId', async (req, res, next) => {
  try {
    const result = await exerciseService.addCustomExercise(req.params.userId, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// PUT update custom exercise
app.put('/api/exercises/custom/:userId/:exerciseId', async (req, res, next) => {
  try {
    const exercise = await exerciseService.updateCustomExercise(
      req.params.userId,
      req.params.exerciseId,
      req.body
    );
    if (!exercise) return res.status(404).json({ error: 'Custom exercise not found' });
    res.json({ message: 'Custom exercise updated', exercise });
  } catch (err) {
    next(err);
  }
});

// DELETE custom exercise
app.delete('/api/exercises/custom/:userId/:exerciseId', async (req, res, next) => {
  try {
    const ok = await exerciseService.deleteCustomExercise(
      req.params.userId,
      req.params.exerciseId
    );
    if (!ok) return res.status(404).json({ error: 'Custom exercise not found' });
    res.json({ message: 'Exercise removed from your library' });
  } catch (err) {
    next(err);
  }
});

// DELETE global exercise
app.delete('/api/exercises/:id', async (req, res, next) => {
  try {
    const exercise = await exerciseService.deleteGlobalExercise(req.params.id);
    if (!exercise) return res.status(404).json({ error: 'Exercise not found' });
    res.json({ message: 'Exercise deleted from global library', exercise });
  } catch (err) {
    next(err);
  }
});


// Template Routes
// GET global templates
app.get('/api/templates/global', async (req, res, next) => {
  try {
    const templates = await templateService.getGlobalTemplates();
    res.json(templates);
  } catch (err) {
    next(err);
  }
});

// GET combined template library (global + user)
app.get('/api/templates/library/:userId', async (req, res, next) => {
  try {
    const library = await templateService.getTemplateLibrary(req.params.userId);
    res.json(library);
  } catch (err) {
    next(err);
  }
});

// POST create template (global or user)
app.post('/api/templates', async (req, res, next) => {
  try {
    const template = await templateService.createTemplate(req.body);
    res.status(201).json(template);
  } catch (err) {
    next(err);
  }
});

// GET single template
app.get('/api/templates/byid/:id', async (req, res, next) => {
  try {
    const template = await templateService.getTemplateById(req.params.id);
    if (!template) return res.status(404).json({ error: 'Template not found' });
    res.json(template);
  } catch (err) {
    next(err);
  }
});

// GET user templates
app.get('/api/templates/:userId', async (req, res, next) => {
  try {
    const templates = await templateService.getUserTemplates(req.params.userId);
    res.json(templates);
  } catch (err) {
    next(err);
  }
});

// PUT update user template
app.put('/api/templates/custom/:userId/:templateId', async (req, res, next) => {
  try {
    const template = await templateService.updateUserTemplate(
      req.params.userId,
      req.params.templateId,
      req.body
    );
    if (!template) return res.status(404).json({ error: 'Template not found' });
    res.json(template);
  } catch (err) {
    next(err);
  }
});

// DELETE template
app.delete('/api/templates/:id', async (req, res, next) => {
  try {
    const template = await templateService.deleteTemplate(req.params.id);
    if (!template) return res.status(404).json({ error: 'Template not found' });
    res.json({ message: 'Template deleted successfully', template });
  } catch (err) {
    next(err);
  }
});

// Workout Routes
// POST create workout + update PRs
app.post('/api/workouts', async (req, res, next) => {
  try {
    const workout = await workoutService.createWorkout(req.body);
    res.status(201).json(workout);
  } catch (err) {
    next(err);
  }
});

// GET workouts for a user
app.get('/api/workouts/:userId', async (req, res, next) => {
  try {
    const workouts = await workoutService.getWorkoutsForUser(req.params.userId);
    res.json(workouts);
  } catch (err) {
    next(err);
  }
});

// GET single workout
app.get('/api/workouts/byid/:id', async (req, res, next) => {
  try {
    const workout = await workoutService.getWorkoutById(req.params.id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    res.json(workout);
  } catch (err) {
    next(err);
  }
});

// DELETE workout
app.delete('/api/workouts/byid/:id', async (req, res, next) => {
  try {
    const workout = await workoutService.deleteWorkoutById(req.params.id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    res.json({ message: 'Workout deleted successfully', workout });
  } catch (err) {
    next(err);
  }
});


// PR Routes
// GET all PRs for a user
app.get('/api/prs/:userId', async (req, res, next) => {
  try {
    const prs = await prService.getPrsForUser(req.params.userId);
    res.json(prs);
  } catch (err) {
    next(err);
  }
});

// GET PR for one exercise
app.get('/api/prs/:userId/:exerciseId', async (req, res, next) => {
  try {
    const pr = await prService.getPrForUserExercise(
      req.params.userId,
      req.params.exerciseId
    );
    if (!pr) return res.status(404).json({ error: 'PR not found' });
    res.json(pr);
  } catch (err) {
    next(err);
  }
});
