const mongoose = require('mongoose');
const dotenv = require('dotenv');
const readline = require('readline');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ayush_gurjar_parking:BATMANbatman%23123@parkingsystem.m8yupmj.mongodb.net/parkingsystem?retryWrites=true&w=majority';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const makeAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const User = require('../models/User');

    rl.question('Enter the email of the user to make Admin: ', async (email) => {
      const user = await User.findOne({ email });
      
      if (!user) {
        console.log(`User with email ${email} not found.`);
        process.exit(1);
      }

      user.role = 'admin';
      await user.save();

      console.log(`Success! User ${user.name} (${email}) is now an Admin.`);
      process.exit(0);
    });

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

makeAdmin();
