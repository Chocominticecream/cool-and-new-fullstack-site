import React, {useState, useEffect} from 'react';
import { Grid, Typography, Card, IconButton, LinearProgress } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';

function MusicPlayer({
    image_url = 'https://www.solidscape.com/wp-content/uploads/2021/04/640x640_placeholder.png',
    title = 'Loading song!',
    credits = 'make sure your spotify is playing or you have premium!',
    is_playing,
    votes = 0,
    votes_required = 99,
    time,
    duration
}) {

    function skipSong()
    {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
         };
         fetch("/spotify/skip", requestOptions);
    }

    function playSong()
    {
        const requestOptions = {
            method: "PUT",
            headers: {"Content-Type" : "application/json"},
         };
        fetch("/spotify/play", requestOptions);
        
    }

    function pauseSong()
    {
       const requestOptions = {
          method: "PUT",
          headers: {"Content-Type" : "application/json"},
       };
       fetch("/spotify/pause", requestOptions);
    }

    const songProgress = (time / duration) * 100;
    // when putting signalling functioncs(onclick) you can use either () => {function} or 
    //make the function a constant and do function = () => and then in the signalling variable {function}
    return(
        <Card>
            <Grid container alignItems="center">
                <Grid item align="center" xs={4}>
                    <img src = {image_url} height="100%" width="100%"/>
                </Grid>
                <Grid item align="center" xs={8}>
                    <Typography component="h6" variant="h6">
                       Votes to Skip: {votes} / {votes_required}
                    </Typography>
                    <Typography component="h5" variant="h5">
                      {title}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle1">
                      {credits}
                    </Typography>
                    <div>
                        <IconButton onClick ={()=>{is_playing ? pauseSong() : playSong()}}>
                            {is_playing ? <PauseIcon/> : <PlayArrowIcon/>}
                        </IconButton>
                        
                        
                        <IconButton onClick ={()=>{skipSong()}}>
                            <SkipNextIcon /> 
                        </IconButton>
                    </div>
                </Grid>
            </Grid>

            <LinearProgress variant="determinate" value={songProgress}/>
        </Card>
    )
}

    

export default MusicPlayer;