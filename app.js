const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

var cors = require('cors');

const app = express();
app.use(cors());

app.use(express.json());

const sequelize = require('./util/database');
const User = require('./models/user');

const userRoutes = require('./routes/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/user', userRoutes);

sequelize
  .sync()
  .then(result => {
    app.listen(3000);
  })
  .catch(err => console.log(err));