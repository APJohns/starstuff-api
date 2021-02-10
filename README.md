# Star Stuff API

An API containing information on celestial objects, including getting the altitude and azimuth of an object base on your datetime and location.

## Celestial Object Model

### Properties

Property | Type | Description | Notes
--- | --- | --- | ---
name | string | The name of the celestial object *e.g. M1* | required.
commonName | string | The common name of the celestial object *e.g. The Crab Nebula* |
objectType | string | The type of the celestial object *e.g. Supernova Remnant* |
rightAscension | string | The right ascension of the celestial object *e.g. 5h 34.5m* |
declination | string | The declination of the celestial object *e.g. +22d 01m* |
apparentMagnitude | string | The apparent magnitude of the celestial object *e.g. 8.4* |
constellation | string | The constellation that the celestial object is closest to or in. *e.g. Taurus* |
slug | string | The url friendly version of the name. *e.g. m1* | Auto-generated on creation.
recordCreated | string | The datetime when the record was created. *e.g. m1* | Auto-generated on creation.

### Methods

#### getAltAz
Calculates the altitude and azimuth of the celestial body based on the users date, latitude, and longitude.

##### Return Type

```js
{
  altitude: number,
  azimuth: number
}
```

##### Parameters

- date: The date in local ISO format *e.g. 2021-02-09T23:00:00*
- lat: The latitude in degree decimals *e.g. 42.36*
- lon: The longitude in degree decimals *e.g. -71.05*


## Endpoints

Host URL is https://star-stuff.herokuapp.com/
Dedicated host name and Heroku dynon coming soon...

### Get All Celestial Objects

`GET /star-stuff/v1/celestials`

Returns an array of all the celestial objects in the API.

### Get One Celestial Object

`GET /star-stuff/v1/celestial/<name>`

Returns one celestial object based on the provided name.

### Get Celestial Object Alt/Az

`GET /star-stuff/v1/celestial/<name>/altaz?date=<date>&lat=<lat>&lon=<lon>`

Returns the altitude and azimuth of the celestial object based on the given date, latitude, and longitude.

### Edit Celestial Object

`PATCH /star-stuff/v1/celestial/<name>`

Edits a celestial object. The properties and their new valeus should be included in the request body. Requires write access.

### Create Celestial Object

`POST /star-stuff/v1/new-celestial`

Creates a new celestial object. The proeprties of the object should be included in the request body. Requires write access.

### Delete Celestial Object

`DELETE /star-stuff/v1/celestial/<name>`

Deletes a celestial object. Requires write access.

## Contributing

If you would like to add to the API database, you can request write access by emailing me at mail@ashpjohns.com.

If you would like to contribute to the codebase, go ahead and create issues or even put up a pull request.