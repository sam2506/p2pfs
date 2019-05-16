import React from 'react';
import './sidebar.css';
import Axios from 'axios';
import {withRouter} from 'react-router-dom';

var buttons;
var sidebar=(props)=>{
    //console.log(props);
    var logIn=()=>{
        props.history.push('/login');
    }
    var signUp=()=>{
        props.history.push('/signup');
    }
    if(props.online===true){
        buttons=<button onClick={props.setOnline} className="logout">Logout</button>
    }
    else{
        buttons=<div>
            <button onClick={logIn} className="login">Login</button>
            <button onClick={signUp} className="sign">Sign Up</button>
        </div>
    }
    return(
        <div className="sidebar">
            <h1>P2PFS</h1>
            <div className="navhover">
                <h2>Home</h2>
            </div>
            <div className="navhover">
                <h2>Peers</h2>
            </div>
            {buttons}
        </div>
    )
}

export default withRouter(sidebar);