from django.urls import path
from .views import index

app_name = 'frontend'

urlpatterns = [
    #the name variable is affixed in front of app_name with a colon when redirecting
    path('', index, name=''),
    path('join', index),
    path('create', index),
    path('motion', index),
    path('room/<str:roomCode>', index)
]