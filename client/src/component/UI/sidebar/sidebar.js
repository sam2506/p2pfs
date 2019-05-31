import React from 'react';
import './sidebar.css';
import {withRouter} from 'react-router-dom';

var buttons,active;
var sidebar=(props)=>{
    //console.log(props);
    var logIn=()=>{
        props.history.push('/login');
    }
    var signUp=()=>{
        props.history.push('/signup');
    }
    var navClick=()=>{
        props.history.replace('/');
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
    var location=window.location.href;
    var length=location.length;
    if(location[length-1]==='/'){
        active="actv"
    }
    else{
        active="navhover"
    }
    return(
        <div className="sidebar">
            <h1>P2PFS</h1>
            <div className={active}>
                <h2 onClick={navClick}>Home</h2>
            </div>
            <div className="navhover">
                <h2>Peers</h2>
            </div>
            {buttons}
        </div>
    )
}

export default withRouter(sidebar);