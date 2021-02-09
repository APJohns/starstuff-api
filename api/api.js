const express = require('express');
const api = express();
const bodyParser = require('body-parser');


api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));

const mongoose = require('mongoose');
const AstroObject = mongoose.model('AstroObject');

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
/*
api.get('/object', async (req, res) => {
  const allSites = await Site.find();
  res.status(200).send(allSites);
});

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
});

api.delete('/object/:slug', (req, res) => {
  const siteSlug = req.params.slug;
  Site.findOneAndDelete({ slug: siteSlug }, (err, site) => {
    if (err) {
      console.error(err);
      res.status(500).json({ mesage: 'Oops, something went wrong on our end.' })
    } else if (!site) {
      res.status(404).json({ mesage: 'Invalid site slug.' })
    } else {
      return res.status(200).json({ message: 'Successfully deleted site.', data: site });
    }
  });
}); */

module.exports = api;