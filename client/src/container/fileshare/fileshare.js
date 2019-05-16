import React,{Component} from 'react';
import Sidebar from '../../component/UI/sidebar/sidebar';
import Filespace from '../../component/UI/filespace/filespace';
import Signup from '../../component/signup/signup';
import Login from '../../component/login/login';
import {Route} from 'react-router-dom';
import Axios from 'axios';

class fileshare extends Component{
    state={
        online: false,
        email: null
    }
    negateOnline=(email)=>{
        var online=this.state.online;
        var Email=this.state.email;
        if(online===true)
        {
            Axios.post('http://localhost:3001/logout',{email: Email})
            .then=(err,res)=>{}
        }
        this.setState({online: !online,email: email});
    }
    render(){
        return(
            <div>
                <Sidebar online={this.state.online} setOnline={this.negateOnline}/>
                <Route path="/" render={() => (<Filespace email={this.state.email}/>)}/>
                <Route path="/signup" exact component={Signup}/>
                <Route  path="/login" exact
                render={() => (<Login setOnline={this.negateOnline}/>)}/>
            </div>
        )
    }
}

export default fileshare;