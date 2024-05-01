import React, {Component, useState} from 'react';
import { Grid, Typography, FormControl, FormHelperText, RadioGroup, FormControlLabel, Radio, TextField, Button } from '@material-ui/core';
import { Link , useNavigate} from 'react-router-dom';

function Roomjoin (){

    const navigate = useNavigate();
    const [state, setState] = useState({
        roomCode: "",
        error: "",
    });
    
//you can write if else statements within the props argument in the component
//so that it can dynamically render
    
//adding an underscore means this is a private method
    const handleTextFieldChange = (e) =>
    {
        setState({
            ...state,
            roomCode: e.target.value
        });
    }

    const roomButtonPressed = (e) =>
    {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: state.roomCode,
            })
        };
        fetch('/api/join-room', requestOptions)
        .then((response) =>{
            //no value is returned from the response, so we will just check if the response is ok
            if(response.ok){
               navigate(`/room/${state.roomCode}`)
            }
            else{
                setState({
                    ...state,
                    error: "Room not found!"
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });

    }
    
    return (
    //centers all grid items
    <Grid container spacing={1} align="center">
      <Grid item xs={12}>
        <Typography component="h4" variant="h4">
           Join a room
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
        error = {state.error}
        label = "Code"
        placeholder = "Enter a room code"
        value = {state.roomCode}
        helperText = {state.error}
        variant = "outlined"
        onChange = {handleTextFieldChange}
        />
      </Grid>

      <Grid item xs={12}>
         <Button variant = "contained" color = "primary" onClick={roomButtonPressed} style={{ margin: '5px',}}>
           Enter Room
         </Button>
         <Button variant = "contained" color = "secondary" to="/" component={Link} style={{ margin: '5px',}}>
           Back
         </Button>
      </Grid>

      <Grid item xs={12}>

      </Grid>
    </Grid>);
    
}

export default Roomjoin;