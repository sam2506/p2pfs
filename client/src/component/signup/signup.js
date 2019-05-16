import React from 'react';
import './signup.css';
import Axios from 'axios';

var firstName,lastName,email,password,confirmPass;
var signup=(props)=>{
    var cancel=()=>{
        props.history.replace('/');
    }
    var signup=()=>{
        Axios.post('http://localhost:3001/signup',{
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            confirmPass: confirmPass
        }).then(res=>{
            console.log("hello");
            props.history.replace('/'); 
        });
    }
    var changedVal=(event)=>{
        if(event.target.id==='f')
            firstName=event.target.value;
        if(event.target.id==='l')
            lastName=event.target.value;
        if(event.target.id==='e')
            email=event.target.value;
        if(event.target.id==='p')
            password=event.target.value;
        if(event.target.id==='c')
            confirmPass=event.target.value;
        
    }
    return(
        <div className="signup">
            <h1 className="signed">Signup</h1>
            <input id="f" onChange={changedVal} className="first" type="text" placeholder="firstname"/>
            <input id="l" onChange={changedVal} className="first" type="text" placeholder="lastname"/>
            <input id="e" onChange={changedVal} className="first" type="text" placeholder="email"/>
            <input id="p" onChange={changedVal} className="first" type="text" placeholder="password"/>
            <input id="c" onChange={changedVal} className="first" type="text" placeholder="confirm password"/>
            <button onClick={cancel} className="cancel">Cancel</button>
            <button onClick={signup} className="signupbut">Signup</button>
        </div>
    )
}

export default signup;