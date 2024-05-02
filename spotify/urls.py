from django.urls import path
from .views import *
urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', isAuthenticated.as_view()),
    path('current-song', currentSong.as_view()),
    path('current-queue', currentQueue.as_view()),
    #delete the below when exporting
    path('token-view', SpotifyTokenView.as_view()),
    path('play', playSong.as_view()),
    path('pause', pauseSong.as_view()),
    path('skip', skipSong.as_view())
]