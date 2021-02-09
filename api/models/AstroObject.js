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

astroObjectSchema.methods.getAltAz = function(date, lat, lon) {
  const ra2real = (hrs, mins) => {
    return 15 * (hrs + mins / 60);
  }

  const dm2real = (deg, min) => {
    return deg < 0 ? deg - min / 60 : deg + min / 60;
  }

  const radians = (deg) => {
    return deg * Math.PI / 180;
  }

  const degrees = (rad) => {
    return rad * 180 / Math.PI;
  }

  // Calcualtes number of days since J200 from target date
  const daysSinceJ2000 = (date) => {
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1;
    let day = date.getUTCDate();
    let hour = date.getUTCHours();
    let minute = date.getUTCMinutes();
    let second = date.getUTCSeconds();

    if (month === 1 || month === 2) {
      year  = year - 1
      month = month + 12
    }

    const a = Math.floor(year / 100);
    const b = 2 - a + Math.floor(a / 4);
    const c = Math.floor(365.25 * year);
    const d = Math.floor(30.6001 * (month + 1));
    return b + c + d - 730550.5 + day + (hour + minute / 60.0 + second / 3600.0) / 24.0;
  }

  // Returns local siderial time
  const meanSiderialTime = (date, lon) => {
    // Julian centuries since j2000
    const jcj2000 = daysSinceJ2000(date) / 36525.0;
    let mst = 280.46061837 + 360.98564736629
      * daysSinceJ2000(date) + 0.000387933
      * Math.pow(jcj2000, 2)
      - Math.pow(jcj2000, 3) / 38710000 + lon;

      if (mst < 0) {
        while (mst < 0) {
          mst += 360;
        }
      } else if (mst > 360) {
        while (mst > 360) {
          mst -= 360;
        }
      }

      return mst;
  }

  // Returns the horizon angle
  const horizonAngle = (date, lon, ra) => {
    let ha = meanSiderialTime(date, lon) - ra;
    return ha < 0 ? ha += 360 : ha;
  }

  // Parameters in degrees
  // Returns altitude in degrees
  const altitude = (lat, ha, dec) =>{
    dec = radians(dec);
    lat = radians(lat);
    ha = radians(ha);
    const sin_alt = Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(ha);
    return degrees(Math.asin(sin_alt));
  }

  // Parameters in degrees
  // Returns azimuth in degrees
  const azimuth = (lat, dec, ha, alt) => {
    dec = radians(dec);
    lat = radians(lat);
    ha = radians(ha);
    alt = radians(alt);
    const cos_az = (Math.sin(dec) - Math.sin(alt) * Math.sin(lat)) / (Math.cos(alt) * Math.cos(lat));
    const az = degrees(Math.acos(cos_az));
    return Math.sin(ha) > 0 ? 360 - az : az;
  }

  /* const lat = dm2real(lat_dm[0], lat_dm[1]);
  const lon = dm2real(lon_dm[0], lon_dm[1]); */
  const ra_dm = this.rightAscension.split(' ').map(d => Number(d.slice(0, -1)));
  const ra = ra2real(ra_dm[0], ra_dm[1]);
  const dec_dm = this.declination.split(' ').map(d => Number(d.slice(0, -1)));
  const dec = dm2real(dec_dm[0], dec_dm[1]);
  const ha = horizonAngle(date, lon, ra);
  const alt = altitude(lat, ha, dec);
  const az = azimuth(lat, dec, ha, alt);
  return {
    altitude: alt,
    azimuth: az
  }
}

astroObjectSchema.pre('save', async function(next) {
  if (this.isModified('name')) {
    this.slug = slug(this.name);
  }
  next();
});

module.exports = mongoose.model('AstroObject', astroObjectSchema);