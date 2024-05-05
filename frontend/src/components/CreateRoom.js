import React, { useState } from 'react';
import { Grid, Typography, FormControl, FormHelperText, RadioGroup, FormControlLabel, Radio, TextField, Button, Collapse} from '@material-ui/core';
import { Link, useNavigate} from 'react-router-dom';
import { Alert } from '@material-ui/lab';

function CreateRoom({ update = false,
    votesToSkip = 2,
    guestCanPause = true,
    roomCode = null,
    updateCallback = () => {},
    className = "center" }) {
    
    
    const navigate = useNavigate();
    const [state, setState] = useState({
        votesToSkip: votesToSkip,
        guestCanPause: guestCanPause,
        update: update,
        roomCode: roomCode,
        updateCallback: updateCallback,
        successMsg: "",
        errorMsg: "",
        className: className,
    });
    const title = state.update ? "Update Room" : "Create Room"

    const handleVotesChange = (e) => {
        setState({
            ...state,
            votesToSkip: e.target.value
        });
    }

    const handleGuestCanPauseChange = (e) => {
        setState({
        ...state,
        guestCanPause: e.target.value === "true" ? true : false});
    }

    const handleRoomButtonPress = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                votes_to_skip: state.votesToSkip,
                guest_can_pause: state.guestCanPause,
            })
        };

        fetch('/api/create-room', requestOptions)
            .then((response) => response.json())
            .catch((error) => console.error('Error:', error))
            .then((data) => navigate('/room/' + data.code));
    }

    const handleUpdateButtonPress = () => {
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                votes_to_skip: state.votesToSkip,
                guest_can_pause: state.guestCanPause,
                code: state.roomCode,
            })
        };

        fetch('/api/update-room', requestOptions)
            .then((response) => 
             {
               if(response.ok){
                setState({
                    ...state,
                    successMsg: "Room update success!",
                    errorMsg: "" });
               }
               else
               {
                setState({
                    ...state,
                    errorMsg: "Error updating room!",
                    successMsg: "" });
               }
             })
            .catch((error) => console.error('Error:', error));
    }

    const renderCreateButtons = () => {
        return (<Grid container spacing={1}>
        <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={handleRoomButtonPress}>
                    Create A Room
                </Button>
            </Grid>

            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to="/" component={Link}>
                    Back
                </Button>
            </Grid>
        </Grid>)
    }

    const renderUpdateButtons = () => {
        return (<Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={handleUpdateButtonPress}>
                    Update Room
                </Button>
        </Grid>)
    }

    return (
        <Grid container spacing={1} align="center" className={state.className} style={{ backgroundColor: '#F1F5A8', borderRadius: '20px',display: 'inline-block',}}>
            <Grid item xs={12}>
                <Collapse in={state.errorMsg != "" || state.successMsg != ""}>
                    {state.successMsg != "" ? 
                    (<Alert severity = "success" onClose = {()=>{setState({...state,successMsg: ""});}}>{state.successMsg}</Alert>) : 
                    (<Alert severity = "error" onClose = {()=>{setState({...state,errorMsg: ""});}}>{state.errorMsg}</Alert>)}
                </Collapse>
            </Grid>

            <Grid item xs={12}>
                <Typography component="h4" variant="h4">
                    {title}
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align="center">
                            Guest control of playback state
                        </div>
                    </FormHelperText>

                    <RadioGroup row defaultValue={state.guestCanPause.toString()} onChange={handleGuestCanPauseChange}>
                        <FormControlLabel
                            value="true"
                            control={<Radio color="primary" />}
                            label="Play/Pause"
                            labelPlacement="bottom"
                        />

                        <FormControlLabel
                            value="false"
                            control={<Radio color="primary" />}
                            label="No Control"
                            labelPlacement="bottom"
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>

            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField
                        required={true}
                        type="number"
                        defaultValue={state.votesToSkip}
                        onChange={handleVotesChange}
                        inputProps={{ min: 1, style: { textAlign: "center" } }} />

                    <FormHelperText>
                        <div align="center">
                            Votes to skip song:
                        </div>
                    </FormHelperText>
                </FormControl>
            </Grid>

            {state.update ? renderUpdateButtons() : renderCreateButtons()}
        </Grid>
    );
}

export default CreateRoom;
