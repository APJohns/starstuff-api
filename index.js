const mongoose = require('mongoose');

require('dotenv').config({ path: 'variables.env' });

// Database
const uri = process.env.DB_URL;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to DB.');
});

// Data models
require('./api/models/AstroObject');

// Star app
const api = require('./api/api.js');
api.set('port', process.env.PORT || 3200);

api.listen(api.get('port'), () => {
  console.log(`API is running on port ${api.get('port')}`);
});