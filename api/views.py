from django.shortcuts import render
import datetime
from django.http import HttpResponse, JsonResponse
from rest_framework import generics, status
from .models import Room
from spotify.models import SpotifyToken
from .serializer import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from rest_framework.views import APIView
from rest_framework.response import Response


# Create your views/endpoints here. (website)
#ListApiview console gives a list of created rooms
class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

#api console for creating rooms
class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.serializer_class(data=request.data)
        #if the two fields defined in create room are valid, create a room
        if serializer.is_valid():
            #per session key, a host can have one room, creating a new room only updates the 
            #session room's settings
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            #look if the session key exists
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.created_at = datetime.datetime.now()
                room.save(update_fields=['guest_can_pause', 'votes_to_skip', 'created_at'])
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host, votes_to_skip=votes_to_skip, guest_can_pause=guest_can_pause)
                room.save()
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            
        return Response("Invalid data...", status=status.HTTP_400_BAD_REQUEST)

#sends a request to the backend to get the variables for a room
class GetRoom(APIView):
    serializer_class = RoomSerializer
    #parameter passe din url
    lookup_url_kwarg = 'roomCode'

    def get (self, request, format=None):
        roomCode = request.GET.get(self.lookup_url_kwarg)
        if roomCode != None:
            room = Room.objects.filter(code=roomCode)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room not found' : 'Invalid room code'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'Bad request' : 'roomCode parameter not found'}, status=status.HTTP_400_BAD_REQUEST)
        
class JoinRoom(APIView):
    lookup_url_kwarg = 'roomCode'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        code = request.data.get('code')
        if code:
            roomResult = Room.objects.filter(code=code)
            #the variable below tells the server that the user is in this room
            self.request.session['room_code'] = code
            if len(roomResult) > 0:
                room = roomResult[0]
                return Response({'message' : 'Room joined!'},status=status.HTTP_200_OK)
            return Response({'Bad Request' : 'Invalid room code'},status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Request' : 'Invalid data, did not find a code key'},status=status.HTTP_400_BAD_REQUEST)

#this sends a get request and returns the room the user is in
class UserInRoom(APIView):
    def get (self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create() #this creates a session key!
        code = self.request.session.get('room_code')
        if code:
          roomResult = Room.objects.filter(code=code)
          if len(roomResult) > 0:
            data = {
            'code' : self.request.session.get('room_code')
            }
            return JsonResponse(data, status=status.HTTP_200_OK)
          return Response({'Bad Request' : 'Invalid room code'},status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Request' : 'Room is null or data is invalid'},status=status.HTTP_400_BAD_REQUEST)

#api for deleting a room after leaving it as the host
class LeaveRoom(APIView):
    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')
            #grab host id
            host_id = self.request.session.session_key
            #filter through room results to find id, if true, make an array of size 1
            room_results = Room.objects.filter(host=host_id)
            token_results = SpotifyToken.objects.filter(user=host_id)
            #if array more than zero (found host id)delete the room
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()
            if len(token_results) > 0:
                token = token_results[0]
                token.delete()
        return Response({'Message':'Room deletion successful!'},status=status.HTTP_200_OK)

#similar to create room view but it is created so that it allows a host to update any room
class UpdateRoom(APIView):
   serializer_class = UpdateRoomSerializer
   def patch(self, request, format=None):
       if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

       serializer = self.serializer_class(data=request.data)
       if serializer.is_valid():
           guest_can_pause = serializer.data.get('guest_can_pause')
           votes_to_skip = serializer.data.get('votes_to_skip')
           code = serializer.data.get('code')

           queryset = Room.objects.filter(code=code)
           if not queryset.exists():
               return Response({'Bad request':'Room not found'}, status=status.HTTP_400_BAD_REQUEST)
               
           room = queryset[0]
           user_id = self.request.session.session_key
           if room.host != user_id:
               return Response({'Forbidden':'You are not the host of this room'},status=status.HTTP_403_FORBIDDEN)
           
           room.guest_can_pause = guest_can_pause
           room.votes_to_skip = votes_to_skip
           room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
           return Response(RoomSerializer(room).data ,status=status.HTTP_200_OK)

       return Response({'Bad Request':'Invalid data...'},status=status.HTTP_400_BAD_REQUEST)
