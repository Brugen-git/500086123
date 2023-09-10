const express = require('express');
const router = express.Router();
const axios = require('axios');


const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTQzMzUwMjcsImNvbXBhbnlOYW1lIjoiU2NoZWR1bGUgVHJhaW4iLCJjbGllbnRJRCI6IjM5MGVhYjI3LTkzNzYtNDdkMy04NTMwLTg0MmQ4YjllOGI2OSIsIm93bmVyTmFtZSI6IiIsIm93bmVyRW1haWwiOiIiLCJyb2xsTm8iOiI1MDAwODYxMjMifQ.b1Vkw3h_c2SAthsxa8S7nxOmwHi1aKmm93qE2kFWn0k';

async function getData() {
  try {
    const response = await axios.get('http://20.244.56.144/train/trains', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });   
    return response.data;
  } catch (error) {
    throw new Error('Cannot fetch the train data at this moment');
  }
}

async function allTrains() {
  const data = await getData();
  console.log('Received train data:', data);
  const noww = new Date().getTime();
  const allow = 12 * 60 * 60 * 1000; 

  const after = data.filter(train => {
    const dep = new Date().setHours(train.departureTime.Hours, train.departureTime.Minutes, 0, 0);
    return dep - noww > 0 && dep - noww <= allow;
  });

  const sortedTrains = after.sort((a, b) => {
    if (a.price.sleeper !== b.price.sleeper) {
      return a.price.sleeper - b.price.sleeper;
    } else if (a.price.AC !== b.price.AC) {
      return a.price.AC - b.price.AC;
    } else {
      return b.seatsAvailable.sleeper - a.seatsAvailable.sleeper || b.seatsAvailable.AC - a.seatsAvailable.AC;
    }
  });

  return sortedTrains;
}



router.get('/allTrains', async (req, res) => {
  try {
    const allTrainsSchedule = await allTrains();
    res.json(allTrainsSchedule);
  } 
  catch (error) {
    res.status(500).json({ error: 'Internal server error' });
   
  }
});


router.get('/train/:trainNumber', async (req, res) => {
    try {
      const trainNumber = req.params.trainNumber;
      const response = await axios.get(`http://20.244.56.144/train/trains/${trainNumber}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
  
      if (response.status !== 200) {
        return res.status(response.status).json({ error: 'Failed to fetch train data from server' });
      }
  
      const train = response.data;
      res.json(train);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;