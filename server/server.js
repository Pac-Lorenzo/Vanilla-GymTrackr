require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/users');
const exercisesRouter = require('./routes/exercises');
const templatesRouter = require('./routes/templates');
const workoutsRouter = require('./routes/workouts');
const prsRouter = require('./routes/prs');

const path = require('path');
const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, '../public'))); 

// Route registration
app.use('/api/users', userRoutes);
app.use('/api/exercises', exercisesRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/workouts', workoutsRouter);
app.use('/api/prs', prsRouter);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('💾 Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });