from django.db import models
from api.models import *

# Create your models here.

class SpotifyToken(models.Model):
    user = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    refresh_token = models.CharField(max_length=150)
    access_token = models.CharField(max_length=150)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)

#we could make votes frontend based, but that is not very secure, ppl can potentially vote multiple times
class Vote(models.Model):
    user = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    song_id = models.CharField(max_length=50)
    #create a foreign key related to the room
    room = models.ForeignKey(Room, on_delete=models.CASCADE)

#make a queue object here? and then link it to room?