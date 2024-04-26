//server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Replace 'YOUR_MONGODB_URI' with your actual MongoDB connection URI

mongoose
   .connect('mongodb://127.0.0.1:27017/weatherapp').then(() => console.log("connected to mongo")).catch((err) => console.error(err))

app.use(cors());
app.use(express.json());

const weatherSchema = new mongoose.Schema({
  city: {type:String,required:true},
  country: {type:String,required:true},
  temperature: {type:Number,required:true},
  description: {type:String,required:true},
  icon: {type:String,required:true}
})

// Create a Mongoose model for weather data
let Weather=mongoose.model("Weather",weatherSchema);


// Route to handle storing weather data
app.post('/api/weather', async (req, res) => {
  console.log('Request body:', req.body);
  try {
    // Extract weather data from request body
    const { city, country, temperature, description, icon } = req.body;

    // Create a new document using the WeatherData model
    const weatherData = new Weather({
      city,
      country,
      temperature,
      description,
      icon,
    });

    // Save the weather data to the database
    await weatherData.save();

    // Respond with success message
    res.json({ message: 'Weather data saved successfully' });
  } catch (error) {
    console.error('Error saving weather data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
