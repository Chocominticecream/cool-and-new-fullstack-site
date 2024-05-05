# cool-and-new-fullstack-site
 A fullstack website i created myself using tutorials using te django framework, most of the code comes from the techwithtim yt channel. With a few adjustments so that it works with react router v6 and functional components.
 It uses spotify API

 At the time of creation, this site is basically a music controller site for spotify, that allows guests to join a room and skip songs when played from a main device, functionally similar to how kahoot works but its a music player. It isn't much at the moment.

Future plans
- ~~fully implement base functionalities : vote skipping, playing and pausing~~
- a search function to allow guests to suggest songs
- if there are no songs, it will play from the host's playlist
- Allow guests to add to a queue, one per guest
- deploy this site with postgresSQL, make github ignore settings.py when pushing for security reasons

 Requirements for running locally:
 - anaconda
 - your own spotify web api

 Instructions to run locally on vscode:
 
 1.) open up two terminals
 
 2.) on one of the terminals do "conda activate base"
 
 3.) on the same terminal do "python manage.py runserver 0.0.0.0:8000"

 4.) on another terminal do "cd ./frontend" then "npm run dev"
 
 5.) on your device, you can go to http://127.0.0.1:8000/ to access the webapp

 To have other devices locally connect:
 
 6.) open up CMD and do "ipconfig /all"
 
 7.)get the ipv4 address of your wifi (should be under wireless LAN)

 8.)in the my_app folder, click on settings.py and find the ALLOWED_HOSTS list, add your ipv4 address to the list of ALLOWED_HOSTS:

 eg. your ip address is 10.0.0.0 , your ALLOWED_HOSTS should look like this AFTER adding in the address: ['0.0.0.0', '127.0.0.1', '10.0.0.0']

 8.) go to the spotify folder and inside credentials.py, replace the CLIENT_ID, CLIENT_SECRET and BASE_URI with your client secret and id
 for the BASE_URL, create an address in this format: "http://{your_ip_here}:8000/spotify/redirect", dont forget to add that base uri to the your spotify api!
 
 9.) when accessing through another device do ipv4address:8000

 At this moment the process to make this webapp usable on wifi is quite troublesome, so i might be finding a way to circumvent this/make this easier. 
I am also planning to deploy it so that people who want to actually use this webapp don't have to go through the hassle. The local version will simply serve as a version for
people who want to improve on it 

bugs to fix: 
- ~~play/pause button not being relfected correctly (glitchy)~~ (fixed?, music should update properly now, albeit lagging a bit)
- ~~each guest can vote multiple times (its not supposed to do that)~~ (fixed, now to add some fancy warning to notify users they cant vote multiple times)
 
