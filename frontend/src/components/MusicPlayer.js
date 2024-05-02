import React, {useState, useEffect} from 'react';
import { Grid, Typography, Card, IconButton, LinearProgress } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';

function MusicPlayer({
    image_url,
    title,
    credits,
    is_playing,
    votes,
    votes_required,
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
                <Typography component="h4" variant="h4">
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