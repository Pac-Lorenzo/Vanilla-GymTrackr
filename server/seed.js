const mongoose = require('mongoose');
const config = require('./config');

const User = require('./models/User');
const Exercise = require('./models/Exercise');
const Workout = require('./models/Workout');

const uri = `mongodb+srv://${config.database.user}:${config.database.password}` +
  `@firstcluster.tcooogm.mongodb.net/${config.database.dbName}`;

async function seed() {
  try {
    await mongoose.connect(uri);

    await Exercise.deleteMany({});
    await User.deleteMany({});
    await Workout.deleteMany({});

    const exercises = [
      { exercise_id: 'ex001', name: 'Bench Press', type: 'Strength' },
      { exercise_id: 'ex002', name: 'Incline Bench Press', type: 'Strength' },
      { exercise_id: 'ex003', name: 'Dumbbell Flyes', type: 'Strength' },
      { exercise_id: 'ex004', name: 'Push-ups', type: 'Strength' },
      { exercise_id: 'ex005', name: 'Cable Crossover', type: 'Strength' },

      { exercise_id: 'ex006', name: 'Deadlift', type: 'Strength' },
      { exercise_id: 'ex007', name: 'Pull-ups', type: 'Strength' },
      { exercise_id: 'ex008', name: 'Barbell Row', type: 'Strength' },
      { exercise_id: 'ex009', name: 'Lat Pulldown', type: 'Strength' },
      { exercise_id: 'ex010', name: 'T-Bar Row', type: 'Strength' },
      { exercise_id: 'ex011', name: 'Cable Row', type: 'Strength' },

      { exercise_id: 'ex012', name: 'Overhead Press', type: 'Strength' },
      { exercise_id: 'ex013', name: 'Lateral Raises', type: 'Strength' },
      { exercise_id: 'ex014', name: 'Front Raises', type: 'Strength' },
      { exercise_id: 'ex015', name: 'Rear Delt Flyes', type: 'Strength' },

      { exercise_id: 'ex016', name: 'Bicep Curls', type: 'Strength' },
      { exercise_id: 'ex017', name: 'Tricep Dips', type: 'Strength' },
      { exercise_id: 'ex018', name: 'Tricep Pushdown', type: 'Strength' },
      { exercise_id: 'ex019', name: 'Hammer Curls', type: 'Strength' },

      { exercise_id: 'ex020', name: 'Squat', type: 'Strength' },
      { exercise_id: 'ex021', name: 'Leg Press', type: 'Strength' },
      { exercise_id: 'ex022', name: 'Romanian Deadlift', type: 'Strength' },
      { exercise_id: 'ex023', name: 'Lunges', type: 'Strength' },
      { exercise_id: 'ex024', name: 'Leg Curls', type: 'Strength' },
      { exercise_id: 'ex025', name: 'Leg Extensions', type: 'Strength' },
      { exercise_id: 'ex026', name: 'Calf Raises', type: 'Strength' },
      { exercise_id: 'ex027', name: 'Bulgarian Split Squat', type: 'Strength' },

      { exercise_id: 'ex028', name: 'Plank', type: 'Strength' },
      { exercise_id: 'ex029', name: 'Russian Twists', type: 'Strength' },
      { exercise_id: 'ex030', name: 'Crunches', type: 'Strength' },

      { exercise_id: 'ex031', name: 'Running', type: 'Cardio' },
      { exercise_id: 'ex032', name: 'Cycling', type: 'Cardio' }
    ];

    const createdExercises = {};
    for (const ex of exercises) {
      const created = await Exercise.create(ex);
      createdExercises[ex.exercise_id] = created;
    }

    const bench = createdExercises['ex001'];
    const squat = createdExercises['ex020'];

    const user = await User.create({
      name: 'Paco Lorenzo',
      email: 'paco@example.com'
    });

    const workout = await Workout.create({
      user_id: user._id,
      date: new Date('2025-11-15'),
      total_time_minutes: 65,
      exercises: [
        {
          exercise_id: bench.exercise_id,
          name: bench.name,
          sets: [
            { set_id: 's1', weight: 135, reps: 8, difficulty: 6 },
            { set_id: 's2', weight: 185, reps: 5, difficulty: 8 }
          ]
        }
      ]
    });

    console.log('User ID:', user._id.toString());
    console.log('Bench ID:', bench.exercise_id);
    console.log('Squat ID:', squat.exercise_id);

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
