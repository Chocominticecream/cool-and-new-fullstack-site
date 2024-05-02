from django.db import models
import string
import random

# Create your models here.
# this file is a model, similar to a database table
# has python code which is interpreted into database code
# room model

def generate_unique_code():
    length = 6

    while True:
        #generate a random 6 digit number code of length 6
        code = ''.join(random.choices(string.ascii_uppercase, k =length))
        #end the function if code is unique
        if Room.objects.filter(code=code).count() == 0:
           break
    return code
    
class Room(models.Model):
    #set the variables for room code
    code = models.CharField(max_length = 8, default = generate_unique_code, unique = True)
    host = models.CharField(max_length = 50, unique=True)
    guest_can_pause = models.BooleanField(null=False,default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    created_at = models.DateTimeField(auto_now_add = True)
    current_song = models.CharField(max_length=50, null=True)
