# cool-and-new-fullstack-site
 A fullstack website i created myself using tutorials, most of the code comes from the techwithtim yt channel. With a few adjustments so that it works with react router v6 and functional components.
 It uses spotify API

 At the time of creation, this site is basically a music controller site for spotify, that allows guests to join a room and skip songs when played from a main device, functionally similar to how kahoot works but its a music player. It isn't much at the moment.

Future plans
- ~~fully implement base functionalities : vote skipping, playing and pausing~~
- a search function to allow guests to suggest songs
- if there are no songs, it will play from the host's playlist
- deploy this site with postgresSQL, then make a private repository version of the site (so that no one can mess with the data)

 Requirements for running locally:
 - anaconda

 Instructions to run locally on vscode:
 1.) open up two terminals
 2.) on one of the terminals do "conda activate base"
 3.) on the same terminal do "python manage.py runserver 0.0.0.0:8000"
 4.) on another terminal do "npm run dev"
 5.) on your device, you can go to http://127.0.0.1:8000/ to access the webapp

 To have other devices locally connect:
 6.) open up CMD and do "ipconfig /all"
 7.)get the ipv4 address of your wiress LAN server
 8.) when accessing through another device do ipv4address:8000

 I couldnt get the local connection to work so I am planning to deploy a hosted version, this version will serve as a base for people who want to improve on it
  
 
