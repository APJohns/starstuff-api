from django.shortcuts import render
from rest_framework import viewsets

from .serializers import MessierSerializer
from .models import Messier

class MessierViewSet(viewsets.ModelViewSet):
  queryset = Messier.objects.all().order_by('name')
  serializer_class = MessierSerializer