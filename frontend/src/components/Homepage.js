import React, {Component,  useEffect, useState} from 'react';
import Roomjoin from "./Roomjoin";
import CreateRoom from "./CreateRoom";
import Room from "./Room";
import { BrowserRouter as Router, Routes, Route, Link , Navigate} from "react-router-dom";
import { Grid, Typography, FormControl, FormHelperText, RadioGroup, FormControlLabel, Radio, TextField, Button, ButtonGroup } from '@material-ui/core';
import { ThemeProvider, createTheme } from '@material-ui/core';
import theme from '../styles/styles.js';

function Homepage(){

const [state, setState] = useState({
        roomCode: null,
});

useEffect(() => {
//we dont have to wait for this to finish before running other things
//as soon as a reponse is received, we can run this
//runs in parallel with other code
async function pseudoMount()
{
  fetch('api/user-in-room')
  .then((response)=> response.json())
  .then((data) => {
    setState({
        ...state,
        roomCode: data.code,
    });
  });
}
pseudoMount()

}, [])

//reset room code to null
const clearRoomCode = () =>{
    setState({
        ...state,
        roomCode: null,
    });

}

function renderHomePage(){
    return(<Grid container spacing={3} align="center">
        <Grid item xs ={12}>
          <Typography variant="h3" compact="h3">
            House Party!
          </Typography>
        </Grid>
     
        <Grid item xs ={12}>
            <ButtonGroup disableElevation variant="contained" color="primary">
                <Button color="primary" to="/join" component={Link}>
                  Join a room
                </Button>
                <Button color="secondary" to="/create" component={Link}>
                  Create a room
                </Button>
            </ButtonGroup>
        </Grid>
    </Grid>);
}
    
//you can write if else statements within the props argument in the component
//so that it can dynamically render
//within a group of routes you can also add a theme/background wrapped around the router and apply
//that effect for a group of themes
        return (
          <ThemeProvider theme = {theme}>
            <Router>
              <Routes>
                <Route exact path = '/' element = {state.roomCode ? <Navigate replace to={`/room/${state.roomCode}`}/> : renderHomePage()}/>
                <Route path = '/join' element = {<Roomjoin/>}/>
                <Route path = '/create' element = {<CreateRoom/>}/>
                <Route path = '/room/:roomCode' element = {<Room leaveRoomCallBack={clearRoomCode}/>}/>
              </Routes>
            </Router>
            </ThemeProvider>);
}

export default Homepage;