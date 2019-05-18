import React,{Component} from 'react';
import './toolbar.css';
import axios from 'axios';
//import socketIOClient from "socket.io-client";

class toolbar extends Component{
    state={
        endpoint: 'http://localhost:3001/',
        file: null
    }
    
    loadFile=(event)=>{
        //const {endpoint} = this.state;
        //const socket = socketIOClient(endpoint);
        var File=event.target.files[0];
        this.setState({file: File});
        /*socket.emit("filesend",File);
        socket.on("fileret",function(file){
            console.log("return");
            console.log(file);*/
            /*incomingData.push(file);
            var blob=new Blob(incomingData);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            var url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download ="hello.mp4";
            a.click();
            window.URL.revokeObjectURL(url);*/
        //})
    }
    upload=()=>{
        var File=this.state.file;
        if(File!==null){
            axios.post("http://localhost:3001/upload",{fileName: File.name,fileSize: File.size,email: this.props.email})
                .then((res,err)=>{
                    if(err)
                    console.log(err);
                    else
                    this.props.storeFile(File);
                });
        }
        else
        console.log("please select a file");
    }
    render(){
        
        return(
            <div className="toolbar">
                <h1 className="head">Files Shared</h1>
                <input className="search" type="text" placeholder="Search"/>
                <button className="searchbut">Search</button>
                <input onChange={this.loadFile} type="file" className="upload"/>
                <button onClick={this.upload} className="upload1">Upload</button>
            </div>
        )
    }
}

export default toolbar;