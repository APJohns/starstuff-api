const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Celestial = mongoose.model('Celestial');

function hasWriteAccess(req) {
  if (req.headers.authorization) {
    return Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString() === process.env.MASTER_PW;
  } else {
    return false;
  }
}

// Create celestial
router.post('/new-celestial', async (req, res) => {
  if (hasWriteAccess(req)) {
    const celestial = req.body;
    if (celestial.name) {
      await (new Celestial(celestial)).save();

      res.status(201).json({
        message: "Celestial successfully registered."
      });
    } else {
      res.status(401).json({
        message: "Celestial failed to register."
      });
    }
  } else {
    res.status(403).json({
      message: "You don't have write access. Contact mail@ashpjohns.com to request write access."
    });
  }
});


// Get all celestials
router.get('/celestials', async (req, res) => {
  const allCelestials = await Celestial.find();
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
  res.status(200).send(allCelestials);
});

// Get one celestial
router.get('/celestial/:slug', async (req, res) => {
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
  const celestialSlug = req.params.slug;
  Celestial.findOne({ slug: celestialSlug }, (err, celestial) => {
    if (err) {
      console.error(err);
      res.status(500).json({ mesage: 'Oops, something went wrong on our end.' })
    } else if (!celestial) {
      res.status(404).json({ mesage: 'Invalid celestial slug.' })
    } else {
      res.status(200).send(celestial);
    }
  });
});

// Get latitude and azimuth of an celestial
// Requires the following query params: datetime (local time in ISO), lat (decimal degrees), and lon (decimal degrees)
router.get('/celestial/:slug/altaz', async (req, res) => {
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
  const celestialSlug = req.params.slug;
  Celestial.findOne({ slug: celestialSlug }, (err, celestial) => {
    if (err) {
      console.error(err);
      res.status(500).json({ mesage: 'Oops, something went wrong on our end.' })
    } else if (!celestial) {
      res.status(404).json({ mesage: 'Invalid celestial slug.' })
    } else {
      let date = new Date(req.query.date);
      let lat = Number(req.query.lat);
      let lon = Number(req.query.lon);
      if (date && lat && lon) {
        res.status(200).send(celestial.getAltAz(date, lat, lon));
      } else {
        res.status(404).json({ mesage: 'Invalid date, lat or lon.' })
      }
    }
  });
});

// Update celestial
router.patch('/celestial/:slug', async (req, res) =>{
  if (hasWriteAccess(req)) {
    const celestialSlug= req.params.slug;
    const celestialUpdate = req.body;

    Celestial.findOne({ slug: celestialSlug }, (err, celestial) => {
      if (err) {
        console.error(err);
        res.status(500).json({ mesage: 'Oops, something went wrong on our end.' })
      } else if (!celestial) {
        res.status(404).json({ mesage: 'Invalid celestial slug.' })
      } else {
        Object.assign(celestial, celestialUpdate);
        celestial.save();
        return res.status(200).json({ message: 'Successfully updated celestial.', data: celestial });
      }
    });
  } else {
    res.status(403).json({
      message: "You don't have write access. Contact mail@ashpjohns.com to request write access."
    });
  }
});

// Delete one celestial
router.delete('/celestial/:slug', (req, res) => {
  if (hasWriteAccess(req)) {
    const celestialSlug = req.params.slug;
    Celestial.findOneAndDelete({ slug: celestialSlug }, (err, celestial) => {
      if (err) {
        console.error(err);
        res.status(500).json({ mesage: 'Oops, something went wrong on our end.' })
      } else if (!celestial) {
        res.status(404).json({ mesage: 'Invalid celestial slug.' })
      } else {
        return res.status(200).json({ message: 'Successfully deleted celestial.', data: celestial });
      }
    });
  } else {
    res.status(403).json({
      message: "You don't have write access. Contact mail@ashpjohns.com to request write access."
    });
  }
});

module.exports = router;