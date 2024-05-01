from django.shortcuts import render, redirect
from .credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status, generics
from rest_framework.response import Response
from .utils import *
from api.models import Room
from .serializer import TokenSerializer

class SpotifyTokenView(generics.ListAPIView):
    queryset = SpotifyToken.objects.all()
    serializer_class = TokenSerializer

#authorise the usage of spotify and also generate a url after sending information
class AuthURL(APIView):
    def get(self,request, format=None):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
        
        #request a token, state is optional parameters
        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope':scopes,
            #requesting that code be sent back that can be used to authenticate
            'response_type':'code',
            'redirect_uri':REDIRECT_URI,
            'client_id':CLIENT_ID,
        }).prepare().url

        return Response({'url':url}, status=status.HTTP_200_OK)

#make a request read in state and code for use
#similar to the above method, except we recieve a token instead of a url
def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://accounts.spotify.com/api/token', data = {
        'grant_type' : 'authorization_code',
        'code' : code,
        'redirect_uri' : REDIRECT_URI,
        'client_id' : CLIENT_ID,
        'client_secret' : CLIENT_SECRET,
    }).json()
    
    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token =response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')
    
    if not request.session.exists(request.session.session_key):
            request.session.create()

    update_or_create_user_tokens(request.session.session_key, access_token, token_type, expires_in, refresh_token)

    return redirect('frontend:')

class isAuthenticated(APIView):
      def get(self,request, format=None):
          is_authenticated = is_spotify_authenticated(self.request.session.session_key)
          return Response({'status':is_authenticated}, status=status.HTTP_200_OK)

class currentSong(APIView):
      def get(self,request, format=None):
          room_code = self.request.session.get('room_code')
          room = Room.objects.filter(code=room_code)
          if room.exists():
               room = room[0]
          else:
               return Response({}, status=status.HTTP_404_NOT_FOUND)
        
          host = room.host
          endpoint = "player/currently-playing?additional_types=track%2Cepisode"
          response = execute_spotify_api_request(host, endpoint)

          if 'error' in response or 'item' not in response:
               return Response({}, status=status.HTTP_204_NO_CONTENT)
          
          item = response.get('item')
          duration = response.get('duration_ms')
          progress = response.get('progress_ms')
          is_playing = response.get('is_playing')
          song_id = item.get('id')
          credits_string = ""
          cover = ""
          #this variable below checks to see if its a podcast ot song
          isSong = True
          if 'album' in item:
               cover = item.get('album').get('images')[0].get('url')
               duration = item.get('duration_ms')
               for i , artist in enumerate(item.get('artists')):
                   if i > 0:
                      credits_string += ", "
                      name = artist.get('name')
                      credits_string += name
                   else:
                      name = artist.get('name')
                      credits_string += name
          else:
               cover = item.get('images')[0].get('url')
               duration = item.get('duration_ms')
               credits_string += item.get('show').get('publisher')
               isSong = False
          
          song = {
               'title' : item.get('name'),
               'credits' : credits_string,
               'duration' : duration,
               'time' : progress,
               'image_url' : cover,
               'votes' : 0,
               'id' : song_id,
               'isSong' : isSong,
               'is_playing' : is_playing
          }

          return Response(song, status=status.HTTP_200_OK)

class currentQueue(APIView):
     def get(self,request, format=None):
          room_code = self.request.session.get('room_code')
          room = Room.objects.filter(code=room_code)
          if room.exists():
               room = room[0]
          else:
               return Response({}, status=status.HTTP_404_NOT_FOUND)
        
          host = room.host
          endpoint = "player/queue"
          response = execute_spotify_api_request(host, endpoint)

          #if 'error' in response or 'item' not in response:
               #return Response({}, status=status.HTTP_204_NO_CONTENT)
          
          return Response(response, status=status.HTTP_200_OK)