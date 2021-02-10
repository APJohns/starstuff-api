const express = require('express');
const api = express();
const bodyParser = require('body-parser');


api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));

const mongoose = require('mongoose');
const AstroObject = mongoose.model('AstroObject');

function hasWriteAccess(req) {
  if (req.headers.authorization) {
    return Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString() === process.env.MASTER_PW;
  } else {
    return false;
  }
}

// Create object
api.post('/new-object', async (req, res) => {
  if (hasWriteAccess(req)) {
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
  } else {
    res.status(403).json({
      message: "You don't have write access. Contact mail@ashpjohns.com to request write access."
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

// Update object
api.patch('/object/:slug', async (req, res) =>{
  if (hasWriteAccess(req)) {
    const astroObjectSlug= req.params.slug;
    const objectUpdate = req.body;

    AstroObject.findOne({ slug: astroObjectSlug }, (err, object) => {
      if (err) {
        console.error(err);
        res.status(500).json({ mesage: 'Oops, something went wrong on our end.' })
      } else if (!object) {
        res.status(404).json({ mesage: 'Invalid object slug.' })
      } else {
        Object.assign(object, objectUpdate);
        object.save();
        return res.status(200).json({ message: 'Successfully updated object.', data: object });
      }
    });
  } else {
    res.status(403).json({
      message: "You don't have write access. Contact mail@ashpjohns.com to request write access."
    });
  }
});

// Delete one object
api.delete('/object/:slug', (req, res) => {
  if (hasWriteAccess(req)) {
    const astroObjectSlug = req.params.slug;
    AstroObject.findOneAndDelete({ slug: astroObjectSlug }, (err, object) => {
      if (err) {
        console.error(err);
        res.status(500).json({ mesage: 'Oops, something went wrong on our end.' })
      } else if (!object) {
        res.status(404).json({ mesage: 'Invalid site slug.' })
      } else {
        return res.status(200).json({ message: 'Successfully deleted site.', data: object });
      }
    });
  } else {
    res.status(403).json({
      message: "You don't have write access. Contact mail@ashpjohns.com to request write access."
    });
  }
});

module.exports = api;