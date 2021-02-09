const express = require('express');
const api = express();
const bodyParser = require('body-parser');


api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));

const mongoose = require('mongoose');
const AstroObject = mongoose.model('AstroObject');

// Create object
api.post('/new-object', async (req, res) => {
  const astroObject = req.body;
  if (astroObject.name) {
    await (new AstroObject(astroObject)).save();

    res.status(201).json({
      message: "AstroObject successfully registered."
    });
  } else {
    res.status(401).json({
      message: "AstroObject failed to register."
    });
  }
});


// Get all objects
api.get('/objects', async (req, res) => {
  const allObjects = await AstroObject.find();
  res.status(200).send(allObjects);
});

// Get one object
api.get('/object/:slug', async (req, res) => {
  const astroObjectSlug = req.params.slug;
  AstroObject.findOne({ slug: astroObjectSlug }, (err, object) => {
    if (err) {
      console.error(err);
      res.status(500).json({ mesage: 'Oops, something went wrong on our end.' })
    } else if (!object) {
      res.status(404).json({ mesage: 'Invalid object slug.' })
    } else {
      res.status(200).send(object);
    }
  });
});

// Get ltitude and azimuth of an object
// Requires the following query params: datetime (local time in ISO), lat (decimal degrees), and lon (decimal degrees)
api.get('/object/:slug/altaz', async (req, res) => {
  const astroObjectSlug = req.params.slug;
  AstroObject.findOne({ slug: astroObjectSlug }, (err, object) => {
    if (err) {
      console.error(err);
      res.status(500).json({ mesage: 'Oops, something went wrong on our end.' })
    } else if (!object) {
      res.status(404).json({ mesage: 'Invalid object slug.' })
    } else {
      let date = new Date(req.query.date);
      let lat = Number(req.query.lat);
      let lon = Number(req.query.lon);
      if (date && lat && lon) {
        res.status(200).send(object.getAltAz(date, lat, lon));
      } else {
        res.status(404).json({ mesage: 'Invalid date, lat or lon.' })
      }
    }
  });
});

/*
api.patch('/object/:slug', async (req, res) =>{
  const siteSlug= req.params.slug;
  const siteUpdate = req.body;

  Site.findOne({ slug: siteSlug }, (err, site) => {
    if (err) {
      console.error(err);
      res.status(500).json({ mesage: 'Oops, something went wrong on our end.' })
    } else if (!site) {
      res.status(404).json({ mesage: 'Invalid site slug.' })
    } else {
      Object.assign(site, siteUpdate);
      site.save();
      return res.status(200).json({ message: 'Successfully updated site.', data: site });
    }
  });
});*/

// Delete one object
api.delete('/object/:slug', (req, res) => {
  const astroObjectSlug = req.params.slug;
  AstroObject.findOneAndDelete({ slug: astroObjectSlug }, (err, site) => {
    if (err) {
      console.error(err);
      res.status(500).json({ mesage: 'Oops, something went wrong on our end.' })
    } else if (!site) {
      res.status(404).json({ mesage: 'Invalid site slug.' })
    } else {
      return res.status(200).json({ message: 'Successfully deleted site.', data: site });
    }
  });
});

module.exports = api;