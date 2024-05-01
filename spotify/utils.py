from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from requests import Request, post, put, get
from .credentials import CLIENT_ID, CLIENT_SECRET
import logging

logging.basicConfig(level=logging.DEBUG) 

BASE_URL = "https://api.spotify.com/v1/me/"

#token doesnt exist for some reason
def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None

def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields = ['access_token', 'refresh_token', 'expires_in', 'token_type'])
    else:
        tokens = SpotifyToken(user=session_id, access_token=access_token, 
                              refresh_token=refresh_token, token_type=token_type,
                              expires_in = expires_in)
        tokens.save()

def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        expiry =  tokens.expires_in
        if expiry <=  timezone.now():
           refresh_spotify_token(session_id)

        return True
    return False

def refresh_spotify_token(session_id):
    refresh_token = get_user_tokens(session_id).refresh_token
    response = post('https://accounts.spotify.com/api/token', data = {
        'grant_type' : 'refresh_token',
        'refresh_token' : refresh_token,
        'client_id' : CLIENT_ID,
        'client_secret' : CLIENT_SECRET,
    }).json()


    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in =  response.get('expires_in')

    update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token)

def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    tokens =  get_user_tokens(session_id)
    header = {'Content-Type' : 'application/json', 'Authorization' : "Bearer " + tokens.access_token}

    if post_:
        post(BASE_URL + endpoint, headers=header)
    if put_:
        put(BASE_URL + endpoint, headers=header)
    
    #send the get request
    #this only works if a song is playing
    response = get(BASE_URL + endpoint, {}, headers=header)
    try:
        return response.json()
    except:
        return {'Error' : 'Could not send request or no song playing!'}



