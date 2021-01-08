from django.db import models

class Messier(models.Model):
  name = models.CharField(max_length=4, help_text="Enter Object's name")
  commonName = models.CharField(max_length=60, null=True, blank=True, help_text="Enter Object's common name")
  objectType = models.CharField(max_length=60, help_text="Enter Object's type e.g. Globular Cluster")
  distance = models.CharField(max_length=60, help_text="Enter Object's distance from earth in KiloLightyears")
  apparentMagnitude = models.DecimalField(max_digits=5, decimal_places=2, help_text="Enter Object's apparent magnitude")
  rightAscension = models.CharField(max_length=20, help_text="Enter Object's right ascension e.g. 05h 34m 31.94s")
  declination = models.CharField(max_length=20, help_text="Enter Object's declination e.g. +22d 01'")
  constellation = models.CharField(max_length=60, help_text="Enter the constellation the object can be found in")

  def __str__(self):
    return self.name