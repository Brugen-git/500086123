const mongoose = require('mongoose');
const axios = require('axios');
const cors=require('cors')
const trains = require('./train/route');
const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use('/api', trains);

mongoose.connect('mongodb://127.0.0.1:27017/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(express.json());
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });