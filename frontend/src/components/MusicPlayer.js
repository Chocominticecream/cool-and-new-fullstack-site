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
    time,
    duration
}) {

    const songProgress = (time / duration) * 100;

    return(
        <Card>
            <Grid container alignItems="center">
                <Grid item align="center" xs={4}>
                    <img src = {image_url} height="100%" width="100%"/>
                </Grid>
                <Grid item align="center" xs={8}>
                    <Typography component="h5" variant="h5">
                      {title}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle1">
                      {credits}
                    </Typography>
                    <div>
                        <IconButton>
                            {is_playing ? <PauseIcon/> : <PlayArrowIcon/>}
                        </IconButton>
                        
                        <IconButton>
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