import React,{Component} from 'react';
import './filedetails.css';
import Axios from 'axios';
import socketIOClient from "socket.io-client";

const endpoint='http://localhost:3001/';
const socket=socketIOClient(endpoint);
var incomingData=[],totSize=0;
class filedetails extends Component{
    state={
        Files:[],
    }
    //file details has to be fetched from the database
    //download button will be attached to each file detail
    downloadFile=()=>{
        var fileName='a.mp4';
        var fileSize='3605857';
        //console.log(this.props.email);
        socket.emit('joinRoom',{fileName: fileName,fileSize: fileSize});
    }
    readFileChunk=(File,number)=>{
        var reader=new FileReader();
        console.log(File);
        console.log(number);
        var startByte=1024*1024*number;
        var endByte=Math.min(File.size,startByte+1024*1024);
        console.log(startByte+" "+endByte);
        reader.onload=()=>{
            //socket.to(''+File.fileName).emit('sendFile',{data: reader.result,number : number});
            socket.emit('sendFile',{data: reader.result,number: number,room: File.name,size: File.size});
            return;
        }
        reader.readAsArrayBuffer(File.slice(startByte,endByte));
    }

    downloadComplete=()=>{
        console.log("abhi");
        var blob=new Blob(incomingData);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download ="hello.mp4";
        a.click();
        window.URL.revokeObjectURL(url);
        totSize=0;
    }
   
    render(){
        // Axios.get('http://localhost:27017/fileModel')
        //     .then((res,err)=>{
        //         console.log(res);
        //     })
        socket.removeAllListeners();
        //console.log(this.props.filesData);
        var filesData=this.props.filesData;
        var that=this;
        socket.on(''+this.props.email,function(file){
            console.log("happy");
            for(var itr=0;itr<filesData.length;itr++)
            {
                if(filesData[itr].name===file.fileName){
                    console.log("mil gayi file");
                    that.readFileChunk(filesData[itr],file.number);
                    //socket.to(''+file.fileName).emit('sendFile',);
                }
            }
        })
        socket.on('recieve',function(chunk){
            totSize+=(1024*1024);
            console.log(chunk.data);
            //console.log("chunk"+chunk.number+"recieved");
            console.log("size"+chunk.size);
            console.log(totSize);
            incomingData[chunk.number]=chunk.data;
            if(totSize>=chunk.size){
                socket.emit('leaveRoom',{room: chunk.room});
                socket.on('left',function(data){
                    that.downloadComplete();
                })
            }
        });
        return(
            <div className="filedetails">
                <h3 className="filename">File Name</h3>
                <h3 className="filesize">File Size</h3>
                <button onClick={this.downloadFile} className="download">Download</button>
            </div>
        )
    }
}

export default filedetails;