import React, {Component, useState} from "react";
import { render } from "react-dom";
import Homepage from "./Homepage";
import Motion from "./Motion.js";
import Roomjoin from "./Roomjoin";
import CreateRoom from "./CreateRoom";
import { ThemeProvider, createTheme } from '@material-ui/core';
import { lime, green } from '@material-ui/core/colors';
import theme from '../styles/styles.js';

function App() {
    
    const [state, setState] = useState({
        
    });
    

//you can write if else statements within the props argument in the component
//so that it can dynamically render
    
        
        return (
        
        <div>
        <Motion/>
        <Homepage />
        </div>);
    
}

export default App;

//you can add a props argument in here to be rendered by the render function
const appDiv = document.getElementById("app");
render (<App/>, appDiv);