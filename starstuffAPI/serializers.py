from rest_framework import serializers
from .models import Messier

class MessierSerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model = Messier
    fields = (
      'name',
      'commonName',
      'objectType',
      'distance',
      'apparentMagnitude',
      'rightAscension',
      'declination',
      'constellation'
    )