import React,{Component} from 'react';
import './filedetails.css';
import socketIOClient from "socket.io-client";
import Axios from 'axios';

//const endpoint='https://p2pfs.herokuapp.com/';
const endpoint='http://localhost:3001';
//const endpoint="*:*";
//const endpoint=window.location.hostname+":3001";
const socket=socketIOClient(endpoint);
var incomingData=[],totSize=0;
class filedetails extends Component{
    state={
        Files:[],
    }
    downloadFile=(event)=>{
        var fileSizeElement=event.target.previousSibling;
        var fileNameElement=fileSizeElement.previousSibling;
        var fileName=fileNameElement.innerHTML;
        var fileSize=fileSizeElement.innerHTML;
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

    downloadComplete=(nameOfFile)=>{
        console.log("abhi");
        var blob=new Blob(incomingData);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download =""+nameOfFile;
        a.click();
        window.URL.revokeObjectURL(url);
        totSize=0;
    }
    componentDidMount(){
        //Axios.get('http://localhost:3001/')
        Axios.get('http://p2pfs.herokuapp.com/')
        .then((res)=>{
            //console.log("aato");
            //console.log(res);
            this.setState({Files: res.data.uploadedFiles});
        })
    }
    render(){
        //console.log(process.env.NODE_ENV);
        //console.log(window.location.hostname);
        socket.removeAllListeners();
        var updatedFiles=this.state.Files;
        var that=this;
        var list=updatedFiles.map((file,index)=>{
            if(file.name.search(that.props.searchText)!==-1)
                return <div key={index} className="list">
                        <h4 className="filename1">{file.name}</h4>
                        <h4 className="filesize1">{file.size}</h4>
                        <button onClick={this.downloadFile} className="download1">Download</button>
                        <hr/>
                    </div>
        });
        var filesData=this.props.filesData;
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
                    socket.removeListener('left');
                    that.downloadComplete(chunk.room);
                })
            }
        });
        socket.on('newFile',function(data){
            console.log(data.updatedFile);
            var files=that.state.Files;
            var flag=0;
            for(var iter=0;iter<files.length;iter++){
                if(files[iter].Email===data.updatedFile.Email){
                    if(files[iter].name===data.updatedFile.name){
                        if(files[iter].size===data.updatedFile.size){
                            flag=1;
                            break;
                        }
                    }
                }
            }
            if(flag===0){
                files.push(data.updatedFile);
                that.setState({Files: files});
            }
        })
        socket.on('logout',function(data){
            var files=that.state.Files;
            for(var iter=0;iter<files.length;iter++){
                if(files[iter].Email===data.email){
                    files.splice(iter,1);
                    iter=iter-1;
                }
            }
            that.setState({Files: files});
        })
        return(
            <div className="filedetails">
                <h3 className="filename">File Name</h3>
                <h3 className="filesize">File Size</h3>
                {list}
            </div>
        )
    }
}

export default filedetails;