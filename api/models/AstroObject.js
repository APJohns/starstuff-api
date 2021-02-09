const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const astroObjectSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a name!'
  },
  commonName: {
    type: String,
    trim: true
  },
  objectType: {
    type: String,
    trim: true
  },
  rightAscension: {
    type: String,
    trim: true,
    required: 'Please enter a right ascension!'
  },
  declination: {
    type: String,
    trim: true,
    required: 'Please enter a declination!'
  },
  distance: {
    type: String,
    trim: true
  },
  apparentMagnitude: {
    type: String,
    trim: true
  },
  constellation: {
    type: String,
    trim: true
  },
  slug: String,
  recordCreated: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

astroObjectSchema.index({
  name: 'text'
});

astroObjectSchema.pre('save', async function(next) {
  if (this.isModified('name')) {
    this.slug = slug(this.name);
  }
  next();
});

module.exports = mongoose.model('AstroObject', astroObjectSchema);