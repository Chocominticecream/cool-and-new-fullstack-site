import React, {Component, useState, useEffect} from 'react';
import { Grid, Typography, FormControl, TextField, 
         Button, Input, InputLabel, FormGroup, IconButton} from '@material-ui/core';
import { Link, useParams, useNavigate} from "react-router-dom";
import CreateRoom from './CreateRoom';
import MusicPlayer from './MusicPlayer';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import { useTheme } from '@material-ui/core/styles';


function Room({leaveRoomCallBack}) {
    const theme = useTheme();
    const navigate = useNavigate();
    const { roomCode } = useParams();
    const [state, setState] = useState({
        votesToSkip: 2,
        guestCanPause: false,
        isHost: false,
        showSettings : false,
        spotifyAuthenticated : false,
        showSearch : false,
        song : {},
    });

    useEffect(() => {
        GetRoomDetails()
        }, [])
    
    //terrible way to fetch songs using polling
    //polls a get every runescape tick
    useEffect(() => {
      const interval = setInterval(() => {
        getcurrentSong()
        }, 603);

        return () => clearInterval(interval);
        }, [state.song])
    
    useEffect(() => {
        if (state.isHost){
        authenticateSpotify();
        console.log("welcome host!")}
        else{
        console.log("you are not the host!")
        }
        }, [state.isHost]);
    
    const getcurrentSong = () => {
          fetch("/spotify/current-song")
            .then((response) => {
              if (!response.ok) {
                return {}; // Return an empty object if response is not OK
              } else {
                return response.text(); // Read response as text
              }
            })
            .then((text) => {
              try {
                // Attempt to parse the response text as JSON
                const data = JSON.parse(text);
                // Update state with the parsed JSON data
                setState((prevState) => ({
                  ...prevState,
                  song: data,
                }));
              } catch (error) {
                //catch errors and then forcibly reload the window until the correct result appears
                console.error('Error parsing JSON:', error);
                getcurrentSong();
              }
            })
            .catch((error) => {
              
              console.error('Error fetching current song:', error);
            });
        };


    const leaveButtonPressed = () =>
    {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        }
        fetch("/api/leave-room", requestOptions)
        //dont care what the response is so use an underscore
        .then((_response) => {
            leaveRoomCallBack();
            navigate('/')
        })
       
    } 

    const updateState = (newVotesToSkip, newGuestCanPause, newUpdate, newRoomCode) => {
        setState({
          ...state,
          votesToSkip: newVotesToSkip,
          guestCanPause: newGuestCanPause,
          update: newUpdate,
          roomCode: newRoomCode,
        });
      };

    const UpdateShowSettings = (value) => {
        setState({
            ...state,
            showSettings : value,
            showSearch : false,
        });
    }

    const UpdateShowSearch = (value) => {
      setState({
          ...state,
          showSearch : value,
          showSettings : false,
      });
    }

    function GetRoomDetails(){
        fetch("/api/get-room" + "?roomCode=" + roomCode)
        //the => just returns what is specified on the right side
        .then((response) => {
            if(!response.ok)
            {
                leaveRoomCallBack();
                navigate('/');
            }
            return response.json()})
        //using prevstate so that when updating room details, it will take
        //the current state in to account instead of using a fresh
        //default state to modify the values
        .then((data) => {setState((prevState)=>({
            ...prevState,
            votesToSkip: data.votes_to_skip,
            guestCanPause: data.guest_can_pause,
            isHost: data.is_host,
        }))
        })
        
    }

    const authenticateSpotify = () =>
    {
        //first fetch checks if authenticated
       fetch('/spotify/is-authenticated')
       .then((response) => response.json())
       .then((data) => {
            setState((prevState)=>({
            ...prevState,
            spotifyAuthenticated : data.status,
        }));
        //if not asks for authentication
        if (!data.status){
            fetch('/spotify/get-auth-url')
            .then((response) => response.json())
            .then((data) => {
                //redirect to spotify authorisation page
                window.location.replace(data.url);
            })
        }
       })

    }

    const renderSettings = () =>
    {
        return (<Grid container spacing = {1} style={{ backgroundColor: '#F1F5A8', borderRadius: '20px',}}>
            <Grid item xs={12} align = "center" >
              <CreateRoom update={true} 
              votesToSkip={state.votesToSkip}
              guestCanPause={state.guestCanPause} 
              roomCode = {roomCode}
              updateCallback = {updateState}
              className = {''}/>
            </Grid>

            <Grid item xs={12} align = "center">
            <Button color="secondary" variant="contained" onClick = {() => UpdateShowSettings(false)}>
              Back to Room
            </Button>
            </Grid>
        </Grid>)
    }
    
    //making an element an "item" without centering it will allow it to iterate to the next column
    //to iterate to the next row use align center
    const renderSpotifySearch = () =>
    {
      return (<Grid container spacing = {2} style={{backgroundColor: theme.palette.bgColor.main}}>
        
        <Grid item xs={12} align = "center">
           <Typography component = "h4" variant = "h4">
               Spotify search
          </Typography>
        </Grid>


    
    <Grid item xs={12} align = "center" container spacing = {1} justifyContent ="center">

    <Paper
      component="form"
      sx={{ display: 'flex', alignItems: 'center', width: 400 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Spotify"
        inputProps={{ 'aria-label': 'search spotify' }}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>

  </Grid>


      <Grid item xs={12} align = "center" style={{padding: "10px"}}>
            <Button color="secondary" variant="contained" onClick = {() => UpdateShowSearch(false)}>
              Back to Room
            </Button>
        </Grid>
      </Grid>)
    }

    const renderSettingsButton = () =>
    {
        return(
          <Grid item xs={12} align = "center">
            <Button color="primary" variant="contained" onClick={() => UpdateShowSettings(true)}>
              Settings
            </Button>
          </Grid>
        )
    }

    const renderSearchButton = () =>
      {
          return(
            <Grid item xs={12} align = "center">
              <Button color="primary" variant="contained" onClick={() => UpdateShowSearch(true)}>
                Add a song to queue
              </Button>
            </Grid>
          )
      }
        
        if (state.showSearch)
        {return renderSpotifySearch();}


        if (state.showSettings)
        {return <Grid className='center'> {renderSettings()};</Grid>}
        
        
        return (
        <div className='center'>
        <Grid container spacing = {1}>
          <Grid item xs={12} align = "center">
            <Typography component = "h4" variant = "h4" style={{color: '#F1F5A8'}}>
                Room {roomCode}
            </Typography>
          </Grid>
          
          <Grid  Grid item xs={12} align = "center">
          <MusicPlayer {...state.song}/>
          </Grid>
          

          {renderSearchButton()}

          {state.isHost ? renderSettingsButton() : null}

          <Grid item xs={12} align = "center">
            <Button color="secondary" variant="contained" onClick={leaveButtonPressed}>
              Leave Room
            </Button>
          </Grid>
        </Grid>
        </div>);
    
}

export default Room;