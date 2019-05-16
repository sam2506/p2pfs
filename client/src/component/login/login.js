import React from 'react';
import './login.css';
import Axios from 'axios';
import {withRouter} from 'react-router-dom';

var email,password;
var login=(props)=>{
    //console.log(props);
    var cancel=()=>{
        props.history.replace('/');
    }
    var login=()=>{
        Axios.post('http://localhost:3001/login',{
            email: email,
            password: password
        }).then((res,err)=>{
            if(err)
                console.log(err);
            else{
                props.history.replace('/');
                props.setOnline(email);
            }
        });
    }
    var changedVal=(event)=>{
        if(event.target.id==='e')
            email=event.target.value;
        if(event.target.id==='p')
            password=event.target.value;
    }
    return(
        <div className="loginup">
            <h1 className="logined">Login</h1>
            <input id="e" onChange={changedVal} className="firsts" type="text" placeholder="email"/>
            <input id="p" onChange={changedVal} className="firsts" type="text" placeholder="password"/>
            <button onClick={cancel} className="cancels">Cancel</button>
            <button onClick={login} className="signupbuts">Login</button>
        </div>
    )
}

export default withRouter(login);