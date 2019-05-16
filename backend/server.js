const mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const socketIO = require("socket.io");
const http = require("http");
const fs=require('fs');
var session = require('express-session');

const API_PORT = 3001;
const app = express();
app.use(cors());
//app.use(cors({origin:"http://localhost:3000",credentials:true}));
app.options('*',cors());
const router = express.Router();
/*const httpsOptions = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./server.crt')
  }*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({secret: 'ssshhhhh'}));
app.use(logger("dev"));
app.use("/api", router);

var {fileModel}=require('./model/model');
mongoose.Promise=global.Promise;
mongoose.connect("mongodb://localhost:27017/filemodel");

//var server=http.createServer(httpsOptions,app);
var server=http.createServer(app);
var io=socketIO(server);
server.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));

var sess,no;

app.post('/signup',function(req,res){
    var file=new fileModel({
        files: [],
        fname: req.body.firstName,
        lname: req.body.lastName,
        email: req.body.email,
        pwd: req.body.password,
        online: false
    });
    file.save();
    res.end();
});

app.post('/login',function(req,res){
    sess=req.session;
    fileModel.findOne({email: req.body.email},function(err,result){
        if(err){
            console.log(err);
        }
        else{
            if(result){
                if(req.body.password===result.pwd){
                    sess.email=req.body.email;
                    fileModel.findOneAndUpdate({email: req.body.email},{online: true},function(err1,result1){
                        res.send("valid");
                    });
                }
                else{
                    console.log("Wrong email or password");
                }
            }
            else{
                console.log("you need to sign up first");
            }
        }
    }) 
})

app.post('/logout',function(req,res){
    console.log(req.body.email);
    fileModel.findOneAndUpdate({email: req.body.email},{online: false,$pull:{files:{}}},function(err,result){
        if(err){
            console.log(err);
        }
        else{
            if(result){
                console.log("loggedout");
            }
            else
            console.log("patanhi");
            res.end();
        }
    })
})

app.post('/upload',function(req,res){
    sess=req.session;
    console.log(req.body.fileName);
    console.log(req.body.fileSize);
    console.log(sess.email);
    fileModel.findOneAndUpdate({email: req.body.email},{$push:{files: {name: req.body.fileName,size: req.body.fileSize}}},function(err,result){
        if(result)
            console.log("done");  
        res.end();
    });
});

sendSignal=(roomName,size)=>{
    fileModel.find({online: true},function(err,res){
        var cnt=0;
        res.forEach(function(user){
            for(var i=0;i<user.files.length;i++){
                if(user.files[i].name===roomName){
                    var email=user.email;
                    //console.log("aur ye");
                    io.emit(''+email,{fileName: roomName,number: no});
                    no++;
                }
            }
        })
        if(((no)*1024*1024)<size)
            sendSignal(roomName,size);
        /*else{
            return;
        }*/
    })
}

io.on("connection",function(socket){
    socket.on("filesend",function(file){
        io.emit("fileret",file);
    })
    socket.on('joinRoom',function(file){
        var roomName=file.fileName;
        socket.join(''+roomName);
        var room = io.sockets.adapter.rooms[''+roomName];
        var noOfClients=room.length;
        no=0;
        
        if(noOfClients>=1)
        {
            sendSignal(roomName,file.fileSize);
            //socket.leave(''+roomName);
        }
        //sendSignal(noOfClients,room,roomName,file.fileSize);

    })
    socket.on('sendFile',function(info){
        console.log("ye aaya");
        console.log(info.data);
        socket.to(''+info.room).emit('recieve',{room:info.room,data: info.data,number: info.number,size: info.size});
    })
    socket.on('leaveRoom',function(info){
        console.log(info.room);
        socket.leave(''+info.room);
        io.emit('left',{});
    })
})


